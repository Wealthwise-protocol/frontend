import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const holdings = [
  {
    name: "Parag Parikh Flexi Cap Fund",
    category: "Equity",
    units: 245.32,
    avgNav: 52.1,
    curNav: 68.45,
    invested: 278000,
    curValue: 365200,
    gain: 87200,
  },
  {
    name: "Nippon India Small Cap Fund",
    category: "Equity",
    units: 1120.5,
    avgNav: 42.8,
    curNav: 58.92,
    invested: 320000,
    curValue: 440800,
    gain: 120800,
  },
  {
    name: "HDFC Balanced Advantage Fund",
    category: "Hybrid",
    units: 890.15,
    avgNav: 185.5,
    curNav: 210.3,
    invested: 425000,
    curValue: 482350,
    gain: 57350,
  },
  {
    name: "ICICI Pru Corporate Bond Fund",
    category: "Debt",
    units: 1450.0,
    avgNav: 24.3,
    curNav: 26.1,
    invested: 220000,
    curValue: 245000,
    gain: 25000,
  },
  {
    name: "Axis Bluechip Fund",
    category: "Equity",
    units: 320.8,
    avgNav: 38.5,
    curNav: 46.2,
    invested: 202000,
    curValue: 249000,
    gain: 47000,
  },
]

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

export function HoldingsTable() {
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
                <TableRow key={h.name}>
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
