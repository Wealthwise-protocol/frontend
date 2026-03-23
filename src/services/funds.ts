import { api } from "./api"
import type { Fund } from "@/data/funds"

export async function fetchFunds(): Promise<Fund[]> {
  const { data } = await api.get<Fund[]>("/funds")
  return data
}

export async function fetchBookmarks(): Promise<string[]> {
  const { data } = await api.get<{ fundIds: string[] }>("/bookmarks")
  return data.fundIds
}

export async function addBookmark(fundId: string): Promise<void> {
  await api.post(`/bookmarks/${fundId}`)
}

export async function removeBookmark(fundId: string): Promise<void> {
  await api.delete(`/bookmarks/${fundId}`)
}
