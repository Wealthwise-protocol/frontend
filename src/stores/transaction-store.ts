import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Transaction } from "@/types"
import { mockTransactions } from "@/data/mock"

type TransactionState = {
  transactions: Transaction[]
  initialized: boolean

  init: () => void
  addTransaction: (tx: Omit<Transaction, "id">) => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      initialized: false,

      init: () => {
        if (get().initialized) return
        // MOCK: load mock data
        // REAL: const data = await api.get('/transactions')
        set({ transactions: mockTransactions, initialized: true })
      },

      addTransaction: (tx) => {
        set((state) => ({
          transactions: [
            { ...tx, id: `t-${Date.now()}` },
            ...state.transactions,
          ],
        }))
      },
    }),
    {
      name: "ww-transactions",
      partialize: (state) => ({
        transactions: state.transactions,
        initialized: state.initialized,
      }),
    }
  )
)
