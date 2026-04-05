import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "@/services/funds"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconChevronDown, IconChevronUp, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  CountUp,
} from "@/components/ui/animated"
import type { Transaction, TransactionType, TransactionStatus } from "@/types"

const typeFilters: ("All" | TransactionType)[] = ["All", "SIP", "Lumpsum", "Redeem"]

const statusBadge: Record<TransactionStatus, string> = {
  Success: "border-emerald-500/30 text-emerald-500",
  Processing: "border-yellow-500/30 text-yellow-500",
  Failed: "border-red-500/30 text-red-500",
}

const typeBadge: Record<TransactionType, string> = {
  SIP: "border-blue-500/30 text-blue-500",
  Lumpsum: "border-violet-500/30 text-violet-500",
  Redeem: "border-orange-500/30 text-orange-500",
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

export function TransactionsPage() {
  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  })
  const [activeType, setActiveType] = useState<"All" | TransactionType>("All")
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    let list = transactions
    if (activeType !== "All") {
      list = list.filter((t) => t.type === activeType)
    }
    if (sortAsc) {
      list = [...list].reverse()
    }
    return list
  }, [transactions, activeType, sortAsc])

  const totalInvested = transactions
    .filter((t) => t.type !== "Redeem" && t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalRedeemed = transactions
    .filter((t) => t.type === "Redeem" && t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalTransactions = transactions.length

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      </FadeIn>

      {isLoading && (
        <div className="mt-12 flex flex-col items-center gap-2">
          <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      )}

      {isError && (
        <div className="mt-12 text-center">
          <p className="text-sm text-destructive">Failed to load transactions. Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && (
      <>
      {/* Stat cards */}
      <StaggerContainer className="mt-6 grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                TOTAL INVESTED
              </p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp
                  value={totalInvested}
                  prefix="₹"
                  formatFn={(v) => Math.round(v).toLocaleString("en-IN")}
                />
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                TOTAL REDEEMED
              </p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp
                  value={totalRedeemed}
                  prefix="₹"
                  formatFn={(v) => Math.round(v).toLocaleString("en-IN")}
                />
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                TOTAL ORDERS
              </p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp value={totalTransactions} />
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Filters */}
      <FadeIn delay={0.15} className="mt-6 flex flex-wrap items-center gap-2">
        {typeFilters.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeType === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}

        <button
          onClick={() => setSortAsc((v) => !v)}
          className="ml-auto flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Date
          {sortAsc ? (
            <IconChevronUp className="size-3" />
          ) : (
            <IconChevronDown className="size-3" />
          )}
        </button>
      </FadeIn>

      {/* Results count */}
      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Transactions table */}
      <FadeIn delay={0.25} className="mt-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="hidden md:table-header-group">
                  <TableRow>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      DATE
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      FUND NAME
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      TYPE
                    </TableHead>
                    <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                      AMOUNT
                    </TableHead>
                    <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                      NAV
                    </TableHead>
                    <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                      UNITS
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                          No transactions found.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
      </>
      )}
    </>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <>
      {/* Desktop row */}
      <TableRow className="hidden md:table-row">
        <TableCell className="text-xs">{formatDate(tx.date)}</TableCell>
        <TableCell className="text-xs font-medium">{tx.fundName}</TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn("text-[0.6rem]", typeBadge[tx.type])}
          >
            {tx.type}
          </Badge>
        </TableCell>
        <TableCell className="text-right text-xs">
          <span className={tx.type === "Redeem" ? "text-orange-500" : ""}>
            {tx.type === "Redeem" ? "-" : "+"}
            {formatCurrency(tx.amount)}
          </span>
        </TableCell>
        <TableCell className="text-right text-xs">₹{(tx.nav ?? 0).toFixed(2)}</TableCell>
        <TableCell className="text-right text-xs">{(tx.units ?? 0).toFixed(3)}</TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn("text-[0.6rem]", statusBadge[tx.status])}
          >
            {tx.status}
          </Badge>
        </TableCell>
      </TableRow>

      {/* Mobile card */}
      <tr className="md:hidden">
        <td colSpan={7}>
          <div className="border-b border-border p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{tx.fundName}</p>
                <p className="mt-1 text-[0.6rem] text-muted-foreground">
                  {formatDate(tx.date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-[0.6rem]", typeBadge[tx.type])}
                >
                  {tx.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-[0.6rem]", statusBadge[tx.status])}
                >
                  {tx.status}
                </Badge>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[0.6rem]">
              <div>
                <span className="text-muted-foreground">Amount</span>
                <p className={cn("text-xs font-medium", tx.type === "Redeem" ? "text-orange-500" : "")}>
                  {tx.type === "Redeem" ? "-" : "+"}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground">NAV</span>
                <p className="text-xs font-medium">₹{(tx.nav ?? 0).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground">Units</span>
                <p className="text-xs font-medium">{(tx.units ?? 0).toFixed(3)}</p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}
