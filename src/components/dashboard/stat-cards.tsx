import { Card, CardContent } from "@/components/ui/card"
import { StaggerContainer, StaggerItem, CountUp } from "@/components/ui/animated"

const stats = [
  {
    label: "TOTAL INVESTED",
    numValue: 1245000,
    prefix: "₹",
  },
  {
    label: "CURRENT VALUE",
    numValue: 1582350,
    prefix: "₹",
    valueClass: "text-emerald-500",
  },
  {
    label: "TOTAL RETURNS",
    numValue: 337350,
    prefix: "+₹",
    valueClass: "text-emerald-500",
    sub: "27.09%",
  },
  {
    label: "XIRR",
    numValue: 18.4,
    suffix: "%",
  },
]

export function StatCards() {
  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={`mt-2 text-2xl font-bold tracking-tight ${stat.valueClass ?? ""}`}
              >
                <CountUp
                  value={stat.numValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  formatFn={stat.numValue >= 100 ? (v) => Math.round(v).toLocaleString("en-IN") : undefined}
                />
              </p>
              <p className={`mt-1 text-xs ${stat.sub ? "text-emerald-500" : "invisible"}`}>
                {stat.sub ? `~ ${stat.sub}` : "\u00A0"}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
