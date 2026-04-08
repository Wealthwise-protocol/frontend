import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const definitions: Record<string, string> = {
  XIRR: "Extended Internal Rate of Return \u2014 your annualised return accounting for the timing of each SIP payment. More accurate than simple returns for regular investments.",
  "Expense Ratio":
    "Annual fee charged by the fund house to manage your money. Deducted daily from NAV. Lower is better.",
  NAV: "Net Asset Value \u2014 the price of one unit of this mutual fund, updated daily after market close.",
  AUM: "Assets Under Management \u2014 total money managed by this fund. Higher AUM indicates investor trust.",
  ELSS: "Equity Linked Savings Scheme \u2014 a tax-saving mutual fund with a 3-year lock-in period. Qualifies for \u20B91.5L deduction under Section 80C.",
  SIP: "Systematic Investment Plan \u2014 invest a fixed amount every month automatically.",
}

export function FinanceTerm({
  term,
  className,
}: {
  term: string
  className?: string
}) {
  const definition = definitions[term]
  if (!definition) return <span className={className}>{term}</span>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`cursor-help border-b border-dashed border-muted-foreground/40 ${className ?? ""}`}
        >
          {term}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">
        {definition}
      </TooltipContent>
    </Tooltip>
  )
}
