import { create } from "zustand"
import { persist } from "zustand/middleware"

type ExploreState = {
  savedFundIds: string[]
  toggleSave: (fundId: string) => void
  isSaved: (fundId: string) => boolean
}

export const useExploreStore = create<ExploreState>()(
  persist(
    (set, get) => ({
      savedFundIds: [],

      toggleSave: (fundId) => {
        set((state) => {
          const exists = state.savedFundIds.includes(fundId)
          return {
            savedFundIds: exists
              ? state.savedFundIds.filter((id) => id !== fundId)
              : [...state.savedFundIds, fundId],
          }
        })
      },

      isSaved: (fundId) => {
        return get().savedFundIds.includes(fundId)
      },
    }),
    {
      name: "ww-explore",
      partialize: (state) => ({ savedFundIds: state.savedFundIds }),
    }
  )
)
