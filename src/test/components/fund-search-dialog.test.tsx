import { render, screen, waitFor } from "@/test/utils/test-utils"
import userEvent from "@testing-library/user-event"
import { FundSearchDialog } from "@/components/explore/fund-search-dialog"
import { fetchFunds } from "@/services/funds"
import type { Fund } from "@/data/funds"

vi.mock("@/services/funds", () => ({
  fetchFunds: vi.fn(),
}))

const mockFunds: Fund[] = [
  {
    id: "f1",
    name: "HDFC Flexi Cap Fund",
    amc: "HDFC Asset Management",
    category: "Equity",
    subcategory: "Flexi Cap",
    risk: "HIGH",
    nav: 45.5,
    navChange: 0.5,
    expenseRatio: 1.5,
    aum: 50000,
    minSip: 500,
    minLumpsum: 5000,
    description: "A flexi cap fund",
    returns: { "1Y": 15.5, "3Y": 12.3, "5Y": 10.1 },
    categoryReturns: { "1Y": 14.0, "3Y": 11.0, "5Y": 9.5 },
  },
  {
    id: "f2",
    name: "ICICI Pru Debt Fund",
    amc: "ICICI Prudential",
    category: "Debt",
    subcategory: "Short Duration",
    risk: "LOW",
    nav: 30.2,
    navChange: -0.1,
    expenseRatio: 0.8,
    aum: 20000,
    minSip: 1000,
    minLumpsum: 5000,
    description: "A debt fund",
    returns: { "1Y": 7.2, "3Y": 6.5, "5Y": 6.0 },
    categoryReturns: { "1Y": 7.0, "3Y": 6.0, "5Y": 5.5 },
  },
] as Fund[]

describe("FundSearchDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders loading spinner when fetching", async () => {
    vi.mocked(fetchFunds).mockReturnValue(new Promise(() => {}))

    render(
      <FundSearchDialog
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })
  })

  it("renders error state", async () => {
    vi.mocked(fetchFunds).mockRejectedValue(new Error("fail"))

    render(
      <FundSearchDialog
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText("Failed to load funds")).toBeInTheDocument()
    })
  })

  it("renders funds grouped by category", async () => {
    vi.mocked(fetchFunds).mockResolvedValue({
      content: mockFunds,
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 100,
      first: true,
      last: true,
      empty: false,
    })

    render(
      <FundSearchDialog
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText("HDFC Flexi Cap Fund")).toBeInTheDocument()
    })

    expect(screen.getByText("ICICI Pru Debt Fund")).toBeInTheDocument()
    // Category group headings
    expect(screen.getByText("Equity")).toBeInTheDocument()
    expect(screen.getByText("Debt")).toBeInTheDocument()
  })

  it("shows fund count in footer", async () => {
    vi.mocked(fetchFunds).mockResolvedValue({
      content: mockFunds,
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 100,
      first: true,
      last: true,
      empty: false,
    })

    render(
      <FundSearchDialog
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText("2 funds")).toBeInTheDocument()
    })
  })

  it("shows bookmark icon when onToggleSave provided", async () => {
    vi.mocked(fetchFunds).mockResolvedValue({
      content: mockFunds,
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 100,
      first: true,
      last: true,
      empty: false,
    })

    const onToggleSave = vi.fn()

    render(
      <FundSearchDialog
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
        savedFundIds={["f1"]}
        onToggleSave={onToggleSave}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText("HDFC Flexi Cap Fund")).toBeInTheDocument()
    })

    // Saved fund should have "Remove from saved" label
    expect(screen.getByLabelText("Remove from saved")).toBeInTheDocument()
    // Unsaved fund should have "Save fund" label
    expect(screen.getByLabelText("Save fund")).toBeInTheDocument()
  })

  it("calls onToggleSave when bookmark clicked", async () => {
    vi.mocked(fetchFunds).mockResolvedValue({
      content: mockFunds,
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 100,
      first: true,
      last: true,
      empty: false,
    })

    const onToggleSave = vi.fn()
    const user = userEvent.setup()

    render(
      <FundSearchDialog
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
        savedFundIds={[]}
        onToggleSave={onToggleSave}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText("HDFC Flexi Cap Fund")).toBeInTheDocument()
    })

    const saveButtons = screen.getAllByLabelText("Save fund")
    await user.click(saveButtons[0])

    expect(onToggleSave).toHaveBeenCalledWith("f1")
  })
})
