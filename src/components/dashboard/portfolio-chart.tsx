import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { usePortfolio } from "@/hooks/use-portfolio"
import { IconLoader2 } from "@tabler/icons-react"

const periods = ["1M", "3M", "6M", "1Y", "ALL"] as const

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export function PortfolioChart() {
  const [activePeriod, setActivePeriod] = useState<string>("1Y")
  const { data, isLoading, isError } = usePortfolio()
  const portfolioHistory = data?.portfolioHistory ?? []

  return (
    <Card className="flex-1">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold">Portfolio Value Over Time</h3>
          <div className="flex items-center gap-0.5 self-start rounded-md border border-border p-0.5">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={cn(
                  "rounded-sm px-2.5 py-1 text-[0.65rem] font-medium transition-colors",
                  activePeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 flex h-64 items-center justify-center">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="mt-6 flex h-64 items-center justify-center">
            <p className="text-sm text-destructive">Failed to load chart data.</p>
          </div>
        ) : (
        <ChartContainer config={chartConfig} className="mt-6 h-64 w-full">
          <BarChart data={portfolioHistory} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
