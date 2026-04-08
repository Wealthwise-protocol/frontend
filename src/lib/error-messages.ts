type AxiosLikeError = {
  response?: {
    status?: number
    data?: { message?: string }
  }
  message?: string
}

const statusMessages: Record<number, string> = {
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you're looking for.",
  409: "This email is already registered. Try signing in instead.",
  429: "Too many attempts. Please wait a minute and try again.",
  500: "Something went wrong on our end. Your money is safe. Please try again.",
}

export function getErrorMessage(error: unknown, fallback?: string): string {
  const err = error as AxiosLikeError

  const serverMessage = err?.response?.data?.message
  if (serverMessage) return serverMessage

  const status = err?.response?.status
  if (status && statusMessages[status]) return statusMessages[status]

  if (status && status >= 500)
    return "Something went wrong on our end. Your money is safe. Please try again."

  if (!err?.response && err?.message)
    return "Something went wrong on our end. Your money is safe. Please try again."

  return fallback ?? "Something went wrong. Please try again."
}
