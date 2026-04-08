import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { FadeIn } from "@/components/ui/animated"
import {
  IconArrowRight,
  IconBuildingBank,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react"

export function Hero() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pt-20 pb-16 sm:px-6 md:pt-32 md:pb-28">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(700px,100vw)] -translate-x-1/2 bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute -top-20 left-1/4 h-40 w-60 bg-primary/5 blur-[80px]" />

      <FadeIn>
        <div className="card-shadow inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[0.65rem] text-muted-foreground">
          <IconSparkles className="size-3 text-primary" />
          <span>Now with AI-powered portfolio insights.</span>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="mt-6 max-w-3xl text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Stop guessing. <span className="gradient-text">Start investing.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="mt-4 max-w-lg text-xs leading-relaxed text-muted-foreground sm:mt-6 sm:text-sm">
          Browse 5,000+ mutual funds, automate SIPs, and track your portfolio
          with real-time precision. All backed by an AI co-pilot that actually
          understands your money.
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
          {isAuthenticated ? (
            <Button size="lg" className="glow-primary w-full sm:w-auto" asChild>
              <Link to="/dashboard">
                Go to Dashboard
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="glow-primary w-full sm:w-auto"
                asChild
              >
                <Link to="/signup">
                  Start Investing Free
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link to="/signin">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </FadeIn>

      {/* Terminal-style portfolio preview */}
      <FadeIn delay={0.5}>
        <div className="card-shadow-lg mt-12 overflow-hidden rounded-xl border border-border bg-card md:mt-16">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <div className="bg-loss/60 size-2.5 rounded-full" />
            <div className="bg-warning/60 size-2.5 rounded-full" />
            <div className="bg-gain/60 size-2.5 rounded-full" />
            <span className="ml-2 text-[0.6rem] text-muted-foreground">
              wealthwise / portfolio
            </span>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-card p-4 sm:p-5">
              <p className="section-label">Portfolio Value</p>
              <p className="num mt-1.5 text-lg font-bold sm:text-xl">
                ₹12,45,800
              </p>
              <p className="num-positive mt-1 text-[0.65rem]">
                +18.4% all time
              </p>
            </div>
            <div className="bg-card p-4 sm:p-5">
              <p className="section-label">Active SIPs</p>
              <p className="num mt-1.5 text-lg font-bold sm:text-xl">7</p>
              <p className="mt-1 text-[0.65rem] text-muted-foreground">
                ₹25,000/mo invested
              </p>
            </div>
            <div className="bg-card p-4 sm:p-5">
              <p className="section-label">AI Insight</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                <span className="text-primary">"</span>Your small-cap allocation
                is 40% — consider rebalancing to reduce volatility.
                <span className="text-primary">"</span>
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Trust indicators */}
      <FadeIn delay={0.6}>
        <div className="mt-8 flex flex-wrap items-center gap-4 text-[0.65rem] text-muted-foreground sm:gap-6 sm:text-xs">
          <div className="flex items-center gap-2">
            <IconBuildingBank className="size-3.5" />
            <span>5000+ Mutual Funds</span>
          </div>
          <div className="flex items-center gap-2">
            <IconShieldCheck className="size-3.5" />
            <span>SEBI Regulated</span>
          </div>
          <div className="flex items-center gap-2">
            <IconSparkles className="size-3.5" />
            <span>₹0 Commission</span>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
