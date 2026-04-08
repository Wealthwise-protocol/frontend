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
]

export function FundPreview() {
  return (
    <section id="funds" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
      <div className="overflow-hidden rounded-xl card-shadow-md border border-border bg-card">
        <div className="hidden border-b border-border px-4 py-3 sm:block sm:px-5">
          <span className="inline-block rounded-md bg-muted px-2.5 py-1 text-[0.65rem] text-muted-foreground">
            app.wealthwise.in/explore
          </span>
        </div>

        <div className="px-4 py-4 sm:px-5">
          <div className="rounded-md border border-border bg-background px-3 py-2 text-[0.65rem] text-muted-foreground sm:text-xs">
            Search by AMC, fund name, or category...
          </div>

          <div className="mt-4 divide-y divide-border">
            {funds.map((fund) => (
              <div
                key={fund.name}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.65rem] font-semibold sm:text-xs">{fund.name}</p>
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
                        ↑ {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
