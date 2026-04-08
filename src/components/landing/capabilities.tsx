import {
  IconLayoutDashboard,
  IconSettingsAutomation,
  IconSearch,
  IconSparkles,
  IconBookmark,
  IconReceipt,
} from "@tabler/icons-react"
import {
  ScrollFadeIn,
  ScrollStaggerContainer,
  ScrollStaggerItem,
} from "@/components/ui/animated"

const features = [
  {
    title: "Portfolio Dashboard",
    description:
      "Real-time holdings, asset allocation breakdown, and portfolio value tracking with period filters.",
    icon: IconLayoutDashboard,
  },
  {
    title: "AI Co-pilot",
    description:
      "Ask X anything about your portfolio. Get personalized fund suggestions, SIP planning, and rebalancing advice powered by AI.",
    icon: IconSparkles,
  },
  {
    title: "Fund Explorer",
    description:
      "Search and filter 5,000+ funds by category. Dive into NAV history, returns, and risk profiles.",
    icon: IconSearch,
  },
  {
    title: "SIP Automation",
    description:
      "Set up monthly SIPs and manage them — pause, resume, edit, or cancel — all in one place.",
    icon: IconSettingsAutomation,
  },
  {
    title: "Bookmarks",
    description:
      "Save funds you're watching. Instant optimistic updates, no page reloads.",
    icon: IconBookmark,
  },
  {
    title: "Transaction History",
    description:
      "Full audit trail of every lumpsum and SIP transaction, filterable by type.",
    icon: IconReceipt,
  },
]

export function Capabilities() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24"
    >
      <ScrollFadeIn>
        <p className="section-label">Features</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Everything you need.{" "}
          <span className="gradient-text">Nothing you don't.</span>
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          A focused toolkit for mutual fund investors who want clarity, not
          clutter.
        </p>
      </ScrollFadeIn>

      <ScrollStaggerContainer
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-10"
        stagger={0.07}
      >
        {features.map((item) => (
          <ScrollStaggerItem key={item.title}>
            <div className="card-shadow card-hover group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors sm:p-5">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <item.icon className="size-4" />
              </div>
              <h3 className="mt-3 text-xs font-semibold sm:text-sm">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[0.65rem] leading-relaxed text-muted-foreground sm:text-xs">
                {item.description}
              </p>
            </div>
          </ScrollStaggerItem>
        ))}
      </ScrollStaggerContainer>
    </section>
  )
}
