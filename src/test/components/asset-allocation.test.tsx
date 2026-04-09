import { render, screen } from "@/test/utils/test-utils"
import { AssetAllocation } from "@/components/dashboard/asset-allocation"

vi.mock("@/hooks/use-portfolio", () => ({
  usePortfolio: vi.fn(),
}))

// Mock recharts
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>()
  return {
    ...actual,
    PieChart: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Pie: () => null,
    ResponsiveContainer: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  }
})

import { usePortfolio } from "@/hooks/use-portfolio"

describe("AssetAllocation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders heading", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    render(<AssetAllocation />)

    expect(screen.getByText("Asset Allocation")).toBeInTheDocument()
  })

  it("renders skeletons when loading", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    const { container } = render(<AssetAllocation />)

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThanOrEqual(1)
  })

  it("renders error message on failure", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    render(<AssetAllocation />)

    expect(screen.getByText("Failed to load.")).toBeInTheDocument()
  })

  it("renders empty state when no holdings", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: { holdings: [], summary: {} as never, portfolioHistory: [], assetAllocation: [] },
      isLoading: false,
      isError: false,
    })

    render(<AssetAllocation />)

    expect(screen.getByText("No holdings yet")).toBeInTheDocument()
  })

  it("renders legend items with labels and percentages", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: {} as never,
        portfolioHistory: [],
        assetAllocation: [
          { name: "equity", label: "Equity", value: 70, fill: "var(--color-equity)" },
          { name: "debt", label: "Debt", value: 30, fill: "var(--color-debt)" },
        ],
      },
      isLoading: false,
      isError: false,
    })

    render(<AssetAllocation />)

    expect(screen.getByText("Equity")).toBeInTheDocument()
    expect(screen.getByText("70%")).toBeInTheDocument()
    expect(screen.getByText("Debt")).toBeInTheDocument()
    expect(screen.getByText("30%")).toBeInTheDocument()
  })

  it("renders sr-only description with allocation data", () => {
    vi.mocked(usePortfolio).mockReturnValue({
      data: {
        holdings: [],
        summary: {} as never,
        portfolioHistory: [],
        assetAllocation: [
          { name: "equity", label: "Equity", value: 70, fill: "var(--color-equity)" },
        ],
      },
      isLoading: false,
      isError: false,
    })

    render(<AssetAllocation />)

    expect(screen.getByText(/Donut chart showing asset allocation: Equity 70%/)).toBeInTheDocument()
  })
})
