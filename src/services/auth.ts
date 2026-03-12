import { api } from "./api"
import type { User } from "@/types"

type AuthResponse = {
  user: User
  token: string
}

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  password: string
}

export const authService = {
  signIn: async (data: SignInPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/signin", data)
    return res.data
  },

  signUp: async (data: SignUpPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/signup", data)
    return res.data
  },

  signOut: async (): Promise<void> => {
    await api.post("/auth/signout")
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.post("/auth/change-password", data)
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email })
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<void> => {
    await api.post("/auth/reset-password", data)
  },

  updateProfile: async (data: { firstName?: string; lastName?: string; phone?: string }): Promise<User> => {
    const res = await api.patch<User>("/auth/profile", data)
    return res.data
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/auth/account")
  },
}
