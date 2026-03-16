import { IconUserPlus, IconStack2, IconChartLine } from "@tabler/icons-react"

const steps = [
  {
    step: "STEP 01",
    title: "Sign Up",
    description: "Complete your KYC entirely online in under 5 minutes.",
    icon: IconUserPlus,
  },
  {
    step: "STEP 02",
    title: "Pick Funds",
    description: "Filter by category, risk, and historical performance metrics.",
    icon: IconStack2,
  },
  {
    step: "STEP 03",
    title: "Track & Grow",
    description: "Monitor live NAV updates and execute disciplined SIP mandates.",
    icon: IconChartLine,
  },
]

export function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        {steps.map((item) => (
          <div key={item.step} className="flex flex-col gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card sm:size-12">
              <item.icon className="size-4 text-muted-foreground sm:size-5" />
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold tracking-wider text-primary">
                {item.step}
              </p>
              <h3 className="mt-1 text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
