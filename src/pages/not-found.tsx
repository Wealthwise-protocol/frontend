import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconArrowLeft } from "@tabler/icons-react"
import { FadeIn } from "@/components/ui/animated"

export function NotFoundPage() {
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
        <FadeIn className="w-full max-w-md text-center">
          <p className="text-7xl font-bold tracking-tighter text-primary">404</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/">
                <IconArrowLeft className="mr-1.5 size-3.5" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
