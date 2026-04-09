import { Sentry } from "@/lib/sentry"

const isDev = import.meta.env.DEV

export const logger = {
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args)

    const error = args[0]
    if (error instanceof Error) {
      Sentry.captureException(error)
    } else {
      Sentry.captureMessage(String(args[0]), {
        level: "error",
        extra: { args: args.slice(1) },
      })
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args)
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args)
  },
}
