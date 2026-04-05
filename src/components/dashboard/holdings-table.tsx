import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePortfolio } from "@/hooks/use-portfolio"
import { IconLoader2, IconPlus } from "@tabler/icons-react"

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

export function HoldingsTable() {
  const { data, isLoading, isError } = usePortfolio()
  const holdings = data?.holdings ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-destructive">Failed to load holdings.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[0.65rem] font-medium tracking-wider">
                  FUND NAME
                </TableHead>
                <TableHead className="text-[0.65rem] font-medium tracking-wider">
                  CATEGORY
                </TableHead>
                <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                  UNITS
                </TableHead>
                <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                  AVG NAV
                </TableHead>
                <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                  CUR NAV
                </TableHead>
                <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                  INVESTED
                </TableHead>
                <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                  CUR VALUE
                </TableHead>
                <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                  GAIN/LOSS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs font-medium">
                    {h.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {h.category}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {(h.units ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {(h.avgNav ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {(h.curNav ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {formatCurrency(h.invested)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {formatCurrency(h.curValue)}
                  </TableCell>
                  <TableCell
                    className={`text-right text-xs font-medium ${h.gain >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {h.gain >= 0 ? "+" : ""}
                    {formatCurrency(h.gain)}
                  </TableCell>
                </TableRow>
              ))}
              {holdings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No holdings yet. Start investing to build your portfolio.
                    </p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to="/dashboard/explore">
                        <IconPlus className="mr-1 size-3.5" />
                        Explore Funds
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
