import { Link } from "react-router-dom"
import { IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { ScrollFadeIn } from "@/components/ui/animated"

export function CTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-28">
      <div className="pointer-events-none absolute inset-0 mx-auto h-40 w-[min(400px,90vw)] bg-primary/8 blur-[80px]" />

      <ScrollFadeIn>
        <div className="relative text-center">
          <p className="section-label">Ready?</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Your money deserves{" "}
            <span className="gradient-text">better tools.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Join WealthWise and start building wealth with AI-powered insights,
            automated SIPs, and a portfolio dashboard built for clarity.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3">
            <Button
              size="lg"
              className="glow-primary w-full sm:w-auto"
              asChild
            >
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  )
}
