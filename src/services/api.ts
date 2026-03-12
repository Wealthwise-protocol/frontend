import axios from "axios"
import Cookies from "js-cookie"
import { TOKEN_COOKIE } from "@/stores/auth-store"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://wealthwise-backend-7zqx.onrender.com"

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
})

// ── Request interceptor — attach JWT from cookie ─────────────────
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_COOKIE)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 globally ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isAuthRoute = error.config?.url?.includes("/auth/")

    // Auto sign-out on 401 — but never on auth routes (e.g. wrong password)
    if (status === 401 && !isAuthRoute && Cookies.get(TOKEN_COOKIE)) {
      Cookies.remove(TOKEN_COOKIE)
      localStorage.removeItem("ww-auth")
      window.location.href = "/signin"
    }

    return Promise.reject(error)
  }
)
