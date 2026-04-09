import { render, screen } from "@/test/utils/test-utils"
import userEvent from "@testing-library/user-event"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"

vi.mock("@/hooks/use-portfolio", () => ({
  usePortfolio: vi.fn(),
}))

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>()
  return {
    ...actual,
    BarChart: ({ children }: React.PropsWithChildren) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => null,
    CartesianGrid: () => null,
    XAxis: () => null,
    YAxis: () => null,
    ResponsiveContainer: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  }
})

import { usePortfolio } from "@/hooks/use-portfolio"

describe("PortfolioChart", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders heading and period buttons", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: { holdings: [], summary: {} as never, portfolioHistory: [], assetAllocation: [] },
      isLoading: false,
      isError: false,
    })

    render(<PortfolioChart />)

    expect(screen.getByText("Portfolio Value Over Time")).toBeInTheDocument()

    const buttons = ["1M", "3M", "6M", "1Y", "ALL"]
    buttons.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it("renders skeleton when loading", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    const { container } = render(<PortfolioChart />)

    // Skeleton uses data-slot="skeleton"
    expect(container.querySelector("[data-slot='skeleton']")).toBeInTheDocument()
  })

  it("renders error message on failure", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    render(<PortfolioChart />)

    expect(screen.getByText("Failed to load chart data.")).toBeInTheDocument()
  })

  it("renders empty state when no history", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: { holdings: [], summary: {} as never, portfolioHistory: [], assetAllocation: [] },
      isLoading: false,
      isError: false,
    })

    render(<PortfolioChart />)

    expect(screen.getByText("No portfolio history yet")).toBeInTheDocument()
  })

  it("clicking a period button updates active styling", async () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: { holdings: [], summary: {} as never, portfolioHistory: [], assetAllocation: [] },
      isLoading: false,
      isError: false,
    })

    render(<PortfolioChart />)

    const user = userEvent.setup()
    const btn3M = screen.getByText("3M")

    await user.click(btn3M)

    // After clicking 3M, it should have the active styling class
    expect(btn3M.className).toContain("bg-background")
  })

  it("passes selected period to usePortfolio", async () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: { holdings: [], summary: {} as never, portfolioHistory: [], assetAllocation: [] },
      isLoading: false,
      isError: false,
    })

    render(<PortfolioChart />)

    const user = userEvent.setup()
    await user.click(screen.getByText("6M"))

    expect(usePortfolio).toHaveBeenCalledWith("6M")
  })
})
