import { authService } from "@/services/auth"
import { api } from "@/services/api"

vi.mock("@/services/api", () => ({
  api: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: "u1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "9876543210",
    countryCode: "+91",
    kycVerified: false,
  }

  describe("signIn", () => {
    it("calls POST /auth/signin and returns data", async () => {
      const payload = { email: "john@example.com", password: "pass123" }
      const response = { user: mockUser, token: "jwt-token" }
      vi.mocked(api.post).mockResolvedValue({ data: response })

      const result = await authService.signIn(payload)

      expect(api.post).toHaveBeenCalledWith("/auth/signin", payload)
      expect(result).toEqual(response)
    })

    it("propagates API errors", async () => {
      vi.mocked(api.post).mockRejectedValue(new Error("Network Error"))

      await expect(authService.signIn({ email: "a@b.com", password: "x" })).rejects.toThrow(
        "Network Error",
      )
    })
  })

  describe("signUp", () => {
    it("calls POST /auth/signup and returns data", async () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "9876543210",
        countryCode: "+91",
        password: "pass123",
      }
      const response = { user: mockUser, token: "jwt-token" }
      vi.mocked(api.post).mockResolvedValue({ data: response })

      const result = await authService.signUp(payload)

      expect(api.post).toHaveBeenCalledWith("/auth/signup", payload)
      expect(result).toEqual(response)
    })
  })

  describe("signOut", () => {
    it("calls POST /auth/signout", async () => {
      vi.mocked(api.post).mockResolvedValue({})

      await authService.signOut()

      expect(api.post).toHaveBeenCalledWith("/auth/signout")
    })
  })

  describe("changePassword", () => {
    it("calls POST /auth/change-password", async () => {
      const payload = { currentPassword: "old", newPassword: "new" }
      vi.mocked(api.post).mockResolvedValue({})

      await authService.changePassword(payload)

      expect(api.post).toHaveBeenCalledWith("/auth/change-password", payload)
    })
  })

  describe("forgotPassword", () => {
    it("calls POST /auth/forgot-password with email", async () => {
      vi.mocked(api.post).mockResolvedValue({})

      await authService.forgotPassword("john@example.com")

      expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
        email: "john@example.com",
      })
    })
  })

  describe("resetPassword", () => {
    it("calls POST /auth/reset-password", async () => {
      const payload = { otp: "123456", newPassword: "newpass" }
      vi.mocked(api.post).mockResolvedValue({})

      await authService.resetPassword(payload)

      expect(api.post).toHaveBeenCalledWith("/auth/reset-password", payload)
    })
  })

  describe("updateProfile", () => {
    it("calls PATCH /auth/profile and returns user", async () => {
      const payload = { firstName: "Jane" }
      vi.mocked(api.patch).mockResolvedValue({ data: { ...mockUser, firstName: "Jane" } })

      const result = await authService.updateProfile(payload)

      expect(api.patch).toHaveBeenCalledWith("/auth/profile", payload)
      expect(result.firstName).toBe("Jane")
    })
  })

  describe("deleteAccount", () => {
    it("calls DELETE /auth/account", async () => {
      vi.mocked(api.delete).mockResolvedValue({})

      await authService.deleteAccount()

      expect(api.delete).toHaveBeenCalledWith("/auth/account")
    })
  })
})
