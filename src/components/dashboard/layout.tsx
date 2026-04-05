import { useEffect, useState, useCallback, useRef } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { SidebarProvider, BottomNav, useSidebarState } from "@/components/dashboard/sidebar"
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { FundSearchDialog } from "@/components/explore/fund-search-dialog"
import { fetchBookmarks, addBookmark, removeBookmark } from "@/services/funds"
import { IconSearch, IconCommand } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useTransactionStore } from "@/stores/transaction-store"
import { toast } from "sonner"
import type { Fund } from "@/data/funds"

function LayoutShell() {
  const { collapsed } = useSidebarState()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const selectFundRef = useRef<((fund: Fund) => void) | null>(null)
  const initTransactions = useTransactionStore((s) => s.init)
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: savedFundIds = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  })

  const { mutate: toggleSave } = useMutation({
    mutationFn: (fundId: string) => {
      const isSaved = savedFundIds.includes(fundId)
      return isSaved ? removeBookmark(fundId) : addBookmark(fundId)
    },
    onMutate: async (fundId) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] })
      const previous = queryClient.getQueryData<string[]>(["bookmarks"])
      queryClient.setQueryData<string[]>(["bookmarks"], (old = []) => {
        return old.includes(fundId)
          ? old.filter((id) => id !== fundId)
          : [...old, fundId]
      })
      return { previous }
    },
    onError: (_err, _fundId, context) => {
      queryClient.setQueryData(["bookmarks"], context?.previous)
      toast.error("Failed to update bookmark")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })

  useEffect(() => {
    initTransactions()
  }, [initTransactions])

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleToggleSave = useCallback((fundId: string) => {
    const wasSaved = savedFundIds.includes(fundId)
    toggleSave(fundId)
    toast.success(wasSaved ? "Removed from saved" : "Added to saved")
  }, [savedFundIds, toggleSave])

  const handleSelectFund = useCallback((fund: Fund) => {
    if (location.pathname === "/dashboard/explore" && selectFundRef.current) {
      selectFundRef.current(fund)
    } else {
      navigate("/dashboard/explore", { state: { selectedFundId: fund.id } })
    }
  }, [navigate, location.pathname])

  return (
    <div
      className={cn(
        "flex min-h-svh flex-col transition-all duration-200",
        collapsed ? "md:ml-14" : "md:ml-56"
      )}
    >
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 shadow-[0_1px_12px_-4px_oklch(0.55_0.17_162/0.08)] backdrop-blur-md dark:shadow-[0_1px_12px_-4px_oklch(0.65_0.17_162/0.12)] md:px-6">
        {/* Search trigger in header */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-8 items-center gap-2 rounded-md border border-border bg-muted/50 px-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:px-3"
        >
          <IconSearch className="size-3.5 shrink-0" />
          <span className="hidden text-muted-foreground sm:inline">Search funds...</span>
          <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[0.6rem] font-medium sm:inline-flex">
            <IconCommand className="size-2.5" />K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>

      <main className="flex-1 bg-grid-pattern p-4 pb-20 md:p-6 md:pb-6">
        <Outlet context={{ setSearchOpen, selectFundRef }} />
      </main>

      <BottomNav />

      {/* Global fund search dialog */}
      <FundSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSelectFund}
        savedFundIds={savedFundIds}
        onToggleSave={handleToggleSave}
      />
    </div>
  )
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  )
}
