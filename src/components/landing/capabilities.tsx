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
    <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
        Platform <span className="gradient-text">Capabilities</span>
      </h2>
      <div className="mt-2 h-px w-full bg-border" />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 md:mt-10">
        {capabilities.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-white/[0.15] sm:p-6"
          >
            <item.icon className="size-6 text-primary sm:size-8" />
            <h3 className="mt-3 text-xs font-semibold sm:mt-5 sm:text-sm">{item.title}</h3>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-xs">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
