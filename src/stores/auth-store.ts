import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie"
import type { User } from "@/types"

export const TOKEN_COOKIE = "ww-token"

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  updateProfile: (data: Partial<User>) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        Cookies.set(TOKEN_COOKIE, token, { expires: 7, sameSite: "lax" })
        set({ user, token, isAuthenticated: true })
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },

      signOut: () => {
        Cookies.remove(TOKEN_COOKIE)
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "ww-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
