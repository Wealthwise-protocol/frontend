export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""

  if (abs >= 10_000_000) {
    return `${sign}₹${(abs / 10_000_000).toFixed(2)} Cr`
  }
  if (abs >= 100_000) {
    return `${sign}₹${(abs / 100_000).toFixed(2)} L`
  }
  return `${sign}₹${abs.toLocaleString("en-IN")}`
}

export function formatCurrencyCompact(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`
}

export function formatPercent(value: number, showSign = true): string {
  const abs = Math.abs(value)
  if (showSign) {
    return value >= 0 ? `+${abs.toFixed(2)}%` : `-${abs.toFixed(2)}%`
  }
  return `${abs.toFixed(2)}%`
}

export function formatNav(nav: number): string {
  return `₹${nav.toFixed(4)}`
}
