import { Card, CardContent } from "@/components/ui/card"
import { StaggerContainer, StaggerItem, CountUp } from "@/components/ui/animated"
import { usePortfolioStore } from "@/stores/portfolio-store"

export function StatCards() {
  const holdings = usePortfolioStore((s) => s.holdings)
  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0)
  const currentValue = holdings.reduce((sum, h) => sum + h.curValue, 0)
  const totalReturns = currentValue - totalInvested
  const returnsPercent = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : "0"
  const xirr = 18.4 // keep hardcoded for now as XIRR calc is complex

  const stats = [
    {
      label: "TOTAL INVESTED",
      numValue: totalInvested,
      prefix: "₹",
    },
    {
      label: "CURRENT VALUE",
      numValue: currentValue,
      prefix: "₹",
      valueClass: "text-emerald-500",
    },
    {
      label: "TOTAL RETURNS",
      numValue: totalReturns,
      prefix: totalReturns >= 0 ? "+₹" : "-₹",
      valueClass: totalReturns >= 0 ? "text-emerald-500" : "text-red-500",
      sub: `${returnsPercent}%`,
    },
    {
      label: "XIRR",
      numValue: xirr,
      suffix: "%",
    },
  ]
  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={`mt-2 text-2xl font-bold tracking-tight ${stat.valueClass ?? ""}`}
              >
                <CountUp
                  value={stat.numValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  formatFn={stat.numValue >= 100 ? (v) => Math.round(v).toLocaleString("en-IN") : undefined}
                />
              </p>
              <p className={`mt-1 text-xs ${stat.sub ? "text-emerald-500" : "invisible"}`}>
                {stat.sub ? `~ ${stat.sub}` : "\u00A0"}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
