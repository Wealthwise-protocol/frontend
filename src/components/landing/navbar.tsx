import { IconLeaf } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <IconLeaf className="size-5 text-primary" />
          <span className="text-sm font-semibold">WealthWise</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#funds"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Funds
          </a>
          <a
            href="#about"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
