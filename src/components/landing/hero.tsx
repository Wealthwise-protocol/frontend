import { IconBuildingBank, IconShieldCheck, IconSparkles } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

export function Hero() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pt-16 pb-12 sm:px-6 md:pt-32 md:pb-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(600px,100vw)] -translate-x-1/2 bg-primary/10 blur-[100px]" />
      <div className="relative max-w-2xl">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Invest in mutual funds.{" "}
          <span className="block gradient-text">Precisely.</span>
        </h1>

        <p className="mt-4 max-w-lg text-xs leading-relaxed text-muted-foreground sm:mt-6 sm:text-sm">
          Data-driven investing for the modern portfolio. Access comprehensive
          metrics, build disciplined SIPs, and track performance with
          terminal-grade precision.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
          {isAuthenticated ? (
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">Start Investing</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signin">Explore Funds</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6 text-[0.65rem] text-muted-foreground sm:gap-6 sm:text-xs md:mt-12">
        <div className="flex items-center gap-2">
          <IconBuildingBank className="size-4" />
          <span>5000+ Funds</span>
        </div>
        <div className="flex items-center gap-2">
          <IconShieldCheck className="size-4" />
          <span>SEBI Regulated</span>
        </div>
        <div className="flex items-center gap-2">
          <IconSparkles className="size-4" />
          <span>₹0 Commission</span>
        </div>
      </div>
    </section>
  )
}
