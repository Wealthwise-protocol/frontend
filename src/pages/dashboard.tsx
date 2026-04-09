import { usePageTitle } from "@/hooks/use-page-title"
import { StatCards } from "@/components/dashboard/stat-cards"
import { InsightCard } from "@/components/dashboard/insight-card"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"
import { AssetAllocation } from "@/components/dashboard/asset-allocation"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { FadeIn } from "@/components/ui/animated"

export function DashboardPage() {
  usePageTitle("Dashboard")

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </FadeIn>

      <div className="mt-6">
        <StatCards />
      </div>

      <FadeIn delay={0.15} className="mt-6">
        <InsightCard />
      </FadeIn>

      <FadeIn delay={0.25} className="mt-6 flex flex-col gap-4 xl:flex-row">
        <PortfolioChart />
        <AssetAllocation />
      </FadeIn>

      <FadeIn delay={0.35} className="mt-6">
        <HoldingsTable />
      </FadeIn>
    </>
  )
}
