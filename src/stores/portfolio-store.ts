import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Holding } from "@/types"
import { mockHoldings, mockPortfolioHistory, mockAssetAllocation } from "@/data/mock"

type PortfolioState = {
  holdings: Holding[]
  portfolioHistory: { month: string; value: number }[]
  assetAllocation: { name: string; label: string; value: number; fill: string }[]
  initialized: boolean

  init: () => void
  addHolding: (holding: Omit<Holding, "id">) => void
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      holdings: [],
      portfolioHistory: [],
      assetAllocation: [],
      initialized: false,

      init: () => {
        if (get().initialized) return
        // MOCK: load mock data
        // REAL: const data = await api.get('/portfolio')
        set({
          holdings: mockHoldings,
          portfolioHistory: mockPortfolioHistory,
          assetAllocation: mockAssetAllocation,
          initialized: true,
        })
      },

      addHolding: (holding) => {
        set((state) => ({
          holdings: [
            ...state.holdings,
            { ...holding, id: `h-${Date.now()}` },
          ],
        }))
      },
    }),
    {
      name: "ww-portfolio",
      partialize: (state) => ({
        holdings: state.holdings,
        portfolioHistory: state.portfolioHistory,
        assetAllocation: state.assetAllocation,
        initialized: state.initialized,
      }),
    }
  )
)
