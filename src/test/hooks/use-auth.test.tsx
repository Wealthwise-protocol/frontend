import type { ReactNode } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { useSignIn, useSignUp, useSignOut } from "@/hooks/use-auth"
import { useAuthStore } from "@/stores/auth-store"

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    )
  }
}

const mockUser = {
  id: "u1",
  firstName: "Arjun",
  lastName: "Kapoor",
  email: "arjun@test.com",
  phone: "9876543210",
  countryCode: "+91",
  kycVerified: true,
}

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock("js-cookie", () => ({
  default: { set: vi.fn(), remove: vi.fn(), get: vi.fn() },
}))

// Mock toast
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

// Mock authService
const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()

vi.mock("@/services/auth", () => ({
  authService: {
    signIn: (...args: unknown[]) => mockSignIn(...args),
    signUp: (...args: unknown[]) => mockSignUp(...args),
    signOut: (...args: unknown[]) => mockSignOut(...args),
  },
}))

describe("useSignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  it("calls signIn with email and password", async () => {
    mockSignIn.mockResolvedValue({ user: mockUser, token: "jwt-123" })

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    result.current.mutate({ email: "arjun@test.com", password: "pass123" })

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "arjun@test.com",
        password: "pass123",
      })
    })
  })

  it("sets auth store on success", async () => {
    mockSignIn.mockResolvedValue({ user: mockUser, token: "jwt-123" })

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    result.current.mutate({ email: "arjun@test.com", password: "pass123" })

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.email).toBe("arjun@test.com")
      expect(state.token).toBe("jwt-123")
    })
  })

  it("navigates to dashboard on success", async () => {
    mockSignIn.mockResolvedValue({ user: mockUser, token: "jwt-123" })

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    result.current.mutate({ email: "arjun@test.com", password: "pass123" })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
    })
  })

  it("exposes error on failure", async () => {
    mockSignIn.mockRejectedValue({
      response: { status: 401, data: { message: "Invalid credentials" } },
    })

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })

    result.current.mutate({ email: "arjun@test.com", password: "wrong" })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

describe("useSignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  it("calls signUp with correct payload", async () => {
    mockSignUp.mockResolvedValue({ user: mockUser, token: "jwt-456" })

    const { result } = renderHook(() => useSignUp(), { wrapper: createWrapper() })

    const payload = {
      firstName: "Arjun",
      lastName: "Kapoor",
      email: "arjun@test.com",
      phone: "9876543210",
      countryCode: "+91",
      password: "StrongPass1!",
    }

    result.current.mutate(payload)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(payload)
    })
  })

  it("sets auth store on success", async () => {
    mockSignUp.mockResolvedValue({ user: mockUser, token: "jwt-456" })

    const { result } = renderHook(() => useSignUp(), { wrapper: createWrapper() })

    result.current.mutate({
      firstName: "Arjun",
      lastName: "Kapoor",
      email: "arjun@test.com",
      phone: "9876543210",
      countryCode: "+91",
      password: "StrongPass1!",
    })

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe("jwt-456")
    })
  })
})

describe("useSignOut", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: mockUser,
      token: "jwt-123",
      isAuthenticated: true,
    })
  })

  it("calls signOut endpoint and clears auth", async () => {
    mockSignOut.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() })

    result.current.mutate()

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
    })
  })

  it("navigates to signin after signout", async () => {
    mockSignOut.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() })

    result.current.mutate()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signin")
    })
  })
})
