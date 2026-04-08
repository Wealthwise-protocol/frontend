import { api } from "./api"

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export async function sendChatMessage(message: string): Promise<string> {
  const { data } = await api.post<{ response: string }>("/api/ai/chat", {
    message,
  })
  return data.response
}

export async function fetchChatHistory(): Promise<ChatMessage[]> {
  const { data } = await api.get<{ messages: ChatMessage[] }>(
    "/api/ai/history",
  )
  return Array.isArray(data?.messages) ? data.messages : []
}

export async function clearChatHistory(): Promise<void> {
  await api.delete("/api/ai/history")
}

export async function fetchAiInsight(): Promise<string> {
  const { data } = await api.get<{ insight: string }>("/api/ai/insight")
  return data.insight
}
