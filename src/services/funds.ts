import { api } from "./api"
import type { Fund } from "@/data/funds"
import type { Holding } from "@/types"

export type PaginatedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export async function fetchFunds(
  page = 0,
  size = 12,
): Promise<PaginatedResponse<Fund>> {
  const { data } = await api.get<PaginatedResponse<Fund>>("/funds", {
    params: { page, size },
  })
  return data
}

export async function fetchBookmarks(): Promise<string[]> {
  const { data } = await api.get<{ fundIds: string[] }>("/bookmarks")
  return Array.isArray(data?.fundIds) ? data.fundIds : []
}

export async function addBookmark(fundId: string): Promise<void> {
  await api.post(`/bookmarks/${fundId}`)
}

export async function removeBookmark(fundId: string): Promise<void> {
  await api.delete(`/bookmarks/${fundId}`)
}

// ── Portfolio ───────────────────────────────────────────────────

export type PortfolioSummary = {
  currentValue: number
  gainPercent: number
  totalGain: number
  totalInvested: number
}

export type PortfolioAllDetails = {
  assetAllocation: { label: string; name: string; value: number }[]
  holdings: Holding[]
  portfolioHistory: { month: string; value: number }[]
  summary: PortfolioSummary
}

export async function fetchPortfolioDetails(): Promise<PortfolioAllDetails> {
  const { data } = await api.get<PortfolioAllDetails>("/portfolio/all-details")
  return data
}

// ── SIPs ────────────────────────────────────────────────────────

import type { SIP } from "@/types"

export async function fetchSips(): Promise<SIP[]> {
  const { data } = await api.get<{ sips: SIP[] }>("/sips")
  return Array.isArray(data?.sips) ? data.sips : []
}

export type CreateSipPayload = {
  fundId: string
  monthlyAmt: number
}

export type SipResponse = {
  sip: {
    id: string
    fundId: string
    fundName: string
    monthlyAmt: number
    startDate: string
    nextDebit: string
    totalInvested: number
    currentValue: number
    status: "ACTIVE" | "PAUSED"
    installments: Array<{
      id: string
      installmentDate: string
      amount: number
      nav: number
      units: number
      status: "COMPLETED" | "FAILED" | "PENDING"
    }>
  }
}

export async function createSip(payload: CreateSipPayload): Promise<SipResponse["sip"]> {
  const { data } = await api.post<SipResponse>("/sips", payload)
  return data.sip
}

export async function updateSip(payload: { sipId: string; status?: string; monthlyAmt?: number }): Promise<SIP> {
  const { data } = await api.patch<{ sip: SIP }>("/sips", payload)
  return data.sip
}

export async function deleteSip(sipId: string): Promise<SIP> {
  const { data } = await api.delete<{ sip: SIP }>("/sips", { params: { id: sipId } })
  return data.sip
}
