import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

export function CTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 md:py-24">
      <div className="pointer-events-none absolute inset-0 mx-auto h-40 w-[min(400px,90vw)] bg-primary/8 blur-[80px]" />
      <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        Your wealth, <span className="gradient-text">managed wisely.</span>
      </h2>
      <div className="relative mt-6 sm:mt-8">
        <Button size="lg" className="glow-primary w-full sm:w-auto" asChild>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
          </Link>
        </Button>
      </div>
    </section>
  )
}
