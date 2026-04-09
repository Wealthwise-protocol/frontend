import { test, expect } from "./fixtures"

test.describe("Navigation", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Stop guessing.")).toBeVisible()
  })

  test("sidebar links navigate correctly", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")

    // Fund Explorer
    await page.getByRole("link", { name: "Fund Explorer" }).click()
    await expect(page).toHaveURL("/dashboard/explore")

    // SIP Management
    await page.getByRole("link", { name: "SIP Management" }).click()
    await expect(page).toHaveURL("/dashboard/sip")

    // Transactions
    await page.getByRole("link", { name: "Transactions" }).click()
    await expect(page).toHaveURL("/dashboard/transactions")

    // Profile
    await page.getByRole("link", { name: "Profile" }).click()
    await expect(page).toHaveURL("/dashboard/profile")

    // Back to Dashboard
    await page.getByRole("link", { name: "Dashboard" }).first().click()
    await expect(page).toHaveURL("/dashboard")
  })

  test("page titles update per route", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveTitle("Dashboard | WealthWise")

    await page.getByRole("link", { name: "Fund Explorer" }).click()
    await expect(page).toHaveTitle("Explore Funds | WealthWise")
  })
})
