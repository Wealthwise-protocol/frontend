import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StaggerContainer, StaggerItem, CountUp } from "@/components/ui/animated"
import { usePortfolio } from "@/hooks/use-portfolio"
import { useMinDelay } from "@/hooks/use-min-delay"
import { IconPlus, IconTrendingUp } from "@tabler/icons-react"

export function StatCards() {
  const { data, isLoading: rawLoading, isError } = usePortfolio()
  const isLoading = useMinDelay(rawLoading)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="stat-card">
            <CardContent className="p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-7 w-32" />
              <Skeleton className="mt-2 h-3 w-16" />
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
      <div className="empty-state flex flex-col items-center gap-3 p-12 text-center">
        <IconTrendingUp className="size-8 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">Your portfolio is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start investing in mutual funds to see your portfolio grow here.
          </p>
        </div>
        <Button size="sm" className="mt-3" asChild>
          <Link to="/dashboard/explore">
            <IconPlus className="mr-1 size-3.5" />
            Explore Funds
          </Link>
        </Button>
      </div>
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
      valueClass: "text-gain",
    },
    {
      label: "TOTAL RETURNS",
      numValue: Math.abs(totalReturns),
      prefix: totalReturns >= 0 ? "↑ +₹" : "↓ -₹",
      valueClass: totalReturns >= 0 ? "text-gain" : "text-loss",
      sub: `${summary.gainPercent.toFixed(2)}%`,
      subClass: totalReturns >= 0 ? "num-positive" : "num-negative",
    },
    {
      label: "RETURNS %",
      numValue: Math.abs(summary.gainPercent),
      prefix: summary.gainPercent >= 0 ? "↑ +" : "↓ -",
      suffix: "%",
      valueClass: summary.gainPercent >= 0 ? "text-gain" : "text-loss",
    },
  ]

  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <Card className="card-hover stat-card">
            <CardContent className="p-5">
              <p className="section-label">
                {stat.label}
              </p>
              <p
                className={`mt-2 text-2xl font-bold num tracking-tight ${stat.valueClass ?? ""}`}
              >
                <CountUp
                  value={stat.numValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  formatFn={stat.numValue >= 100 ? (v) => Math.round(v).toLocaleString("en-IN") : undefined}
                />
              </p>
              <p className={`mt-1 text-xs num ${stat.sub ? (stat.subClass ?? "num-positive") : "invisible"}`}>
                {stat.sub ? `~ ${stat.sub}` : "\u00A0"}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
