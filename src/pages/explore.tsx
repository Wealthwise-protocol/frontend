import { useState, useMemo, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type Fund } from "@/data/funds"
import { fetchFunds, fetchBookmarks, addBookmark, removeBookmark } from "@/services/funds"
import { FundCard } from "@/components/explore/fund-card"
import { FundDetail } from "@/components/explore/fund-detail"
import { Input } from "@/components/ui/input"
import { IconSearch, IconBookmark, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"
import { toast } from "sonner"

const categories = ["All Funds", "Equity", "Debt", "ELSS", "Hybrid", "Index", "Saved"]

type LayoutContext = {
  setSearchOpen: (open: boolean) => void
  selectFundRef: MutableRefObject<((fund: Fund) => void) | null>
}

export function ExplorePage() {
  const [search] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Funds")
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const queryClient = useQueryClient()

  const { data: funds = [], isLoading, isError } = useQuery({
    queryKey: ["funds"],
    queryFn: fetchFunds,
  })

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
      const matchesSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.amc.toLowerCase().includes(search.toLowerCase()) ||
        f.subcategory.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory, savedFundIds, funds])

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Fund Explorer</h1>
      </FadeIn>

      {/* Search trigger — clicking opens the command palette */}
      <FadeIn delay={0.1}>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative mt-6 flex h-9 w-full items-center rounded-md border border-border bg-transparent px-3 text-sm shadow-xs transition-colors hover:border-primary/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
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
            onClick={() => setActiveCategory(cat)}
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
            {filtered.length} fund{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Fund grid */}
          <StaggerContainer key={activeCategory + search} className="mt-4 grid gap-4 sm:grid-cols-2">
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
