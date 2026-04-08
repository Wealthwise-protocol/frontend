import { Pie, PieChart } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortfolio } from "@/hooks/use-portfolio"

const chartConfig = {
  equity: { label: "Equity", color: "var(--color-chart-3)" },
  debt: { label: "Debt", color: "var(--color-chart-4)" },
  hybrid: { label: "Hybrid", color: "var(--color-chart-5)" },
} satisfies ChartConfig

export function AssetAllocation() {
  const { data, isLoading, isError } = usePortfolio()
  const allocation = data?.assetAllocation ?? []

  return (
    <Card className="w-full xl:w-80">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold">Asset Allocation</h3>

        {isLoading ? (
          <div className="mt-4 flex h-[180px] flex-col items-center justify-center gap-4">
            <Skeleton className="size-[140px] rounded-full" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ) : isError ? (
          <div className="mt-4 flex h-[180px] items-center justify-center">
            <p className="text-sm text-destructive">Failed to load.</p>
          </div>
        ) : allocation.length === 0 ? (
          <div className="mt-4 flex h-[180px] flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium text-muted-foreground">No holdings yet</p>
            <p className="text-xs text-muted-foreground">Your allocation will appear here</p>
          </div>
        ) : (
          <>
            <p className="sr-only">
              Donut chart showing asset allocation: {allocation.map((item) => `${item.label} ${item.value}%`).join(", ")}.
            </p>
            <ChartContainer config={chartConfig} className="mx-auto mt-4 h-[180px] w-[180px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={allocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  strokeWidth={0}
                />
              </PieChart>
            </ChartContainer>

            <div className="mt-4 flex flex-col gap-3">
              {allocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2.5"
                      style={{ backgroundColor: `var(--color-${item.name})` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
