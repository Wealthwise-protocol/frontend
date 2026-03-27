import { useState, useMemo, useCallback, useEffect, type MutableRefObject } from "react"
import { useLocation, useOutletContext } from "react-router-dom"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { type Fund } from "@/data/funds"
import { fetchFunds, fetchBookmarks, addBookmark, removeBookmark } from "@/services/funds"
import { FundCard } from "@/components/explore/fund-card"
import { FundDetail } from "@/components/explore/fund-detail"
import { Button } from "@/components/ui/button"
import { IconSearch, IconBookmark, IconLoader2, IconCommand, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"
import { toast } from "sonner"

const PAGE_SIZE = 12
const categories = ["All Funds", "Equity", "Debt", "ELSS", "Hybrid", "Index", "Saved"]

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages: (number | "ellipsis")[] = [0]
  if (current > 2) pages.push("ellipsis")
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 3) pages.push("ellipsis")
  pages.push(total - 1)
  return pages
}

type LayoutContext = {
  setSearchOpen: (open: boolean) => void
  selectFundRef: MutableRefObject<((fund: Fund) => void) | null>
}

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All Funds")
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()
  const { setSearchOpen, selectFundRef } = useOutletContext<LayoutContext>()
  const location = useLocation()

  const isSavedTab = activeCategory === "Saved"

  const { data, isLoading: isPageLoading, isError: isPageError, isPlaceholderData } = useQuery({
    queryKey: ["funds", page],
    queryFn: () => fetchFunds(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
    enabled: !isSavedTab,
  })

  const { data: savedFundIds = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  })

  // Fetch all funds to resolve saved tab (need full fund objects for bookmarked IDs)
  const { data: allFundsData, isLoading: isSavedLoading, isError: isSavedError } = useQuery({
    queryKey: ["funds", "all"],
    queryFn: () => fetchFunds(0, 100),
    enabled: isSavedTab,
  })

  const funds = isSavedTab ? (allFundsData?.content ?? []) : (data?.content ?? [])
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0
  const isLoading = isSavedTab ? isSavedLoading : isPageLoading
  const isError = isSavedTab ? isSavedError : isPageError

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

  // Register setSelectedFund so the layout can call it directly
  useEffect(() => {
    selectFundRef.current = setSelectedFund
    return () => { selectFundRef.current = null }
  }, [selectFundRef])

  // Handle fund selection from global search (navigated here with state)
  useEffect(() => {
    const state = location.state as { selectedFundId?: string } | null
    if (state?.selectedFundId) {
      const fund = funds.find((f) => f.id === state.selectedFundId)
      if (fund) setSelectedFund(fund)
      window.history.replaceState({}, "")
    }
  }, [location.state, funds])

  const handleToggleSave = useCallback((fundId: string) => {
    const wasSaved = savedFundIds.includes(fundId)
    toggleSave(fundId)
    toast.success(wasSaved ? "Removed from saved" : "Added to saved")
  }, [savedFundIds, toggleSave])

  const filtered = useMemo(() => {
    return funds.filter((f) => {
      const matchesCategory =
        activeCategory === "All Funds"
          ? true
          : activeCategory === "Saved"
            ? savedFundIds.includes(f.id)
            : f.category === activeCategory
      return matchesCategory
    })
  }, [activeCategory, savedFundIds, funds])

  return (
    <>
      <FadeIn>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Fund Explorer</h1>
      </FadeIn>

      {/* Search trigger — clicking opens the command palette */}
      <FadeIn delay={0.1}>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative mt-4 flex h-9 w-full items-center rounded-md border border-border bg-transparent px-3 text-sm shadow-xs transition-colors hover:border-primary/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:mt-6"
        >
          <IconSearch className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-left text-xs text-muted-foreground">
            Search for mutual funds, categories, or AMCs...
          </span>
          <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[0.6rem] font-medium text-muted-foreground sm:inline-flex">
            <IconCommand className="size-2.5" />K
          </kbd>
        </button>
      </FadeIn>

      {/* Category filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat)
              setPage(0)
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              cat === "Saved" && "inline-flex items-center gap-1"
            )}
          >
            {cat === "Saved" && <IconBookmark className="size-3" />}
            {cat}
            {cat === "Saved" && savedFundIds.length > 0 && (
              <span className={cn(
                "ml-0.5 inline-flex size-4 items-center justify-center rounded-full text-[0.55rem] font-bold",
                activeCategory === "Saved"
                  ? "bg-primary-foreground text-primary"
                  : "bg-muted-foreground/20 text-muted-foreground"
              )}>
                {savedFundIds.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="mt-12 flex flex-col items-center gap-2">
          <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading funds...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="mt-12 text-center">
          <p className="text-sm text-destructive">Failed to load funds. Please try again later.</p>
        </div>
      )}

      {/* Results count */}
      {!isLoading && !isError && (
        <>
          <p className="mt-4 text-xs text-muted-foreground">
            {activeCategory === "All Funds"
              ? `Showing ${funds.length} of ${totalElements} funds`
              : `${filtered.length} fund${filtered.length !== 1 ? "s" : ""} found`}
          </p>

          {/* Fund grid */}
          <StaggerContainer key={`${activeCategory}-${page}`} className="mt-4 grid gap-4 sm:grid-cols-2">
            {filtered.map((fund) => (
              <StaggerItem key={fund.id}>
                <FundCard
                  fund={fund}
                  onSelect={setSelectedFund}
                  saved={savedFundIds.includes(fund.id)}
                  onToggleSave={handleToggleSave}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                {activeCategory === "Saved"
                  ? "No saved funds yet. Bookmark funds to see them here."
                  : "No funds found matching your criteria."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && activeCategory === "All Funds" && (
            <nav
              role="navigation"
              aria-label="pagination"
              className="mt-6 flex items-center justify-center gap-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2.5 text-xs"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <IconChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="flex size-8 items-center justify-center text-xs text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="size-8 text-xs"
                    onClick={() => setPage(p)}
                    disabled={isPlaceholderData}
                  >
                    {p + 1}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2.5 text-xs"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                <span className="hidden sm:inline">Next</span>
                <IconChevronRight className="size-3.5" />
              </Button>
            </nav>
          )}
        </>
      )}

      {/* Fund detail drawer */}
      <FundDetail
        fund={selectedFund}
        open={!!selectedFund}
        onClose={() => setSelectedFund(null)}
      />
    </>
  )
}
