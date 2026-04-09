import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, userEvent } from "@/test/utils/test-utils"
import { SignUpPage } from "@/pages/signup"

const mockMutate = vi.fn()

vi.mock("@/hooks/use-auth", () => ({
  useSignUp: () => ({
    mutate: mockMutate,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  }),
}))

describe("SignUpPage", () => {
  beforeEach(() => {
    mockMutate.mockClear()
  })

  it("shows all required fields", () => {
    render(<SignUpPage />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it("shows error when names are empty", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.click(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText("First and last name are required"),
      ).toBeInTheDocument()
    })
  })

  it("shows error for empty email", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/first name/i), "Arjun")
    await user.type(screen.getByLabelText(/last name/i), "Kapoor")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument()
    })
  })

  it("validates email format with regex", () => {
    // The signup form uses this regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(regex.test("notanemail")).toBe(false)
    expect(regex.test("missing@dot")).toBe(false)
    expect(regex.test("valid@email.com")).toBe(true)
  })

  it("shows error for empty phone", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/first name/i), "Arjun")
    await user.type(screen.getByLabelText(/last name/i), "Kapoor")
    await user.type(
      screen.getByLabelText(/email address/i),
      "arjun@test.com",
    )
    await user.click(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText("Phone number is required"),
      ).toBeInTheDocument()
    })
  })

  it("shows error for short phone number", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/first name/i), "Arjun")
    await user.type(screen.getByLabelText(/last name/i), "Kapoor")
    await user.type(
      screen.getByLabelText(/email address/i),
      "arjun@test.com",
    )
    await user.type(screen.getByLabelText(/phone number/i), "123")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid phone number"),
      ).toBeInTheDocument()
    })
  })

  it("shows error for short password", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/first name/i), "Arjun")
    await user.type(screen.getByLabelText(/last name/i), "Kapoor")
    await user.type(
      screen.getByLabelText(/email address/i),
      "arjun@test.com",
    )
    await user.type(screen.getByLabelText(/phone number/i), "9876543210")
    await user.type(screen.getByLabelText(/^password$/i), "short")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument()
    })
  })

  it("shows passwords do not match error", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/^password$/i), "StrongPass1!")
    await user.type(screen.getByLabelText(/confirm password/i), "Different1!")

    await waitFor(() => {
      expect(
        screen.getByText("Passwords do not match"),
      ).toBeInTheDocument()
    })
  })

  it("shows passwords match when they match", async () => {
    const user = userEvent.setup()
    render(<SignUpPage />)

    await user.type(screen.getByLabelText(/^password$/i), "StrongPass1!")
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "StrongPass1!",
    )

    await waitFor(() => {
      expect(screen.getByText("Passwords match")).toBeInTheDocument()
    })
  })

  it("has a link to sign in", () => {
    render(<SignUpPage />)
    expect(screen.getByText("Sign in")).toBeInTheDocument()
  })
})
