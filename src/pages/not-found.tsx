import { Link, useNavigate } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconArrowLeft } from "@tabler/icons-react"
import { FadeIn } from "@/components/ui/animated"

export function NotFoundPage() {
  usePageTitle("Page Not Found")
  const navigate = useNavigate()

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
          <p className="gradient-text text-8xl font-bold tracking-tighter">404</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <IconArrowLeft className="mr-1.5 size-3.5" />
              Go back
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
