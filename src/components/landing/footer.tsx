import { Link } from "react-router-dom"

const links = [
  { label: "Features", href: "#features" },
  { label: "Funds", href: "#funds" },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <img
            src="/wealthwiselogonobg.png"
            alt="WealthWise"
            className="size-5"
          />
          <span className="text-xs font-semibold">WealthWise</span>
          <span className="text-[0.6rem] text-muted-foreground">
            &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[0.65rem] text-muted-foreground sm:gap-6 sm:text-xs">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/signin"
            className="transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  )
}
