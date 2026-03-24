import { useState, useMemo } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  IconEye,
  IconEyeOff,
  IconCheck,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FadeIn } from "@/components/ui/animated"

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
const strengthColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
]

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = getPasswordStrength(password)

  const passwordsMatch = useMemo(
    () => confirmPassword.length > 0 && password === confirmPassword,
    [password, confirmPassword]
  )

  if (!token) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/wealthwiselogonobg.png" alt="WealthWise" className="size-6" />
            <span className="text-sm font-semibold">WealthWise</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <FadeIn className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold tracking-tight">Invalid Link</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/forgot-password">Request a New Link</Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/wealthwiselogonobg.png" alt="WealthWise" className="size-6" />
            <span className="text-sm font-semibold">WealthWise</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <FadeIn className="w-full max-w-md text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <IconCheck className="size-8 text-emerald-500" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">
              Password Reset
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been reset successfully. You can now sign in with
              your new password.
            </p>
            <Button className="mt-8" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
          </FadeIn>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (strength < 3) {
      setError("Password is too weak")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({ token: token!, newPassword: password })
      setSuccess(true)
      toast.success("Password reset successfully!")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || "Invalid or expired reset link. Please request a new one.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/wealthwiselogonobg.png" alt="WealthWise" className="size-6" />
          <span className="text-sm font-semibold">WealthWise</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <FadeIn className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below.
            </p>
          </div>

          <Card className="mt-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <IconEyeOff className="size-4" />
                      ) : (
                        <IconEye className="size-4" />
                      )}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              i < strength
                                ? strengthColors[strength - 1]
                                : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      <p
                        className={cn(
                          "text-xs",
                          strength <= 1
                            ? "text-red-500"
                            : strength === 2
                              ? "text-orange-500"
                              : strength === 3
                                ? "text-yellow-500"
                                : "text-emerald-500"
                        )}
                      >
                        {strengthLabels[strength - 1] ?? "Too short"}
                      </p>

                      <div className="space-y-1 pt-1">
                        {requirements.map((req) => {
                          const met = req.test(password)
                          return (
                            <div
                              key={req.label}
                              className="flex items-center gap-2"
                            >
                              <div
                                className={cn(
                                  "flex size-3.5 shrink-0 items-center justify-center rounded-full transition-colors",
                                  met
                                    ? "bg-emerald-500 text-white"
                                    : "border border-muted-foreground/30"
                                )}
                              >
                                {met && <IconCheck className="size-2.5" />}
                              </div>
                              <span
                                className={cn(
                                  "text-[0.65rem]",
                                  met
                                    ? "text-muted-foreground line-through"
                                    : "text-muted-foreground"
                                )}
                              >
                                {req.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword" className="text-xs">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <IconEyeOff className="size-4" />
                      ) : (
                        <IconEye className="size-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p
                      className={cn(
                        "text-xs",
                        passwordsMatch ? "text-emerald-500" : "text-destructive"
                      )}
                    >
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
