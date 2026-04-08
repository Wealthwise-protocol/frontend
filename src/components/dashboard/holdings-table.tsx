import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePortfolio } from "@/hooks/use-portfolio"
import { useMinDelay } from "@/hooks/use-min-delay"
import { formatCurrency } from "@/lib/formatters"
import { IconPlus } from "@tabler/icons-react"

export function HoldingsTable() {
  const { data, isLoading: rawLoading, isError } = usePortfolio()
  const isLoading = useMinDelay(rawLoading)
  const holdings = data?.holdings ?? []

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["FUND NAME", "CATEGORY", "UNITS", "AVG NAV", "CUR NAV", "INVESTED", "CUR VALUE", "GAIN/LOSS"].map((h) => (
                    <TableHead key={h} className="text-[0.65rem] font-medium tracking-wider">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
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
            <caption className="sr-only">Portfolio holdings showing fund name, category, units, NAV, invested amount, current value, and gain or loss</caption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[0.65rem] font-medium tracking-wider">
                  FUND NAME
                </TableHead>
                <TableHead className="hidden text-[0.65rem] font-medium tracking-wider md:table-cell">
                  CATEGORY
                </TableHead>
                <TableHead className="hidden text-right text-[0.65rem] font-medium tracking-wider md:table-cell">
                  UNITS
                </TableHead>
                <TableHead className="hidden text-right text-[0.65rem] font-medium tracking-wider md:table-cell">
                  AVG NAV
                </TableHead>
                <TableHead className="hidden text-right text-[0.65rem] font-medium tracking-wider lg:table-cell">
                  CUR NAV
                </TableHead>
                <TableHead className="hidden text-right text-[0.65rem] font-medium tracking-wider sm:table-cell">
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
                  <th scope="row" className="p-2 align-middle whitespace-nowrap text-xs font-medium">
                    {h.name}
                  </th>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {h.category}
                  </TableCell>
                  <TableCell className="hidden text-right text-xs md:table-cell">
                    {(h.units ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden text-right text-xs md:table-cell">
                    {(h.avgNav ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden text-right text-xs lg:table-cell">
                    {(h.curNav ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden text-right text-xs sm:table-cell">
                    {formatCurrency(h.invested)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {formatCurrency(h.curValue)}
                  </TableCell>
                  <TableCell
                    className={`text-right text-xs font-medium num ${h.gain >= 0 ? "num-positive" : "num-negative"}`}
                  >
                    {h.gain >= 0 ? "↑ +" : "↓ "}
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
