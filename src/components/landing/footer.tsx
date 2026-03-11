export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <span className="text-xs font-semibold">WealthWise</span>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  )
}
