import * as Sentry from "@sentry/react"
import { env } from "@/lib/env"

export function initSentry() {
  const dsn = env.SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    sendDefaultPii: true,
    sampleRate: 1.0,
    tracesSampleRate: 0.1,
    beforeBreadcrumb(breadcrumb) {
      if (
        (breadcrumb.category === "xhr" || breadcrumb.category === "fetch") &&
        breadcrumb.data?.headers
      ) {
        delete breadcrumb.data.headers["Authorization"]
      }
      return breadcrumb
    },
    ignoreErrors: [
      "ResizeObserver loop",
      "Network Error",
      "Failed to fetch",
      "Load failed",
    ],
  })
}

export { Sentry }
