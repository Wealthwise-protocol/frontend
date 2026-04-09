import { useState } from "react"
import { Link } from "react-router-dom"
import { useSignIn } from "@/hooks/use-auth"
import { usePageTitle } from "@/hooks/use-page-title"
import { getErrorMessage } from "@/lib/error-messages"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconShield,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react"
import { FadeIn } from "@/components/ui/animated"

export function SignInPage() {
  usePageTitle("Sign In")
  const signInMutation = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function getFieldError(field: string) {
    if (!touched[field]) return null
    if (field === "email" && !email.trim()) return "Email is required"
    if (field === "password" && !password) return "Password is required"
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setTouched({ email: true, password: true })

    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!password) {
      setError("Password is required")
      return
    }

    signInMutation.mutate(
      { email, password },
      {
        onError: (err: unknown) => {
          setError(getErrorMessage(err, "Invalid email or password"))
        },
      }
    )
  }

  const emailError = getFieldError("email")
  const passwordError = getFieldError("password")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/wealthwiselogonobg.png" alt="WealthWise" className="size-6" />
          <span className="text-sm font-semibold">WealthWise</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <FadeIn className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Card className="mt-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    autoComplete="email"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <p id="email-error" className="text-xs text-destructive">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="section-label">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-[0.65rem] text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      autoComplete="current-password"
                      className="pr-10"
                      aria-invalid={!!passwordError}
                      aria-describedby={passwordError ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <IconEyeOff className="size-4" />
                      ) : (
                        <IconEye className="size-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p id="password-error" className="text-xs text-destructive">{passwordError}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  <Label htmlFor="remember" className="text-xs text-muted-foreground">
                    Remember me
                  </Label>
                </div>

                {error && (
                  <p className="text-xs text-destructive" role="alert">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
                  {signInMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconLock className="size-3" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconShield className="size-3" />
              <span>SEBI Registered</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconRosetteDiscountCheck className="size-3" />
              <span>Bank-grade Security</span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
