import type { Fund } from "@/data/funds"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBookmark } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const riskColors: Record<string, string> = {
  LOW: "border-emerald-500/30 text-emerald-500",
  MODERATE: "border-yellow-500/30 text-yellow-500",
  HIGH: "border-orange-500/30 text-orange-500",
  "VERY HIGH": "border-red-500/30 text-red-500",
}

export function FundCard({
  fund,
  onSelect,
}: {
  fund: Fund
  onSelect: (fund: Fund) => void
}) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
      onClick={() => onSelect(fund)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{fund.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{fund.amc}</p>
          </div>
          <button
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
            aria-label="Bookmark fund"
          >
            <IconBookmark className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[0.6rem]">
            {fund.category} - {fund.subcategory}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-[0.6rem]", riskColors[fund.risk])}
          >
            {fund.risk} RISK
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {(["1Y", "3Y", "5Y"] as const).map((period) => (
            <div
              key={period}
              className="rounded-md border border-border px-2 py-2 text-center"
            >
              <p className="text-[0.6rem] text-muted-foreground">{period}</p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-500">
                {fund.returns[period]}%
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-[0.6rem] text-muted-foreground">Min SIP</p>
            <p className="text-xs font-semibold">
              ₹{fund.minSip.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(fund)
              }}
            >
              Details
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(fund)
              }}
            >
              Invest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
