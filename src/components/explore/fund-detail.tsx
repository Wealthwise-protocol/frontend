import { useState } from "react"
import type { Fund } from "@/data/funds"
import { useSipStore } from "@/stores/sip-store"
import { useTransactionStore } from "@/stores/transaction-store"
import { usePortfolioStore } from "@/stores/portfolio-store"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

const navChartConfig = {
  nav: { label: "NAV", color: "var(--color-primary)" },
} satisfies ChartConfig

function generateNavHistory() {
  const data = []
  let value = 60
  for (let i = 0; i < 12; i++) {
    const months = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ]
    value += Math.random() * 3 - 0.5
    data.push({ month: months[i], nav: Math.round(value * 100) / 100 })
  }
  return data
}

const navHistory = generateNavHistory()

const riskColors: Record<string, string> = {
  LOW: "border-emerald-500/30 text-emerald-500",
  MODERATE: "border-yellow-500/30 text-yellow-500",
  HIGH: "border-orange-500/30 text-orange-500",
  "VERY HIGH": "border-red-500/30 text-red-500",
}

export function FundDetail({
  fund,
  open,
  onClose,
}: {
  fund: Fund | null
  open: boolean
  onClose: () => void
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const createSip = useSipStore((s) => s.createSip)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const addHolding = usePortfolioStore((s) => s.addHolding)
  const [investTab, setInvestTab] = useState("sip")
  const [amount, setAmount] = useState("")
  const [activePeriod, setActivePeriod] = useState("1Y")
  const [step, setStep] = useState<"details" | "confirm" | "success">(
    "details"
  )

  const handleClose = () => {
    setStep("details")
    setAmount("")
    onClose()
  }

  const handleInvest = () => {
    if (!amount || Number(amount) <= 0) return
    setStep("confirm")
  }

  const handleConfirm = () => {
    if (!fund) return

    const numAmount = Number(amount)
    const units = numAmount / fund.nav
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })

    if (investTab === "sip") {
      createSip(fund.name, numAmount)
    }

    addTransaction({
      date: dateStr,
      fundName: fund.name,
      type: investTab === "sip" ? "SIP" : "Lumpsum",
      amount: numAmount,
      units,
      nav: fund.nav,
      status: "Success",
    })

    addHolding({
      name: fund.name,
      category: fund.category,
      units,
      avgNav: fund.nav,
      curNav: fund.nav,
      invested: numAmount,
      curValue: numAmount,
      gain: 0,
    })

    toast.success(investTab === "sip" ? "SIP created successfully!" : "Investment successful!")
    setStep("success")
  }

  if (!fund) return null

  const periods = ["1M", "3M", "6M", "1Y", "ALL"]
  const minAmount = investTab === "sip" ? fund.minSip : fund.minLumpsum

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={cn(
          "overflow-y-auto",
          isDesktop ? "w-full max-w-lg" : "h-[92vh] rounded-t-xl"
        )}
      >
        <SheetHeader>
          <SheetTitle className="text-lg">{fund.name}</SheetTitle>
          <SheetDescription>{fund.amc}</SheetDescription>
        </SheetHeader>

        {step === "details" && (
          <div className="flex flex-col gap-6 px-6 pb-6">
            {/* Fund info badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[0.6rem]">
                {fund.category} - {fund.subcategory}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-[0.6rem]", riskColors[fund.risk])}
              >
                {fund.risk} RISK
              </Badge>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {fund.description}
            </p>

            {/* Fund details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border p-3">
                <p className="text-[0.6rem] text-muted-foreground">AUM</p>
                <p className="mt-0.5 text-xs font-semibold">{fund.aum}</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[0.6rem] text-muted-foreground">
                  Expense Ratio
                </p>
                <p className="mt-0.5 text-xs font-semibold">
                  {fund.expenseRatio}%
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[0.6rem] text-muted-foreground">Min SIP</p>
                <p className="mt-0.5 text-xs font-semibold">
                  ₹{fund.minSip.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-[0.6rem] text-muted-foreground">
                  Min Lumpsum
                </p>
                <p className="mt-0.5 text-xs font-semibold">
                  ₹{fund.minLumpsum.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <Separator />

            {/* NAV History */}
            <div>
              <h4 className="text-sm font-semibold">NAV History</h4>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold">₹{fund.nav}</span>
                <span className="text-xs font-medium text-emerald-500">
                  +₹{fund.navChange} (+{fund.navChangePercent}%)
                </span>
              </div>

              <ChartContainer
                config={navChartConfig}
                className="mt-4 h-40 w-full"
              >
                <AreaChart data={navHistory}>
                  <defs>
                    <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-nav)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-nav)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="nav"
                    type="monotone"
                    stroke="var(--color-nav)"
                    fill="url(#navGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>

              <div className="mt-3 flex items-center gap-1">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePeriod(p)}
                    className={cn(
                      "rounded-sm px-2.5 py-1 text-[0.65rem] font-medium transition-colors",
                      activePeriod === p
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Returns comparison table */}
            <div>
              <div className="grid grid-cols-3 gap-4 text-[0.65rem] font-medium text-muted-foreground">
                <span>Period</span>
                <span className="text-right">Fund Return</span>
                <span className="text-right">Category Avg</span>
              </div>
              {(["1Y", "3Y", "5Y"] as const).map((period) => (
                <div
                  key={period}
                  className="mt-3 grid grid-cols-3 gap-4 text-xs"
                >
                  <span>
                    {period === "1Y"
                      ? "1 Year"
                      : period === "3Y"
                        ? "3 Years"
                        : "5 Years"}
                  </span>
                  <span className="text-right font-medium text-emerald-500">
                    {fund.returns[period]}%
                  </span>
                  <span className="text-right text-muted-foreground">
                    {fund.categoryAvg[period]}%
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Investment section */}
            <div>
              <Tabs
                value={investTab}
                onValueChange={setInvestTab}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="sip" className="flex-1">
                    Monthly SIP
                  </TabsTrigger>
                  <TabsTrigger value="lumpsum" className="flex-1">
                    Lumpsum
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sip" className="mt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="sip-amount" className="text-xs">
                        Investment Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          id="sip-amount"
                          type="number"
                          placeholder={`Min ₹${fund.minSip.toLocaleString("en-IN")}`}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                      <p className="text-[0.6rem] text-muted-foreground">
                        SIP date: 1st of every month
                      </p>
                    </div>

                    {amount && Number(amount) > 0 && (
                      <Card>
                        <CardContent className="grid grid-cols-2 gap-3 p-3">
                          <div>
                            <p className="text-[0.6rem] text-muted-foreground">
                              Monthly SIP
                            </p>
                            <p className="text-xs font-semibold">
                              ₹{Number(amount).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.6rem] text-muted-foreground">
                              Est. 1Y Value
                            </p>
                            <p className="text-xs font-semibold text-emerald-500">
                              ₹
                              {Math.round(
                                Number(amount) *
                                  12 *
                                  (1 + fund.returns["1Y"] / 100 / 2)
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="lumpsum" className="mt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="lumpsum-amount" className="text-xs">
                        Investment Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          id="lumpsum-amount"
                          type="number"
                          placeholder={`Min ₹${fund.minLumpsum.toLocaleString("en-IN")}`}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                    </div>

                    {amount && Number(amount) > 0 && (
                      <Card>
                        <CardContent className="grid grid-cols-2 gap-3 p-3">
                          <div>
                            <p className="text-[0.6rem] text-muted-foreground">
                              Investment
                            </p>
                            <p className="text-xs font-semibold">
                              ₹{Number(amount).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.6rem] text-muted-foreground">
                              Est. 1Y Value
                            </p>
                            <p className="text-xs font-semibold text-emerald-500">
                              ₹
                              {Math.round(
                                Number(amount) * (1 + fund.returns["1Y"] / 100)
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                className="mt-4 w-full"
                size="lg"
                disabled={!amount || Number(amount) < minAmount}
                onClick={handleInvest}
              >
                {!amount || Number(amount) < minAmount
                  ? `Min ₹${minAmount.toLocaleString("en-IN")} required`
                  : investTab === "sip"
                    ? "Start SIP"
                    : "Invest Now"}
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="flex flex-col gap-6 px-6 pb-6">
            <h4 className="text-sm font-semibold">Confirm Investment</h4>

            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Fund</span>
                  <span className="text-xs font-semibold">{fund.name}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <span className="text-xs font-semibold">
                    {investTab === "sip" ? "Monthly SIP" : "Lumpsum"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-xs font-semibold">
                    ₹{Number(amount).toLocaleString("en-IN")}
                    {investTab === "sip" ? "/month" : ""}
                  </span>
                </div>
                {investTab === "sip" && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        SIP Date
                      </span>
                      <span className="text-xs font-semibold">
                        1st of every month
                      </span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    NAV (approx.)
                  </span>
                  <span className="text-xs font-semibold">₹{fund.nav}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Est. Units
                  </span>
                  <span className="text-xs font-semibold">
                    {(Number(amount) / fund.nav).toFixed(4)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
              By proceeding, you agree to the terms and conditions of {fund.amc}.
              Mutual fund investments are subject to market risks. Please read
              all scheme-related documents carefully before investing.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("details")}
              >
                Back
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Confirm{" "}
                {investTab === "sip" ? "SIP" : "Investment"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-6 px-6 pb-6 pt-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                {investTab === "sip" ? "SIP Created!" : "Investment Successful!"}
              </h4>
              <p className="mt-2 text-xs text-muted-foreground">
                {investTab === "sip"
                  ? `Your monthly SIP of ₹${Number(amount).toLocaleString("en-IN")} in ${fund.name} has been set up successfully.`
                  : `₹${Number(amount).toLocaleString("en-IN")} has been invested in ${fund.name}.`}
              </p>
            </div>

            <Card className="w-full">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Fund</span>
                  <span className="text-xs font-semibold">{fund.name}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-xs font-semibold text-emerald-500">
                    ₹{Number(amount).toLocaleString("en-IN")}
                    {investTab === "sip" ? "/month" : ""}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Est. Units
                  </span>
                  <span className="text-xs font-semibold">
                    {(Number(amount) / fund.nav).toFixed(4)}
                  </span>
                </div>
                {investTab === "sip" && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Next SIP Date
                      </span>
                      <span className="text-xs font-semibold">1st Apr 2026</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Back to Explore
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setStep("details")
                  setAmount("")
                }}
              >
                Invest More
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
