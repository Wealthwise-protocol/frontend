import { useState, useEffect, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth"
import { getErrorMessage } from "@/lib/error-messages"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconEyeOff,
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
  {
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
]

type Step = "email" | "otp" | "success"

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Resend cooldown
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const strength = getPasswordStrength(password)

  const passwordsMatch = useMemo(
    () => confirmPassword.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  )

  const sendOtp = useCallback(async () => {
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setStep("otp")
      setCooldown(30)
      toast.success("OTP sent to your email")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [email])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    await sendOtp()
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!otp.trim()) {
      setError("OTP is required")
      return
    }
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
      await authService.resetPassword({ otp, newPassword: password })
      setStep("success")
      toast.success("Password reset successfully!")
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Invalid or expired OTP. Please try again."),
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (cooldown > 0) return
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setCooldown(30)
      toast.success("OTP resent to your email")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/wealthwiselogonobg.png"
            alt="WealthWise"
            className="size-6"
          />
          <span className="text-sm font-semibold">WealthWise</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <FadeIn className="w-full max-w-md">
          {step === "email" && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  Reset your password
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email address and we&apos;ll send you an OTP to
                  reset your password.
                </p>
              </div>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="section-label">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="arjun@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>

                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send OTP"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  Enter OTP & new password
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent an OTP to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Enter it below along with your new password.
                </p>
              </div>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="section-label">
                        OTP
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter OTP from your email"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        autoComplete="one-time-code"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="section-label">
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
                                  "h-1 flex-1 transition-colors",
                                  i < strength
                                    ? strengthColors[strength - 1]
                                    : "bg-muted",
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
                                    : "text-emerald-500",
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
                                      "flex size-3.5 shrink-0 items-center justify-center transition-colors",
                                      met
                                        ? "bg-emerald-500 text-white"
                                        : "rounded border border-border",
                                    )}
                                  >
                                    {met && <IconCheck className="size-2.5" />}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[0.65rem]",
                                      met
                                        ? "text-muted-foreground line-through"
                                        : "text-muted-foreground",
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
                      <Label
                        htmlFor="confirmNewPassword"
                        className="section-label"
                      >
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
                            passwordsMatch
                              ? "text-emerald-500"
                              : "text-destructive",
                          )}
                        >
                          {passwordsMatch
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Didn&apos;t receive the OTP?{" "}
                      {cooldown > 0 ? (
                        <span className="font-medium text-muted-foreground">
                          Resend in {cooldown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={loading}
                          className="font-medium text-primary hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gain">
                <IconCheck className="size-8 text-emerald-500" />
              </div>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">
                Password Reset
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
              <Button className="mt-8" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft className="size-3" />
              Back to Sign In
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
