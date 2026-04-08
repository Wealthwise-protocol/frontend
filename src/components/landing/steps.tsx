import { IconUserPlus, IconStack2, IconChartLine } from "@tabler/icons-react"
import {
  ScrollFadeIn,
  ScrollStaggerContainer,
  ScrollStaggerItem,
} from "@/components/ui/animated"

const steps = [
  {
    step: "01",
    title: "Create an account",
    description: "Sign up in seconds. No paperwork, no friction.",
    icon: IconUserPlus,
  },
  {
    step: "02",
    title: "Pick your funds",
    description:
      "Browse by category, compare returns, and invest via lumpsum or SIP.",
    icon: IconStack2,
  },
  {
    step: "03",
    title: "Watch it grow",
    description:
      "Track your portfolio, get AI insights, and adjust your strategy over time.",
    icon: IconChartLine,
  },
]

export function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
      <ScrollFadeIn>
        <p className="section-label">How it works</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Three steps. <span className="gradient-text">That's it.</span>
        </h2>
      </ScrollFadeIn>

      <ScrollStaggerContainer
        className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8 md:mt-10"
        stagger={0.12}
      >
        {steps.map((item, i) => (
          <ScrollStaggerItem key={item.step}>
            <div className="relative flex flex-col gap-4">
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-[calc(2.5rem+1px)] hidden h-px w-[calc(100%-2.5rem)] bg-border sm:block lg:left-[calc(3rem+1px)] lg:w-[calc(100%-3rem)]" />
              )}
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card card-shadow lg:size-12">
                <item.icon className="size-4 text-primary lg:size-5" />
              </div>
              <div>
                <p className="text-[0.6rem] font-bold tracking-widest text-primary">
                  STEP {item.step}
                </p>
                <h3 className="mt-1 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </ScrollStaggerItem>
        ))}
      </ScrollStaggerContainer>
    </section>
  )
}
