import { useState, useMemo, useCallback } from "react"
import { funds, type Fund } from "@/data/funds"
import { FundCard } from "@/components/explore/fund-card"
import { FundDetail } from "@/components/explore/fund-detail"
import { Input } from "@/components/ui/input"
import { IconSearch, IconBookmark } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"
import { useExploreStore } from "@/stores/explore-store"
import { toast } from "sonner"

const categories = ["All Funds", "Equity", "Debt", "ELSS", "Hybrid", "Index", "Saved"]

export function ExplorePage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Funds")
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const { savedFundIds, toggleSave } = useExploreStore()

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
  }, [search, activeCategory, savedFundIds])

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Fund Explorer</h1>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.1} className="relative mt-6">
        <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for mutual funds, categories, or AMCs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
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

      {/* Results count */}
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

      {/* Fund detail drawer */}
      <FundDetail
        fund={selectedFund}
        open={!!selectedFund}
        onClose={() => setSelectedFund(null)}
      />
    </>
  )
}
