import {
  sendChatMessage,
  fetchChatHistory,
  clearChatHistory,
  fetchAiInsight,
} from "@/services/chat"
import { api } from "@/services/api"

vi.mock("@/services/api", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}))

describe("chat service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("sendChatMessage", () => {
    it("calls POST /api/ai/chat and returns response string", async () => {
      vi.mocked(api.post).mockResolvedValue({
        data: { response: "AI says hello" },
      })

      const result = await sendChatMessage("hello")

      expect(api.post).toHaveBeenCalledWith("/api/ai/chat", { message: "hello" })
      expect(result).toBe("AI says hello")
    })
  })

  describe("fetchChatHistory", () => {
    it("returns messages array on success", async () => {
      const messages = [
        { role: "user" as const, content: "hi" },
        { role: "assistant" as const, content: "hello" },
      ]
      vi.mocked(api.get).mockResolvedValue({ data: { messages } })

      const result = await fetchChatHistory()

      expect(api.get).toHaveBeenCalledWith("/api/ai/history")
      expect(result).toEqual(messages)
    })

    it("returns empty array when messages is not an array", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      const result = await fetchChatHistory()

      expect(result).toEqual([])
    })

    it("returns empty array when data is null", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: null })

      const result = await fetchChatHistory()

      expect(result).toEqual([])
    })
  })

  describe("clearChatHistory", () => {
    it("calls DELETE /api/ai/history", async () => {
      vi.mocked(api.delete).mockResolvedValue({})

      await clearChatHistory()

      expect(api.delete).toHaveBeenCalledWith("/api/ai/history")
    })
  })

  describe("fetchAiInsight", () => {
    it("returns insight string", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { insight: "Your portfolio is diversified" },
      })

      const result = await fetchAiInsight()

      expect(api.get).toHaveBeenCalledWith("/api/ai/insight")
      expect(result).toBe("Your portfolio is diversified")
    })
  })
})
