import { IconBuildingBank, IconShieldCheck, IconSparkles } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          Invest in mutual funds.{" "}
          <span className="block">Precisely.</span>
        </h1>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Data-driven investing for the modern portfolio. Access comprehensive
          metrics, build disciplined SIPs, and track performance with
          terminal-grade precision.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button size="lg" asChild>
            <Link to="/dashboard">Start Investing</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard">Explore Funds</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-border pt-6 text-xs text-muted-foreground">
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
