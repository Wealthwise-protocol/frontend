import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService, type SignInPayload, type SignUpPayload } from "@/services/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth-store"
import { getErrorMessage } from "@/lib/error-messages"
import { Sentry } from "@/lib/sentry"

export function useSignIn() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: SignInPayload) => authService.signIn(data),
    onSuccess: (res) => {
      setAuth(res.user, res.token)
      Sentry.setUser({ id: res.user.id, email: res.user.email })
      localStorage.setItem("ww-last-login", new Date().toISOString())
      toast.success("Welcome back!")
      navigate("/dashboard")
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Invalid email or password"))
    },
  })
}

export function useSignUp() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: SignUpPayload) => authService.signUp(data),
    onSuccess: (res) => {
      setAuth(res.user, res.token)
      toast.success("Account created successfully!")
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useSignOut() {
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSettled: () => {
      signOut()
      Sentry.setUser(null)
      queryClient.clear()
      navigate("/signin")
      toast.success("Signed out")
    },
  })
}
