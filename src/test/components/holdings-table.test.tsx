import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@/test/utils/test-utils"
import { HoldingsTable } from "@/components/dashboard/holdings-table"

const mockHoldings = [
  {
    id: "h1",
    name: "Parag Parikh Flexi Cap Fund",
    category: "Equity",
    units: 120.45,
    avgNav: 45.5,
    curNav: 52.3,
    invested: 5480,
    curValue: 6302,
    gain: 822,
  },
  {
    id: "h2",
    name: "HDFC Short Term Debt Fund",
    category: "Debt",
    units: 500,
    avgNav: 24.0,
    curNav: 23.1,
    invested: 12000,
    curValue: 11550,
    gain: -450,
  },
]

const mockSummary = {
  totalInvested: 17480,
  currentValue: 17852,
  totalGain: 372,
  gainPercent: 2.13,
}

// Mock the usePortfolio hook
vi.mock("@/hooks/use-portfolio", () => ({
  usePortfolio: () => ({
    data: {
      holdings: mockHoldings,
      summary: mockSummary,
      portfolioHistory: [],
      assetAllocation: [],
    },
    isLoading: false,
    isError: false,
  }),
}))

// Mock useMinDelay to pass through
vi.mock("@/hooks/use-min-delay", () => ({
  useMinDelay: (v: boolean) => v,
}))

describe("HoldingsTable", () => {
  it("renders without crashing", () => {
    render(<HoldingsTable />)
    expect(screen.getByText("FUND NAME")).toBeInTheDocument()
  })

  it("renders holding rows", () => {
    render(<HoldingsTable />)
    expect(
      screen.getByText("Parag Parikh Flexi Cap Fund"),
    ).toBeInTheDocument()
    expect(screen.getByText("HDFC Short Term Debt Fund")).toBeInTheDocument()
  })

  it("applies num-positive for positive gains", () => {
    render(<HoldingsTable />)
    const gainCell = screen.getByText(/₹822/)
    expect(gainCell.className).toContain("num-positive")
  })

  it("applies num-negative for negative gains", () => {
    render(<HoldingsTable />)
    const lossCell = screen.getByText(/₹450/)
    expect(lossCell.className).toContain("num-negative")
  })

  it("shows up arrow for gains and down arrow for losses", () => {
    render(<HoldingsTable />)
    expect(screen.getByText(/↑ \+/)).toBeInTheDocument()
    expect(screen.getByText(/↓/)).toBeInTheDocument()
  })
})
