import { describe, it, expect } from "vitest"
import { getErrorMessage } from "@/lib/error-messages"

describe("getErrorMessage", () => {
  it("returns server message when present", () => {
    const err = { response: { status: 400, data: { message: "Email taken" } } }
    expect(getErrorMessage(err)).toBe("Email taken")
  })

  it("returns mapped status message when no server message", () => {
    const err = { response: { status: 401, data: {} } }
    expect(getErrorMessage(err)).toBe(
      "Your session has expired. Please sign in again.",
    )
  })

  it("returns conflict message for 409", () => {
    const err = { response: { status: 409, data: {} } }
    expect(getErrorMessage(err)).toBe(
      "This email is already registered. Try signing in instead.",
    )
  })

  it("returns rate limit message for 429", () => {
    const err = { response: { status: 429, data: {} } }
    expect(getErrorMessage(err)).toBe(
      "Too many attempts. Please wait a minute and try again.",
    )
  })

  it("returns generic server error for 5xx", () => {
    const err = { response: { status: 502, data: {} } }
    expect(getErrorMessage(err)).toContain("Something went wrong on our end")
  })

  it("returns network error message when no response", () => {
    const err = { message: "Network Error" }
    expect(getErrorMessage(err)).toContain("Something went wrong on our end")
  })

  it("returns fallback when provided and no other match", () => {
    expect(getErrorMessage({}, "Custom fallback")).toBe("Custom fallback")
  })

  it("returns default fallback when nothing matches", () => {
    expect(getErrorMessage({})).toBe("Something went wrong. Please try again.")
  })
})
