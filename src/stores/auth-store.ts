import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, SignUpPayload } from "@/types"
import { mockUser } from "@/data/mock"

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpPayload) => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<User>) => void
  updatePassword: (current: string, newPw: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: async (email, _password) => {
        // MOCK: simulate API call
        await new Promise((r) => setTimeout(r, 800))
        // REAL: const res = await api.post('/auth/signin', { email, password })
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
        })
      },

      signUp: async (data) => {
        // MOCK: simulate API call
        await new Promise((r) => setTimeout(r, 1000))
        // REAL: const res = await api.post('/auth/signup', data)
        set({
          user: {
            id: `usr-${Date.now()}`,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            countryCode: data.countryCode,
            kycVerified: false,
          },
          isAuthenticated: true,
        })
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },

      updatePassword: async (_current, _newPw) => {
        // MOCK: simulate API call
        await new Promise((r) => setTimeout(r, 800))
        // REAL: await api.post('/auth/change-password', { current, newPw })
      },
    }),
    {
      name: "ww-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
