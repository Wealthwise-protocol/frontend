import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

export function CTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
      <div className="pointer-events-none absolute inset-0 mx-auto h-40 w-[400px] rounded-full bg-primary/8 blur-[80px]" />
      <h2 className="relative text-3xl font-bold tracking-tight md:text-4xl">
        Your wealth, <span className="gradient-text">managed wisely.</span>
      </h2>
      <div className="relative mt-8">
        <Button size="lg" className="glow-primary" asChild>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
          </Link>
        </Button>
      </div>
    </section>
  )
}
