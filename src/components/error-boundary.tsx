import { Component, type ReactNode } from "react"

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-8 text-center">
          <img
            src="/wealthwiselogonobg.png"
            alt="WealthWise"
            className="size-10"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Something went wrong
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Your money and data are completely safe. This is a display error on
              our end.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
            <a
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Go to dashboard
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
