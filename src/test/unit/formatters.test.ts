import { describe, it, expect } from "vitest"
import {
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
  formatNav,
} from "@/lib/formatters"

describe("formatCurrency", () => {
  it("formats crores (>= 1 Cr)", () => {
    expect(formatCurrency(10_000_000)).toBe("₹1.00 Cr")
    expect(formatCurrency(25_500_000)).toBe("₹2.55 Cr")
  })

  it("formats lakhs (>= 1 L)", () => {
    expect(formatCurrency(100_000)).toBe("₹1.00 L")
    expect(formatCurrency(1_245_800)).toBe("₹12.46 L")
  })

  it("formats thousands with Indian locale", () => {
    expect(formatCurrency(50_000)).toBe("₹50,000")
    expect(formatCurrency(999)).toBe("₹999")
  })

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("₹0")
  })

  it("handles negative values", () => {
    expect(formatCurrency(-10_000_000)).toBe("-₹1.00 Cr")
    expect(formatCurrency(-200_000)).toBe("-₹2.00 L")
    expect(formatCurrency(-5000)).toBe("-₹5,000")
  })
})

describe("formatCurrencyCompact", () => {
  it("formats with Indian locale and no decimals", () => {
    expect(formatCurrencyCompact(1245800)).toBe("₹12,45,800")
    expect(formatCurrencyCompact(500)).toBe("₹500")
  })

  it("rounds to nearest integer", () => {
    expect(formatCurrencyCompact(1234.56)).toBe("₹1,235")
  })
})

describe("formatPercent", () => {
  it("shows + sign for positive values by default", () => {
    expect(formatPercent(18.4)).toBe("+18.40%")
  })

  it("shows - sign for negative values by default", () => {
    expect(formatPercent(-5.3)).toBe("-5.30%")
  })

  it("shows zero as positive", () => {
    expect(formatPercent(0)).toBe("+0.00%")
  })

  it("omits sign when showSign is false", () => {
    expect(formatPercent(18.4, false)).toBe("18.40%")
    expect(formatPercent(-5.3, false)).toBe("5.30%")
  })
})

describe("formatNav", () => {
  it("always shows 4 decimal places", () => {
    expect(formatNav(45.1)).toBe("₹45.1000")
    expect(formatNav(123.4567)).toBe("₹123.4567")
    expect(formatNav(100)).toBe("₹100.0000")
  })
})
