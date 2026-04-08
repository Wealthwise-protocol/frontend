import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth"
import { getErrorMessage } from "@/lib/error-messages"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconArrowLeft, IconMailForward } from "@tabler/icons-react"
import { FadeIn } from "@/components/ui/animated"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
      setSent(true)
      toast.success("Reset link sent to your email")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
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
          {!sent ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  Reset your password
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
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
                        autoComplete="email"
                      />
                    </div>

                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <IconMailForward className="size-8 text-primary" />
              </div>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">
                Check your email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Didn&apos;t receive the email?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="font-medium text-primary hover:underline"
                >
                  Try again
                </button>
              </p>
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
