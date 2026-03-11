import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SIP } from "@/types"
import { mockSips } from "@/data/mock"

type SipState = {
  sips: SIP[]
  initialized: boolean

  init: () => void
  togglePause: (id: string) => void
  editAmount: (id: string, newAmount: number) => void
  cancelSip: (id: string) => void
  createSip: (fundName: string, amount: number) => void
}

export const useSipStore = create<SipState>()(
  persist(
    (set, get) => ({
      sips: [],
      initialized: false,

      init: () => {
        if (get().initialized) return
        // MOCK: load mock data
        // REAL: const data = await api.get('/sips')
        set({ sips: mockSips, initialized: true })
      },

      togglePause: (id) => {
        set((state) => ({
          sips: state.sips.map((s) => {
            if (s.id !== id) return s
            const newStatus = s.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
            return {
              ...s,
              status: newStatus as "ACTIVE" | "PAUSED",
              nextDebit: newStatus === "PAUSED" ? "--" : s.startDate,
            }
          }),
        }))
      },

      editAmount: (id, newAmount) => {
        set((state) => ({
          sips: state.sips.map((s) =>
            s.id === id ? { ...s, monthlyAmt: newAmount } : s
          ),
        }))
      },

      cancelSip: (id) => {
        set((state) => ({
          sips: state.sips.filter((s) => s.id !== id),
        }))
      },

      createSip: (fundName, amount) => {
        const now = new Date()
        const dateStr = now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        set((state) => ({
          sips: [
            ...state.sips,
            {
              id: `sip-${Date.now()}`,
              fundName,
              monthlyAmt: amount,
              startDate: dateStr,
              nextDebit: `01 ${now.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`,
              totalInvested: 0,
              currentValue: 0,
              status: "ACTIVE",
              installments: [],
            },
          ],
        }))
      },
    }),
    {
      name: "ww-sips",
      partialize: (state) => ({
        sips: state.sips,
        initialized: state.initialized,
      }),
    }
  )
)
