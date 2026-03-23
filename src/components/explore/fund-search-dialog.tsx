import { useEffect, useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { type Fund } from "@/data/funds"
import { fetchFunds } from "@/services/funds"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  IconTrendingUp,
  IconBookmark,
  IconBookmarkFilled,
  IconLoader2,
} from "@tabler/icons-react"

const riskColors: Record<string, string> = {
  LOW: "border-emerald-500/30 text-emerald-500",
  MODERATE: "border-yellow-500/30 text-yellow-500",
  HIGH: "border-orange-500/30 text-orange-500",
  "VERY HIGH": "border-red-500/30 text-red-500",
}

const categoryOrder = ["Equity", "Debt", "Hybrid", "ELSS", "Index"] as const

export function FundSearchDialog({
  open,
  onOpenChange,
  onSelect,
  savedFundIds = [],
  onToggleSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (fund: Fund) => void
  savedFundIds?: string[]
  onToggleSave?: (fundId: string) => void
}) {
  const [query, setQuery] = useState("")

  const { data: funds = [], isLoading } = useQuery({
    queryKey: ["funds"],
    queryFn: fetchFunds,
  })

  // Reset query when dialog opens
  useEffect(() => {
    if (open) setQuery("")
  }, [open])

  const filtered = useMemo(() => {
    if (!query) return funds
    const q = query.toLowerCase()
    return funds.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.amc.toLowerCase().includes(q) ||
        f.subcategory.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    )
  }, [query, funds])

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, Fund[]>()
    for (const fund of filtered) {
      const list = map.get(fund.category) || []
      list.push(fund)
      map.set(fund.category, list)
    }
    return categoryOrder
      .filter((cat) => map.has(cat))
      .map((cat) => ({ category: cat, funds: map.get(cat)! }))
  }, [filtered])

  function handleSelect(fund: Fund) {
    onOpenChange(false)
    onSelect(fund)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Funds"
      description="Search for mutual funds by name, AMC, or category"
      className="sm:max-w-xl"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search funds, AMCs, categories..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-80 sm:max-h-96">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-4">
                <p className="text-sm text-muted-foreground">No funds found</p>
                <p className="text-xs text-muted-foreground/60">
                  Try searching by fund name, AMC, or category
                </p>
              </div>
            </CommandEmpty>
          )}

          {grouped.map((group, i) => (
            <div key={group.category}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={group.category}>
                {group.funds.map((fund) => {
                  const isSaved = savedFundIds.includes(fund.id)
                  return (
                    <CommandItem
                      key={fund.id}
                      value={`${fund.name} ${fund.amc} ${fund.subcategory}`}
                      onSelect={() => handleSelect(fund)}
                      className="!py-2.5"
                    >
                      <div className="flex w-full items-center gap-3">
                        {/* Fund info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-semibold">
                              {fund.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "hidden shrink-0 text-[0.5rem] sm:inline-flex",
                                riskColors[fund.risk]
                              )}
                            >
                              {fund.risk}
                            </Badge>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="truncate text-[0.65rem] text-muted-foreground">
                              {fund.amc}
                            </span>
                            <span className="hidden text-[0.6rem] text-muted-foreground/50 sm:inline">
                              ·
                            </span>
                            <span className="hidden text-[0.6rem] text-muted-foreground/70 sm:inline">
                              {fund.subcategory}
                            </span>
                          </div>
                        </div>

                        {/* Returns */}
                        <div className="hidden shrink-0 items-center gap-1 sm:flex">
                          <IconTrendingUp className="size-3 text-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-500">
                            {fund.returns["1Y"]}%
                          </span>
                          <span className="text-[0.55rem] text-muted-foreground">
                            1Y
                          </span>
                        </div>

                        {/* Bookmark */}
                        {onToggleSave && (
                          <button
                            className={cn(
                              "shrink-0 p-1 transition-colors",
                              isSaved
                                ? "text-primary hover:text-primary/80"
                                : "text-muted-foreground/40 hover:text-muted-foreground"
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              onToggleSave(fund.id)
                            }}
                            aria-label={
                              isSaved ? "Remove from saved" : "Save fund"
                            }
                          >
                            {isSaved ? (
                              <IconBookmarkFilled className="size-3.5" />
                            ) : (
                              <IconBookmark className="size-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          ))}

          {/* Footer hint */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/50 px-3 py-2">
              <span className="text-[0.6rem] text-muted-foreground">
                {filtered.length} fund{filtered.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] text-muted-foreground">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[0.5rem]">
                    ↑↓
                  </kbd>{" "}
                  navigate
                </span>
                <span className="text-[0.6rem] text-muted-foreground">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[0.5rem]">
                    ↵
                  </kbd>{" "}
                  select
                </span>
                <span className="text-[0.6rem] text-muted-foreground">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[0.5rem]">
                    esc
                  </kbd>{" "}
                  close
                </span>
              </div>
            </div>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
