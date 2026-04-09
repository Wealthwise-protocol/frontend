import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@/test/utils/test-utils"
import { FundCard } from "@/components/explore/fund-card"
import type { Fund } from "@/data/funds"

const mockFund: Fund = {
  id: "test-fund-1",
  name: "Test Flexi Cap Fund",
  amc: "Test AMC",
  category: "Equity",
  subcategory: "Flexi Cap",
  risk: "HIGH",
  returns: { "1Y": 24.1, "3Y": -3.2, "5Y": 18.5 },
  categoryAvg: { "1Y": 20, "3Y": 15, "5Y": 16 },
  nav: 45.12,
  navChange: 0.5,
  navChangePercent: 1.1,
  minSip: 500,
  minLumpsum: 5000,
  aum: "₹25,000 Cr",
  expenseRatio: 0.45,
  description: "A test fund",
}

describe("FundCard", () => {
  const onSelect = vi.fn()
  const onToggleSave = vi.fn()

  it("renders without crashing", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    expect(screen.getByText("Test Flexi Cap Fund")).toBeInTheDocument()
  })

  it("displays fund name and AMC", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    expect(screen.getByText("Test Flexi Cap Fund")).toBeInTheDocument()
    expect(screen.getByText("Test AMC")).toBeInTheDocument()
  })

  it("displays category badge", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    expect(screen.getByText("Equity - Flexi Cap")).toBeInTheDocument()
  })

  it("displays risk badge", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    expect(screen.getByText("HIGH RISK")).toBeInTheDocument()
  })

  it("applies num-positive for positive returns", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    const oneYearReturn = screen.getByText(/24.1%/)
    expect(oneYearReturn.className).toContain("num-positive")
  })

  it("applies num-negative for negative returns", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    const threeYearReturn = screen.getByText(/3.2%/)
    expect(threeYearReturn.className).toContain("num-negative")
  })

  it("displays min SIP amount", () => {
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    expect(screen.getByText("₹500")).toBeInTheDocument()
  })

  it("shows filled bookmark when saved", () => {
    render(
      <FundCard
        fund={mockFund}
        onSelect={onSelect}
        saved={true}
        onToggleSave={onToggleSave}
      />,
    )
    expect(screen.getByLabelText("Remove from saved")).toBeInTheDocument()
  })

  it("shows outline bookmark when not saved", () => {
    render(
      <FundCard
        fund={mockFund}
        onSelect={onSelect}
        saved={false}
        onToggleSave={onToggleSave}
      />,
    )
    expect(screen.getByLabelText("Save fund")).toBeInTheDocument()
  })

  it("calls onSelect when card is clicked", async () => {
    const { userEvent } = await import("@/test/utils/test-utils")
    const user = userEvent.setup()
    render(<FundCard fund={mockFund} onSelect={onSelect} />)
    await user.click(screen.getByText("Test Flexi Cap Fund"))
    expect(onSelect).toHaveBeenCalledWith(mockFund)
  })

  it("calls onToggleSave when bookmark is clicked", async () => {
    const { userEvent } = await import("@/test/utils/test-utils")
    const user = userEvent.setup()
    render(
      <FundCard
        fund={mockFund}
        onSelect={onSelect}
        saved={false}
        onToggleSave={onToggleSave}
      />,
    )
    await user.click(screen.getByLabelText("Save fund"))
    expect(onToggleSave).toHaveBeenCalledWith("test-fund-1")
  })
})
