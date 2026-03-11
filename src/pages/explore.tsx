import { useState, useMemo } from "react"
import { funds, type Fund } from "@/data/funds"
import { FundCard } from "@/components/explore/fund-card"
import { FundDetail } from "@/components/explore/fund-detail"
import { Input } from "@/components/ui/input"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"

const categories = ["All Funds", "Equity", "Debt", "ELSS", "Hybrid", "Index"]

export function ExplorePage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Funds")
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)

  const filtered = useMemo(() => {
    return funds.filter((f) => {
      const matchesCategory =
        activeCategory === "All Funds" || f.category === activeCategory
      const matchesSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.amc.toLowerCase().includes(search.toLowerCase()) ||
        f.subcategory.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

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
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {cat}
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
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            No funds found matching your criteria.
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
