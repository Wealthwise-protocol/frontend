import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchPortfolioDetails } from "@/services/funds"
import type { PortfolioSummary } from "@/services/funds"
import type { Holding } from "@/types"

type TransformedPortfolio = {
  holdings: Holding[]
  summary: PortfolioSummary
  portfolioHistory: { month: string; value: number }[]
  assetAllocation: {
    name: string
    label: string
    value: number
    fill: string
  }[]
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
}

export function usePortfolio() {
  const query = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolioDetails,
  })

  const data = useMemo<TransformedPortfolio | null>(() => {
    if (!query.data) return null

    return {
      holdings: query.data.holdings,
      summary: query.data.summary,
      portfolioHistory: query.data.portfolioHistory.map((item) => ({
        month: formatDateLabel(item.month),
        value: item.value,
      })),
      assetAllocation: query.data.assetAllocation.map((item) => ({
        name: item.name.toLowerCase(),
        label: item.label,
        value: item.value,
        fill: `var(--color-${item.name.toLowerCase()})`,
      })),
    }
  }, [query.data])

  return { data, isLoading: query.isLoading, isError: query.isError }
}
