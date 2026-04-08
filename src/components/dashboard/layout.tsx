import { useEffect, useState, useCallback, useRef } from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { PageTransition } from "@/components/ui/animated"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { SidebarProvider, BottomNav } from "@/components/dashboard/sidebar"
import { useSidebarState } from "@/components/dashboard/sidebar-context"
import { SessionTimeoutModal } from "@/components/session-timeout-modal"
import { OfflineBanner } from "@/components/offline-banner"
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { FundSearchDialog } from "@/components/explore/fund-search-dialog"
import { fetchBookmarks, addBookmark, removeBookmark } from "@/services/funds"
import { IconSearch, IconCommand } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Fund } from "@/data/funds"

function LayoutShell() {
  const { collapsed } = useSidebarState()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const selectFundRef = useRef<((fund: Fund) => void) | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: savedFundIds = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm card-shadow px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Logo — visible on mobile only */}
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src="/wealthwiselogonobg.png" alt="WealthWise" className="size-6 shrink-0" />
            <span className="text-sm font-bold tracking-wide text-primary">WealthWise</span>
          </Link>

          {/* Search trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-8 items-center gap-2 rounded-md border border-border bg-background px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3 md:flex"
          >
            <IconSearch className="size-3.5 shrink-0" />
            <span className="hidden text-muted-foreground sm:inline">Search funds...</span>
            <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[0.6rem] font-medium sm:inline-flex">
              <IconCommand className="size-2.5" />K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Search icon on mobile */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted-foreground md:hidden"
            aria-label="Search funds"
          >
            <IconSearch className="size-4" />
          </button>
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>

      <OfflineBanner />

      <main id="main-content" className="flex-1 bg-grid-pattern p-4 pb-24 md:p-6 md:pb-6">
        <PageTransition locationKey={location.pathname}>
          <Outlet context={{ setSearchOpen, selectFundRef }} />
        </PageTransition>
      </main>

      <BottomNav />
      <SessionTimeoutModal />

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
