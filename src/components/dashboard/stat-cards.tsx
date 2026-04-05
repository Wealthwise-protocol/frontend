import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StaggerContainer, StaggerItem, CountUp } from "@/components/ui/animated"
import { usePortfolio } from "@/hooks/use-portfolio"
import { IconPlus } from "@tabler/icons-react"

export function StatCards() {
  const { data, isLoading, isError } = usePortfolio()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-7 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-destructive">Failed to load portfolio summary.</p>
      </div>
    )
  }

  const { summary } = data

  if (summary.totalInvested === 0 && summary.currentValue === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10">
          <p className="text-sm font-medium text-muted-foreground">No investments yet</p>
          <p className="text-xs text-muted-foreground">Start investing to see your portfolio summary</p>
          <Button size="sm" className="mt-2" asChild>
            <Link to="/dashboard/explore">
              <IconPlus className="mr-1 size-3.5" />
              Explore Funds
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalReturns = summary.totalGain

  const stats = [
    {
      label: "TOTAL INVESTED",
      numValue: summary.totalInvested,
      prefix: "₹",
    },
    {
      label: "CURRENT VALUE",
      numValue: summary.currentValue,
      prefix: "₹",
      valueClass: "text-emerald-500",
    },
    {
      label: "TOTAL RETURNS",
      numValue: Math.abs(totalReturns),
      prefix: totalReturns >= 0 ? "+₹" : "-₹",
      valueClass: totalReturns >= 0 ? "text-emerald-500" : "text-red-500",
      sub: `${summary.gainPercent.toFixed(2)}%`,
      subClass: totalReturns >= 0 ? "text-emerald-500" : "text-red-500",
    },
    {
      label: "RETURNS %",
      numValue: Math.abs(summary.gainPercent),
      prefix: summary.gainPercent >= 0 ? "+" : "-",
      suffix: "%",
      valueClass: summary.gainPercent >= 0 ? "text-emerald-500" : "text-red-500",
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
              <p className={`mt-1 text-xs ${stat.sub ? (stat.subClass ?? "text-emerald-500") : "invisible"}`}>
                {stat.sub ? `~ ${stat.sub}` : "\u00A0"}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
