import { renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePortfolio } from "@/hooks/use-portfolio"
import { fetchPortfolioDetails } from "@/services/funds"
import type { PortfolioAllDetails } from "@/services/funds"

vi.mock("@/services/funds", () => ({
  fetchPortfolioDetails: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockPortfolioData: PortfolioAllDetails = {
  holdings: [
    {
      id: "h1",
      name: "HDFC Flexi Cap",
      category: "Equity",
      units: 100,
      avgNav: 40,
      curNav: 45,
      invested: 4000,
      curValue: 4500,
      gain: 500,
    },
  ],
  summary: {
    currentValue: 4500,
    gainPercent: 12.5,
    totalGain: 500,
    totalInvested: 4000,
  },
  portfolioHistory: [
    { month: "2025-01-15", value: 3800 },
    { month: "2025-02-15", value: 4200 },
  ],
  assetAllocation: [
    { label: "Equity", name: "Equity", value: 70 },
    { label: "Debt", name: "Debt", value: 30 },
  ],
}

describe("usePortfolio", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns loading state initially", () => {
    vi.mocked(fetchPortfolioDetails).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => usePortfolio(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
  })

  it("returns transformed data on success", async () => {
    vi.mocked(fetchPortfolioDetails).mockResolvedValue(mockPortfolioData)

    const { result } = renderHook(() => usePortfolio(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.data).not.toBeNull())

    expect(result.current.data!.holdings).toEqual(mockPortfolioData.holdings)
    expect(result.current.data!.summary).toEqual(mockPortfolioData.summary)
  })

  it("formats portfolio history dates to en-IN format", async () => {
    vi.mocked(fetchPortfolioDetails).mockResolvedValue(mockPortfolioData)

    const { result } = renderHook(() => usePortfolio(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.data).not.toBeNull())

    // Each date should be formatted like "15 Jan", "15 Feb"
    result.current.data!.portfolioHistory.forEach((item) => {
      expect(item.month).toMatch(/^\d{2} \w{3}$/)
    })
  })

  it("transforms asset allocation with lowercase name and CSS variable fill", async () => {
    vi.mocked(fetchPortfolioDetails).mockResolvedValue(mockPortfolioData)

    const { result } = renderHook(() => usePortfolio(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.data).not.toBeNull())

    expect(result.current.data!.assetAllocation[0]).toEqual({
      name: "equity",
      label: "Equity",
      value: 70,
      fill: "var(--color-equity)",
    })
    expect(result.current.data!.assetAllocation[1]).toEqual({
      name: "debt",
      label: "Debt",
      value: 30,
      fill: "var(--color-debt)",
    })
  })

  it("returns isError true when fetch fails", async () => {
    vi.mocked(fetchPortfolioDetails).mockRejectedValue(new Error("fail"))

    const { result } = renderHook(() => usePortfolio(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.data).toBeNull()
  })

  it("passes period parameter to fetchPortfolioDetails", async () => {
    vi.mocked(fetchPortfolioDetails).mockResolvedValue(mockPortfolioData)

    renderHook(() => usePortfolio("6M"), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(fetchPortfolioDetails).toHaveBeenCalledWith("6M")
    })
  })
})
