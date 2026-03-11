import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePortfolioStore } from "@/stores/portfolio-store"

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

export function HoldingsTable() {
  const holdings = usePortfolioStore((s) => s.holdings)

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
                    {h.units.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {h.avgNav.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {h.curNav.toFixed(2)}
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
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
