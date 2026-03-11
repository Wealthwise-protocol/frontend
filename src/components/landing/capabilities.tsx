import {
  IconLayoutDashboard,
  IconSettingsAutomation,
  IconSearch,
  IconBolt,
} from "@tabler/icons-react"

const capabilities = [
  {
    title: "Portfolio Dashboard",
    description:
      "A dense, consolidated view of your asset allocation, XIRR, and real-time gain/loss metrics across all holdings.",
    icon: IconLayoutDashboard,
  },
  {
    title: "SIP Management",
    description:
      "Automate your investments. Pause, resume, or step-up systematic investment plans with a single click.",
    icon: IconSettingsAutomation,
  },
  {
    title: "Fund Explorer",
    description:
      "Deep-dive into AMC data. Screen funds by equity/debt split, expense ratios, and historical volatility.",
    icon: IconSearch,
  },
  {
    title: "Real-time NAV",
    description:
      "End-of-day NAV updates delivered instantaneously. Your portfolio valuation is never out of sync.",
    icon: IconBolt,
  },
]

export function Capabilities() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
        Platform Capabilities
      </h2>
      <div className="mt-2 h-px w-full bg-border" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {capabilities.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border bg-card p-6"
          >
            <item.icon className="size-8 text-primary" />
            <h3 className="mt-5 text-sm font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
