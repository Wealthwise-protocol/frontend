import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

export function CTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        Your wealth, managed wisely.
      </h2>
      <div className="mt-8">
        <Button size="lg" asChild>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
          </Link>
        </Button>
      </div>
    </section>
  )
}
