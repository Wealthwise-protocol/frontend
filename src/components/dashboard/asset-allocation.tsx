import { Pie, PieChart } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { usePortfolio } from "@/hooks/use-portfolio"
import { IconLoader2 } from "@tabler/icons-react"

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
          <div className="mt-4 flex h-[180px] items-center justify-center">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
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
                      className="size-2.5 rounded-full"
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
