import { test, expect, mockApi, signInViaState } from "./fixtures"

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
  })

  test("signs in via form and lands on dashboard", async ({ page }) => {
    await page.goto("/signin")

    await page.getByLabel("Email Address").fill("test@example.com")
    await page.getByLabel(/^password$/i).fill("password123")
    await page.getByRole("button", { name: "Sign In" }).click()

    await expect(page).toHaveURL("/dashboard")
  })

  test("signs out and redirects to sign-in", async ({ page }) => {
    await signInViaState(page)
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")

    // Open account menu dropdown and click Logout
    await page.getByRole("button", { name: "Account menu" }).click()
    await page.getByRole("menuitem", { name: "Logout" }).click()

    await expect(page).toHaveURL("/signin")
  })

  test("redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/signin")
  })
})
