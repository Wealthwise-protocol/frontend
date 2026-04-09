import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, userEvent } from "@/test/utils/test-utils"
import { SignInPage } from "@/pages/signin"

const mockMutate = vi.fn()

vi.mock("@/hooks/use-auth", () => ({
  useSignIn: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    error: null,
  }),
}))

describe("SignInPage", () => {
  beforeEach(() => {
    mockMutate.mockClear()
  })

  it("shows email and password fields", () => {
    render(<SignInPage />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })

  it("shows heading text", () => {
    render(<SignInPage />)
    expect(screen.getByText("Welcome back")).toBeInTheDocument()
  })

  it("shows error when email is empty on submit", async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      const errors = screen.getAllByText("Email is required")
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  it("shows error when password is empty on submit", async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      const errors = screen.getAllByText("Password is required")
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  it("calls mutate with correct values on valid submit", async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), "test@test.com")
    await user.type(screen.getByLabelText(/^password$/i), "mypassword123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: "test@test.com", password: "mypassword123" },
        expect.any(Object),
      )
    })
  })

  it("has a link to forgot password", () => {
    render(<SignInPage />)
    expect(screen.getByText("Forgot password?")).toBeInTheDocument()
  })

  it("has a link to sign up", () => {
    render(<SignInPage />)
    expect(screen.getByText("Create account")).toBeInTheDocument()
  })
})
