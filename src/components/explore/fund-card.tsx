import type { Fund } from "@/data/funds"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react"
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
  saved = false,
  onToggleSave,
}: {
  fund: Fund
  onSelect: (fund: Fund) => void
  saved?: boolean
  onToggleSave?: (fundId: string) => void
}) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
      onClick={() => onSelect(fund)}
    >
      <CardContent className="p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-xs font-semibold sm:text-sm">{fund.name}</h3>
            <p className="mt-0.5 text-[0.65rem] text-muted-foreground sm:text-xs">{fund.amc}</p>
          </div>
          <button
            className={cn(
              "shrink-0 transition-colors",
              saved
                ? "text-primary hover:text-primary/80"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave?.(fund.id)
            }}
            aria-label={saved ? "Remove from saved" : "Save fund"}
          >
            {saved ? (
              <IconBookmarkFilled className="size-4" />
            ) : (
              <IconBookmark className="size-4" />
            )}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
          <Badge variant="outline" className="text-[0.55rem] sm:text-[0.6rem]">
            {fund.category} - {fund.subcategory}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-[0.55rem] sm:text-[0.6rem]", riskColors[fund.risk])}
          >
            {fund.risk} RISK
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">
          {(["1Y", "3Y", "5Y"] as const).map((period) => (
            <div
              key={period}
              className="rounded-md border border-border px-1.5 py-1.5 text-center sm:px-2 sm:py-2"
            >
              <p className="text-[0.55rem] text-muted-foreground sm:text-[0.6rem]">{period}</p>
              <p className="mt-0.5 text-[0.65rem] font-semibold text-emerald-500 sm:text-xs">
                {fund.returns[period]}%
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 sm:mt-4 sm:pt-3">
          <div>
            <p className="text-[0.55rem] text-muted-foreground sm:text-[0.6rem]">Min SIP</p>
            <p className="text-[0.65rem] font-semibold sm:text-xs">
              ₹{fund.minSip.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-[0.65rem] sm:h-8 sm:px-3 sm:text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(fund)
              }}
            >
              Details
            </Button>
            <Button
              size="sm"
              className="h-7 px-2.5 text-[0.65rem] sm:h-8 sm:px-3 sm:text-xs"
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
