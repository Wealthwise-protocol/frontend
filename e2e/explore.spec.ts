import { test, expect } from "./fixtures"

test.describe("Fund Explorer", () => {
  test("displays fund cards", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard/explore")

    await expect(page.getByText("WealthWise Large Cap Fund")).toBeVisible()
    await expect(page.getByText("WealthWise Debt Fund")).toBeVisible()
  })

  test("fund cards are keyboard accessible", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard/explore")

    // Fund cards should have role="button" and be focusable
    const fundCard = page.getByRole("button", { name: /View details for WealthWise Large Cap Fund/ })
    await expect(fundCard).toBeVisible()
  })

  test("category filter shows matching funds", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard/explore")

    // Click Equity category
    await page.getByRole("button", { name: "Equity" }).click()

    // Should still see equity fund
    await expect(page.getByText("WealthWise Large Cap Fund")).toBeVisible()
  })
})
