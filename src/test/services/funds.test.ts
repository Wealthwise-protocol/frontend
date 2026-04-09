import {
  fetchFunds,
  fetchBookmarks,
  addBookmark,
  removeBookmark,
  fetchPortfolioDetails,
  fetchNavHistory,
  investLumpsum,
  fetchSips,
  createSip,
  updateSip,
  deleteSip,
  fetchTransactions,
} from "@/services/funds"
import { api } from "@/services/api"

vi.mock("@/services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe("funds service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Funds ──────────────────────────────────────────────────────

  describe("fetchFunds", () => {
    it("calls /funds with default page=0 size=12", async () => {
      const paginated = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 12,
        first: true,
        last: true,
        empty: true,
      }
      vi.mocked(api.get).mockResolvedValue({ data: paginated })

      const result = await fetchFunds()

      expect(api.get).toHaveBeenCalledWith("/funds", { params: { page: 0, size: 12 } })
      expect(result).toEqual(paginated)
    })

    it("passes custom page and size", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { content: [] } })

      await fetchFunds(2, 24)

      expect(api.get).toHaveBeenCalledWith("/funds", { params: { page: 2, size: 24 } })
    })
  })

  // ── Bookmarks ──────────────────────────────────────────────────

  describe("fetchBookmarks", () => {
    it("returns fundIds array", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { fundIds: ["f1", "f2"] } })

      const result = await fetchBookmarks()

      expect(api.get).toHaveBeenCalledWith("/bookmarks")
      expect(result).toEqual(["f1", "f2"])
    })

    it("returns empty array when fundIds is not an array", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { fundIds: null } })

      expect(await fetchBookmarks()).toEqual([])
    })

    it("returns empty array when data is null", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: null })

      expect(await fetchBookmarks()).toEqual([])
    })
  })

  describe("addBookmark", () => {
    it("calls POST /bookmarks/:fundId", async () => {
      vi.mocked(api.post).mockResolvedValue({})

      await addBookmark("fund-123")

      expect(api.post).toHaveBeenCalledWith("/bookmarks/fund-123")
    })
  })

  describe("removeBookmark", () => {
    it("calls DELETE /bookmarks/:fundId", async () => {
      vi.mocked(api.delete).mockResolvedValue({})

      await removeBookmark("fund-123")

      expect(api.delete).toHaveBeenCalledWith("/bookmarks/fund-123")
    })
  })

  // ── Portfolio ──────────────────────────────────────────────────

  describe("fetchPortfolioDetails", () => {
    const mockData = {
      holdings: [],
      summary: { currentValue: 100, gainPercent: 5, totalGain: 5, totalInvested: 95 },
      portfolioHistory: [],
      assetAllocation: [],
    }

    it("calls /portfolio/all-details without params when no period", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockData })

      const result = await fetchPortfolioDetails()

      expect(api.get).toHaveBeenCalledWith("/portfolio/all-details", {
        params: undefined,
      })
      expect(result).toEqual(mockData)
    })

    it("passes period param when provided", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockData })

      await fetchPortfolioDetails("6M")

      expect(api.get).toHaveBeenCalledWith("/portfolio/all-details", {
        params: { period: "6M" },
      })
    })
  })

  // ── NAV History ────────────────────────────────────────────────

  describe("fetchNavHistory", () => {
    it("calls /funds/:fundId/nav-history with period and returns array", async () => {
      const history = [{ date: "2025-01-01", nav: 45.5 }]
      vi.mocked(api.get).mockResolvedValue({ data: { navHistory: history } })

      const result = await fetchNavHistory("fund-1", "3M")

      expect(api.get).toHaveBeenCalledWith("/funds/fund-1/nav-history", {
        params: { period: "3M" },
      })
      expect(result).toEqual(history)
    })

    it("defaults period to 1Y", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { navHistory: [] } })

      await fetchNavHistory("fund-1")

      expect(api.get).toHaveBeenCalledWith("/funds/fund-1/nav-history", {
        params: { period: "1Y" },
      })
    })

    it("returns empty array when navHistory is not an array", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      expect(await fetchNavHistory("fund-1")).toEqual([])
    })
  })

  // ── Invest ─────────────────────────────────────────────────────

  describe("investLumpsum", () => {
    it("calls POST /funds/:fundId/invest and returns transaction", async () => {
      const transaction = { id: "t1", amount: 5000 }
      vi.mocked(api.post).mockResolvedValue({ data: { transaction } })

      const result = await investLumpsum("fund-1", 5000)

      expect(api.post).toHaveBeenCalledWith("/funds/fund-1/invest", { amount: 5000 })
      expect(result).toEqual(transaction)
    })
  })

  // ── SIPs ───────────────────────────────────────────────────────

  describe("fetchSips", () => {
    it("returns sips array", async () => {
      const sips = [{ id: "s1", fundName: "Test Fund" }]
      vi.mocked(api.get).mockResolvedValue({ data: { sips } })

      const result = await fetchSips()

      expect(api.get).toHaveBeenCalledWith("/sips")
      expect(result).toEqual(sips)
    })

    it("returns empty array when sips is missing", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      expect(await fetchSips()).toEqual([])
    })
  })

  describe("createSip", () => {
    it("calls POST /sips and returns sip", async () => {
      const sip = { id: "s1", fundId: "f1", monthlyAmt: 1000 }
      vi.mocked(api.post).mockResolvedValue({ data: { sip } })

      const result = await createSip({ fundId: "f1", monthlyAmt: 1000 })

      expect(api.post).toHaveBeenCalledWith("/sips", { fundId: "f1", monthlyAmt: 1000 })
      expect(result).toEqual(sip)
    })
  })

  describe("updateSip", () => {
    it("calls PATCH /sips and returns updated sip", async () => {
      const sip = { id: "s1", status: "PAUSED" }
      vi.mocked(api.patch).mockResolvedValue({ data: { sip } })

      const result = await updateSip({ sipId: "s1", status: "PAUSED" })

      expect(api.patch).toHaveBeenCalledWith("/sips", { sipId: "s1", status: "PAUSED" })
      expect(result).toEqual(sip)
    })
  })

  describe("deleteSip", () => {
    it("calls DELETE /sips with id param", async () => {
      const sip = { id: "s1" }
      vi.mocked(api.delete).mockResolvedValue({ data: { sip } })

      const result = await deleteSip("s1")

      expect(api.delete).toHaveBeenCalledWith("/sips", { params: { id: "s1" } })
      expect(result).toEqual(sip)
    })
  })

  // ── Transactions ───────────────────────────────────────────────

  describe("fetchTransactions", () => {
    it("returns transactions array", async () => {
      const transactions = [{ id: "t1", amount: 5000 }]
      vi.mocked(api.get).mockResolvedValue({ data: { transactions } })

      const result = await fetchTransactions()

      expect(api.get).toHaveBeenCalledWith("/transactions")
      expect(result).toEqual(transactions)
    })

    it("returns empty array when transactions is missing", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      expect(await fetchTransactions()).toEqual([])
    })
  })
})
