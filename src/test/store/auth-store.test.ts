import { describe, it, expect, beforeEach, vi } from "vitest"
import { useAuthStore } from "@/stores/auth-store"
import type { User } from "@/types"

// Mock js-cookie
vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
    remove: vi.fn(),
    get: vi.fn(),
  },
}))

const mockUser: User = {
  id: "user-1",
  firstName: "Arjun",
  lastName: "Kapoor",
  email: "arjun@test.com",
  phone: "9876543210",
  countryCode: "+91",
  kycVerified: true,
}

describe("auth store", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  it("has correct initial state", () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it("setAuth sets user, token, and isAuthenticated", async () => {
    const Cookies = (await import("js-cookie")).default

    useAuthStore.getState().setAuth(mockUser, "test-jwt-token")

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe("test-jwt-token")
    expect(state.isAuthenticated).toBe(true)
    expect(Cookies.set).toHaveBeenCalledWith("ww-token", "test-jwt-token", {
      expires: 7,
      sameSite: "strict",
    })
  })

  it("signOut resets all state", async () => {
    const Cookies = (await import("js-cookie")).default

    // First set auth
    useAuthStore.getState().setAuth(mockUser, "test-jwt-token")
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    // Then sign out
    useAuthStore.getState().signOut()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(Cookies.remove).toHaveBeenCalledWith("ww-token")
  })

  it("updateProfile updates user fields without changing token", () => {
    useAuthStore.getState().setAuth(mockUser, "test-jwt-token")

    useAuthStore.getState().updateProfile({
      firstName: "Rahul",
      phone: "1111111111",
    })

    const state = useAuthStore.getState()
    expect(state.user?.firstName).toBe("Rahul")
    expect(state.user?.phone).toBe("1111111111")
    // Unchanged fields
    expect(state.user?.lastName).toBe("Kapoor")
    expect(state.user?.email).toBe("arjun@test.com")
    // Token untouched
    expect(state.token).toBe("test-jwt-token")
    expect(state.isAuthenticated).toBe(true)
  })

  it("updateProfile does nothing when user is null", () => {
    useAuthStore.getState().updateProfile({ firstName: "Ghost" })

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
  })
})
