import Cookies from "js-cookie"

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    remove: vi.fn(),
  },
}))

// Must mock the store module before importing api
vi.mock("@/stores/auth-store", () => ({
  TOKEN_COOKIE: "ww-token",
  useAuthStore: { getState: () => ({}) },
}))

vi.mock("@/lib/env", () => ({
  env: { API_BASE_URL: "https://test-api.example.com" },
}))

describe("api interceptors", () => {
  let api: typeof import("@/services/api")["api"]

  beforeEach(async () => {
    vi.clearAllMocks()

    // Dynamically import so mocks are applied
    vi.resetModules()
    const mod = await import("@/services/api")
    api = mod.api
  })

  describe("request interceptor", () => {
    it("attaches Authorization header when cookie exists", async () => {
      vi.mocked(Cookies.get).mockReturnValue("my-jwt-token" as never)

      // Access the request interceptor directly
      const requestHandler = api.interceptors.request.handlers[0] as {
        fulfilled: (config: Record<string, unknown>) => Record<string, unknown>
      }
      const config = { headers: { set: vi.fn(), get: vi.fn() } } as Record<string, unknown>

      const result = requestHandler.fulfilled(config)

      expect(Cookies.get).toHaveBeenCalledWith("ww-token")
      expect((result.headers as Record<string, string>).Authorization).toBe(
        "Bearer my-jwt-token",
      )
    })

    it("does not attach Authorization header when no cookie", async () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as never)

      const requestHandler = api.interceptors.request.handlers[0] as {
        fulfilled: (config: Record<string, unknown>) => Record<string, unknown>
      }
      const config = { headers: {} } as Record<string, unknown>

      const result = requestHandler.fulfilled(config)

      expect((result.headers as Record<string, string>).Authorization).toBeUndefined()
    })
  })

  describe("response interceptor", () => {
    let responseRejected: (error: Record<string, unknown>) => Promise<unknown>
    const originalLocation = window.location.href

    beforeEach(() => {
      const responseHandler = api.interceptors.response.handlers[0] as {
        rejected: (error: Record<string, unknown>) => Promise<unknown>
      }
      responseRejected = responseHandler.rejected

      Object.defineProperty(window, "location", {
        writable: true,
        value: { href: originalLocation },
      })

      vi.spyOn(Storage.prototype, "removeItem")
    })

    afterEach(() => {
      Object.defineProperty(window, "location", {
        writable: true,
        value: { href: originalLocation },
      })
    })

    it("passes through successful responses", () => {
      const responseHandler = api.interceptors.response.handlers[0] as {
        fulfilled: (response: unknown) => unknown
      }
      const response = { data: { ok: true }, status: 200 }

      expect(responseHandler.fulfilled(response)).toEqual(response)
    })

    it("auto-signs out on 401 for non-auth route with token", async () => {
      vi.mocked(Cookies.get).mockReturnValue("token" as never)

      const error = {
        response: { status: 401 },
        config: { url: "/portfolio/all-details" },
      }

      await expect(responseRejected(error)).rejects.toEqual(error)

      expect(Cookies.remove).toHaveBeenCalledWith("ww-token")
      expect(localStorage.removeItem).toHaveBeenCalledWith("ww-auth")
      expect(window.location.href).toBe("/signin")
    })

    it("does NOT auto-sign out on 401 for auth routes", async () => {
      vi.mocked(Cookies.get).mockReturnValue("token" as never)

      const error = {
        response: { status: 401 },
        config: { url: "/auth/signin" },
      }

      await expect(responseRejected(error)).rejects.toEqual(error)

      expect(Cookies.remove).not.toHaveBeenCalled()
      expect(window.location.href).not.toBe("/signin")
    })

    it("does NOT auto-sign out on 401 when no token present", async () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as never)

      const error = {
        response: { status: 401 },
        config: { url: "/funds" },
      }

      await expect(responseRejected(error)).rejects.toEqual(error)

      expect(Cookies.remove).not.toHaveBeenCalled()
    })

    it("does NOT redirect on non-401 errors", async () => {
      vi.mocked(Cookies.get).mockReturnValue("token" as never)

      const error = {
        response: { status: 500 },
        config: { url: "/funds" },
      }

      await expect(responseRejected(error)).rejects.toEqual(error)

      expect(Cookies.remove).not.toHaveBeenCalled()
      expect(window.location.href).not.toBe("/signin")
    })
  })
})
