import { test as base, type Page } from "@playwright/test"

// ── Mock data ──────────────────────────────────────────────────────

export const TEST_USER = {
  id: "user-1",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "9876543210",
  countryCode: "+91",
  kycVerified: true,
}

export const TEST_TOKEN = "mock-jwt-token-for-e2e"

export const MOCK_FUNDS = {
  content: [
    {
      id: "fund-1",
      name: "WealthWise Large Cap Fund",
      amc: "WealthWise AMC",
      category: "Equity",
      subcategory: "Large Cap",
      risk: "MODERATE",
      nav: 45.23,
      navChange: 0.35,
      expenseRatio: 0.45,
      aum: 12500,
      minSip: 500,
      minLumpsum: 5000,
      description: "A large cap equity fund",
      returns: { "1Y": 15.4, "3Y": 12.8, "5Y": 14.2 },
      categoryReturns: { "1Y": 14.0, "3Y": 11.0, "5Y": 12.0 },
    },
    {
      id: "fund-2",
      name: "WealthWise Debt Fund",
      amc: "WealthWise AMC",
      category: "Debt",
      subcategory: "Short Duration",
      risk: "LOW",
      nav: 22.1,
      navChange: -0.05,
      expenseRatio: 0.3,
      aum: 8500,
      minSip: 1000,
      minLumpsum: 5000,
      description: "A short duration debt fund",
      returns: { "1Y": 7.2, "3Y": 6.9, "5Y": 7.5 },
      categoryReturns: { "1Y": 7.0, "3Y": 6.0, "5Y": 6.5 },
    },
  ],
  totalElements: 2,
  totalPages: 1,
  number: 0,
  size: 12,
  first: true,
  last: true,
  empty: false,
}

export const MOCK_PORTFOLIO = {
  summary: {
    currentValue: 125000,
    totalInvested: 100000,
    totalGain: 25000,
    gainPercent: 25.0,
  },
  holdings: [
    {
      id: "h1",
      name: "WealthWise Large Cap Fund",
      category: "Equity",
      units: 220,
      avgNav: 40.0,
      curNav: 45.23,
      invested: 88000,
      curValue: 99506,
      gain: 11506,
    },
  ],
  portfolioHistory: [
    { month: "2025-01-15", value: 100000 },
    { month: "2025-02-15", value: 105000 },
    { month: "2025-03-15", value: 125000 },
  ],
  assetAllocation: [
    { label: "Equity", name: "Equity", value: 80 },
    { label: "Debt", name: "Debt", value: 20 },
  ],
}

// ── Helper: set up API mocks on a page ─────────────────────────────

export async function mockApi(page: Page) {
  // Auth
  await page.route("**/auth/signin", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user: TEST_USER, token: TEST_TOKEN }),
    }),
  )

  await page.route("**/auth/signout", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    }),
  )

  // Funds
  await page.route("**/funds?*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_FUNDS),
    }),
  )

  await page.route("**/funds/*/nav-history*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        navHistory: [
          { date: "2025-01-01", nav: 40.0 },
          { date: "2025-06-01", nav: 42.5 },
          { date: "2026-01-01", nav: 45.23 },
        ],
      }),
    }),
  )

  // Bookmarks
  await page.route("**/bookmarks", (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ fundIds: [] }),
      })
    }
    return route.fulfill({ status: 200, body: "{}" })
  })

  await page.route("**/bookmarks/*", (route) =>
    route.fulfill({ status: 200, body: "{}" }),
  )

  // Portfolio
  await page.route("**/portfolio/all-details*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_PORTFOLIO),
    }),
  )

  // SIPs
  await page.route("**/sips", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ sips: [] }),
    }),
  )

  // Transactions
  await page.route("**/transactions", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ transactions: [] }),
    }),
  )

  // AI insight
  await page.route("**/api/ai/insight", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ insight: "Your portfolio is well diversified." }),
    }),
  )
}

// ── Helper: sign in by setting localStorage + cookie ───────────────

export async function signInViaState(page: Page) {
  await page.addInitScript(() => {
    const authState = {
      state: {
        user: {
          id: "user-1",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "9876543210",
          countryCode: "+91",
          kycVerified: true,
        },
        isAuthenticated: true,
      },
      version: 0,
    }
    localStorage.setItem("ww-auth", JSON.stringify(authState))
    document.cookie = "ww-token=mock-jwt-token-for-e2e; path=/"
  })
}

// ── Extended test fixture ──────────────────────────────────────────

export const test = base.extend<{
  authenticatedPage: Page
}>({
  authenticatedPage: async ({ page }, use) => {
    await mockApi(page)
    await signInViaState(page)
    await use(page)
  },
})

export { expect } from "@playwright/test"
