function requireEnv(key: string): string {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function optionalEnv(key: string): string | undefined {
  return (import.meta.env[key] as string | undefined) || undefined
}

export const env = {
  API_BASE_URL: requireEnv("VITE_API_BASE_URL"),
  SENTRY_DSN: optionalEnv("VITE_SENTRY_DSN"),
} as const
