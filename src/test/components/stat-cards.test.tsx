import { render, screen } from "@/test/utils/test-utils"
import { StatCards } from "@/components/dashboard/stat-cards"

vi.mock("@/hooks/use-portfolio", () => ({
  usePortfolio: vi.fn(),
}))

vi.mock("@/hooks/use-min-delay", () => ({
  useMinDelay: (v: boolean) => v,
}))

vi.mock("@/components/ui/animated", () => ({
  StaggerContainer: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...props}>{children}</div>
  ),
  StaggerItem: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CountUp: ({
    value,
    prefix,
    suffix,
  }: {
    value: number
    prefix?: string
    suffix?: string
    formatFn?: (v: number) => string
  }) => (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  ),
}))

import { usePortfolio } from "@/hooks/use-portfolio"

describe("StatCards", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders skeleton cards when loading", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    const { container } = render(<StatCards />)

    expect(container.querySelectorAll(".stat-card")).toHaveLength(4)
  })

  it("renders error message when failed", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    render(<StatCards />)

    expect(screen.getByText("Failed to load portfolio summary.")).toBeInTheDocument()
  })

  it("renders empty state when portfolio is empty", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: { totalInvested: 0, currentValue: 0, totalGain: 0, gainPercent: 0 },
        portfolioHistory: [],
        assetAllocation: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<StatCards />)

    expect(screen.getByText("Your portfolio is empty")).toBeInTheDocument()
    expect(screen.getByText("Explore Funds")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /explore funds/i })).toHaveAttribute(
      "href",
      "/dashboard/explore",
    )
  })

  it("renders all 4 stat labels with data", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: { totalInvested: 50000, currentValue: 55000, totalGain: 5000, gainPercent: 10 },
        portfolioHistory: [],
        assetAllocation: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<StatCards />)

    expect(screen.getByText("TOTAL INVESTED")).toBeInTheDocument()
    expect(screen.getByText("CURRENT VALUE")).toBeInTheDocument()
    expect(screen.getByText("TOTAL RETURNS")).toBeInTheDocument()
    expect(screen.getByText("RETURNS %")).toBeInTheDocument()
  })

  it("shows gain styling for positive returns", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: { totalInvested: 50000, currentValue: 55000, totalGain: 5000, gainPercent: 10 },
        portfolioHistory: [],
        assetAllocation: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<StatCards />)

    // Positive returns show upward arrow prefix
    expect(screen.getByText(/↑ \+₹/)).toBeInTheDocument()
  })

  it("shows loss styling for negative returns", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: {
          totalInvested: 50000,
          currentValue: 45000,
          totalGain: -5000,
          gainPercent: -10,
        },
        portfolioHistory: [],
        assetAllocation: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<StatCards />)

    // Negative returns show downward arrow prefix
    expect(screen.getByText(/↓ -₹/)).toBeInTheDocument()
  })

  it("displays gain percent as sub-text", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: { totalInvested: 50000, currentValue: 55000, totalGain: 5000, gainPercent: 10 },
        portfolioHistory: [],
        assetAllocation: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<StatCards />)

    expect(screen.getByText("~ 10.00%")).toBeInTheDocument()
  })
})
