import { render, screen, waitFor } from "@/test/utils/test-utils"
import { InsightCard } from "@/components/dashboard/insight-card"
import { fetchAiInsight } from "@/services/chat"

vi.mock("@/services/chat", () => ({
  fetchAiInsight: vi.fn(),
}))

describe("InsightCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders skeletons while loading", () => {
    vi.mocked(fetchAiInsight).mockReturnValue(new Promise(() => {}))

    const { container } = render(<InsightCard />)

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThanOrEqual(1)
  })

  it("renders fallback when query errors", async () => {
    vi.mocked(fetchAiInsight).mockRejectedValue(new Error("fail"))

    render(<InsightCard />)

    await waitFor(() => {
      expect(screen.getByText("X Insight")).toBeInTheDocument()
    })

    expect(
      screen.getByText(/Ask X to analyze your portfolio/),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Talk to X" })).toHaveAttribute(
      "href",
      "/dashboard/chat",
    )
  })

  it("renders fallback when insight is empty", async () => {
    vi.mocked(fetchAiInsight).mockResolvedValue("")

    render(<InsightCard />)

    await waitFor(() => {
      expect(
        screen.getByText(/Ask X to analyze your portfolio/),
      ).toBeInTheDocument()
    })
  })

  it("renders insight text on success", async () => {
    vi.mocked(fetchAiInsight).mockResolvedValue("Your portfolio is well diversified")

    render(<InsightCard />)

    await waitFor(() => {
      expect(screen.getByText("Your portfolio is well diversified")).toBeInTheDocument()
    })

    expect(screen.getByRole("link", { name: "Ask X" })).toHaveAttribute(
      "href",
      "/dashboard/chat",
    )
  })
})
