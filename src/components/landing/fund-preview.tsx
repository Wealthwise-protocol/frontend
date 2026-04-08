import { ScrollFadeIn } from "@/components/ui/animated"

const funds = [
  {
    name: "Parag Parikh Flexi Cap Fund",
    category: "Equity",
    subcategory: "Flexi Cap",
    returns: { "1Y": "+24.1%", "3Y": "+18.3%", "5Y": "+21.0%" },
  },
  {
    name: "Nippon India Small Cap Fund",
    category: "Equity",
    subcategory: "Small Cap",
    returns: { "1Y": "+38.1%", "3Y": "+29.0%", "5Y": "+26.8%" },
  },
  {
    name: "HDFC Balanced Advantage Fund",
    category: "Hybrid",
    subcategory: "Dynamic",
    returns: { "1Y": "+21.2%", "3Y": "+14.1%", "5Y": "+15.9%" },
  },
  {
    name: "ICICI Prudential Bluechip Fund",
    category: "Equity",
    subcategory: "Large Cap",
    returns: { "1Y": "+19.7%", "3Y": "+16.5%", "5Y": "+17.2%" },
  },
]

export function FundPreview() {
  return (
    <section
      id="funds"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24"
    >
      <ScrollFadeIn>
        <p className="section-label">Fund Explorer</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Browse real funds.{" "}
          <span className="gradient-text">Real returns.</span>
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Search by name, AMC, or category. Press{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[0.6rem]">
            ⌘K
          </kbd>{" "}
          in the app to find any fund instantly.
        </p>
      </ScrollFadeIn>

      <ScrollFadeIn delay={0.15}>
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card card-shadow-md md:mt-10">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <div className="size-2.5 rounded-full bg-loss/60" />
            <div className="size-2.5 rounded-full bg-warning/60" />
            <div className="size-2.5 rounded-full bg-gain/60" />
            <span className="ml-2 text-[0.6rem] text-muted-foreground">
              wealthwise / explore
            </span>
          </div>

          <div className="px-4 py-4 sm:px-5">
            {/* Search bar mock */}
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-[0.65rem] text-muted-foreground sm:text-xs">
              <span className="text-muted-foreground/60">⌘K</span>
              <span>Search by AMC, fund name, or category...</span>
            </div>

            {/* Category pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["All", "Equity", "Debt", "Hybrid", "ELSS", "Index"].map(
                (cat, i) => (
                  <span
                    key={cat}
                    className={`rounded-full px-2.5 py-1 text-[0.6rem] font-medium transition-colors ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat}
                  </span>
                ),
              )}
            </div>

            {/* Fund list */}
            <div className="mt-4 divide-y divide-border">
              {funds.map((fund) => (
                <div
                  key={fund.name}
                  className="flex flex-col gap-2 rounded-md py-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-2 sm:py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.65rem] font-semibold sm:text-xs">
                      {fund.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[0.55rem] text-secondary-foreground sm:text-[0.6rem]">
                        {fund.category}
                      </span>
                      <span className="text-[0.55rem] text-muted-foreground sm:text-[0.6rem]">
                        {fund.subcategory}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    {Object.entries(fund.returns).map(([period, value]) => (
                      <div key={period} className="text-left sm:text-right">
                        <p className="text-[0.55rem] text-muted-foreground sm:text-[0.6rem]">
                          {period}
                        </p>
                        <p className="text-[0.65rem] font-medium num-positive sm:text-xs">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  )
}
