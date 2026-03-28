import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchSips } from "@/services/funds"
import type { SIP } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPencil,
  IconX,
  IconPlus,
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  Collapsible,
  CountUp,
} from "@/components/ui/animated"


function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

function SIPRow({
  sip,
  onTogglePause,
  onEdit,
  onCancel,
}: {
  sip: SIP
  onTogglePause: (id: string) => void
  onEdit: (sip: SIP) => void
  onCancel: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isPaused = sip.status === "PAUSED"

  return (
    <>
      {/* Desktop row */}
      <TableRow
        className="hidden cursor-pointer md:table-row"
        onClick={() => setExpanded((e) => !e)}
      >
        <TableCell className="text-xs font-medium">{sip.fundName}</TableCell>
        <TableCell className="text-right text-xs">
          {formatCurrency(sip.monthlyAmt)}
        </TableCell>
        <TableCell className="text-xs">{sip.startDate}</TableCell>
        <TableCell className="text-xs">{sip.nextDebit}</TableCell>
        <TableCell className="text-right text-xs">
          {formatCurrency(sip.totalInvested)}
        </TableCell>
        <TableCell className="text-right text-xs font-medium text-emerald-500">
          {formatCurrency(sip.currentValue)}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "text-[0.6rem]",
              sip.status === "ACTIVE"
                ? "border-emerald-500/30 text-emerald-500"
                : "border-orange-500/30 text-orange-500"
            )}
          >
            {sip.status}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={isPaused ? "Resume SIP" : "Pause SIP"}
                  onClick={() => onTogglePause(sip.id)}
                >
                  {isPaused ? (
                    <IconPlayerPlay className="size-3" />
                  ) : (
                    <IconPlayerPause className="size-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPaused ? "Resume SIP" : "Pause SIP"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Edit SIP"
                  onClick={() => onEdit(sip)}
                >
                  <IconPencil className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit SIP</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Cancel SIP"
                  onClick={() => onCancel(sip.id)}
                >
                  <IconX className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel SIP</TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>

      {/* Mobile card */}
      <tr className="md:hidden">
        <td colSpan={8}>
          <div
            className="border-b border-border p-4"
            onClick={() => setExpanded((e) => !e)}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{sip.fundName}</p>
                <p className="mt-1 text-[0.6rem] text-muted-foreground">
                  {formatCurrency(sip.monthlyAmt)}/month
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[0.6rem]",
                    sip.status === "ACTIVE"
                      ? "border-emerald-500/30 text-emerald-500"
                      : "border-orange-500/30 text-orange-500"
                  )}
                >
                  {sip.status}
                </Badge>
                {expanded ? (
                  <IconChevronUp className="size-3.5 text-muted-foreground" />
                ) : (
                  <IconChevronDown className="size-3.5 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-y-2 text-[0.6rem]">
              <div>
                <span className="text-muted-foreground">Invested</span>
                <p className="text-xs font-medium">
                  {formatCurrency(sip.totalInvested)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground">Current</span>
                <p className="text-xs font-medium text-emerald-500">
                  {formatCurrency(sip.currentValue)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Started</span>
                <p className="text-xs">{sip.startDate}</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground">Next Debit</span>
                <p className="text-xs">{sip.nextDebit}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="xs" onClick={() => onTogglePause(sip.id)}>
                {isPaused ? (
                  <IconPlayerPlay className="mr-1 size-3" />
                ) : (
                  <IconPlayerPause className="mr-1 size-3" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button variant="outline" size="xs" onClick={() => onEdit(sip)}>
                <IconPencil className="mr-1 size-3" />
                Edit
              </Button>
              <Button variant="outline" size="xs" onClick={() => onCancel(sip.id)}>
                <IconX className="mr-1 size-3" />
                Cancel
              </Button>
            </div>
          </div>
        </td>
      </tr>

      {/* Expanded installments */}
      <tr>
        <td colSpan={8}>
          <Collapsible open={expanded}>
            <div className="border-b border-border bg-muted/30 px-4 py-4 md:px-8">
              <div className="flex items-center gap-2">
                <div className="h-full w-0.5 self-stretch rounded bg-primary" />
                <h4 className="text-[0.65rem] font-semibold tracking-wider text-muted-foreground">
                  RECENT INSTALLMENTS
                </h4>
              </div>

              {/* Desktop installments table */}
              <div className="mt-3 hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="text-[0.6rem] font-medium tracking-wider text-muted-foreground">
                      <th className="pb-2 text-left">DATE</th>
                      <th className="pb-2 text-right">AMOUNT</th>
                      <th className="pb-2 text-right">NAV</th>
                      <th className="pb-2 text-right">UNITS ALLOTTED</th>
                      <th className="pb-2 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sip.installments.map((inst) => (
                      <tr key={inst.date}>
                        <td className="py-2 text-xs">{inst.date}</td>
                        <td className="py-2 text-right text-xs">
                          {formatCurrency(inst.amount)}
                        </td>
                        <td className="py-2 text-right text-xs">
                          ₹{(inst.nav ?? 0).toFixed(2)}
                        </td>
                        <td className="py-2 text-right text-xs">
                          {(inst.units ?? 0).toFixed(3)}
                        </td>
                        <td className="py-2 text-right text-xs font-medium text-emerald-500">
                          {inst.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile installments */}
              <div className="mt-3 flex flex-col gap-3 md:hidden">
                {sip.installments.map((inst) => (
                  <div
                    key={inst.date}
                    className="rounded-md border border-border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{inst.date}</span>
                      <span className="text-xs font-medium text-emerald-500">
                        {inst.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[0.6rem]">
                      <div>
                        <span className="text-muted-foreground">Amount</span>
                        <p className="text-xs">{formatCurrency(inst.amount)}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-muted-foreground">NAV</span>
                        <p className="text-xs">₹{(inst.nav ?? 0).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Units</span>
                        <p className="text-xs">{(inst.units ?? 0).toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Collapsible>
        </td>
      </tr>
    </>
  )
}

export function SipPage() {
  const queryClient = useQueryClient()
  const { data: rawSips = [], isLoading, isError } = useQuery({
    queryKey: ["sips"],
    queryFn: fetchSips,
  })

  const sipList = useMemo(
    () => [...rawSips].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [rawSips],
  )

  // Pause/Resume dialog
  const [pauseTarget, setPauseTarget] = useState<SIP | null>(null)

  // Edit dialog
  const [editTarget, setEditTarget] = useState<SIP | null>(null)
  const [editAmount, setEditAmount] = useState("")
  const [editSaved, setEditSaved] = useState(false)

  // Cancel dialog
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)

  const cancelTarget = cancelTargetId ? sipList.find((s) => s.id === cancelTargetId) : null

  // Derived stats
  const activeSips = sipList.filter((s) => s.status === "ACTIVE")
  const totalActive = activeSips.length
  const totalMonthly = activeSips.reduce((sum, s) => sum + s.monthlyAmt, 0)
  const totalInvested = sipList.reduce((sum, s) => sum + s.totalInvested, 0)

  function handleTogglePause(id: string) {
    const sip = sipList.find((s) => s.id === id)
    if (sip) setPauseTarget(sip)
  }

  function confirmTogglePause() {
    if (!pauseTarget) return
    // Optimistic update on local cache
    queryClient.setQueryData<SIP[]>(["sips"], (old = []) =>
      old.map((s) => {
        if (s.id !== pauseTarget.id) return s
        const newStatus = s.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
        return { ...s, status: newStatus as "ACTIVE" | "PAUSED" }
      }),
    )
    toast.success(pauseTarget.status === "ACTIVE" ? "SIP paused" : "SIP resumed")
    setPauseTarget(null)
  }

  function handleEdit(sip: SIP) {
    setEditTarget(sip)
    setEditAmount(sip.monthlyAmt.toString())
    setEditSaved(false)
  }

  function confirmEdit() {
    if (!editTarget) return
    const newAmt = parseInt(editAmount, 10)
    if (isNaN(newAmt) || newAmt < 100) return
    // Optimistic update on local cache
    queryClient.setQueryData<SIP[]>(["sips"], (old = []) =>
      old.map((s) => (s.id === editTarget.id ? { ...s, monthlyAmt: newAmt } : s)),
    )
    toast.success("SIP amount updated")
    setEditSaved(true)
    setTimeout(() => {
      setEditTarget(null)
      setEditSaved(false)
    }, 1200)
  }

  function handleCancel(id: string) {
    setCancelTargetId(id)
  }

  function confirmCancel() {
    if (!cancelTargetId) return
    // Optimistic update on local cache
    queryClient.setQueryData<SIP[]>(["sips"], (old = []) =>
      old.filter((s) => s.id !== cancelTargetId),
    )
    toast.success("SIP cancelled")
    setCancelTargetId(null)
  }

  return (
    <>
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">SIP Management</h1>
          <Button size="sm" asChild>
            <Link to="/dashboard/explore">
              <IconPlus className="mr-1 size-3.5" />
              Start New SIP
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Loading state */}
      {isLoading && (
        <div className="mt-12 flex flex-col items-center gap-2">
          <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading SIPs...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="mt-12 text-center">
          <p className="text-sm text-destructive">Failed to load SIPs. Please try again later.</p>
        </div>
      )}

      {/* Stat cards */}
      {!isLoading && !isError && (
      <>
      <StaggerContainer className="mt-6 grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                TOTAL ACTIVE SIPS
              </p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp value={totalActive} />
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-medium tracking-wider text-muted-foreground">
                TOTAL MONTHLY DEBIT
              </p>
              <p className="mt-2 text-2xl font-bold">
                <CountUp
                  value={totalMonthly}
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
                TOTAL SIP INVESTED
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
      </StaggerContainer>

      {/* SIP table */}
      <FadeIn delay={0.3} className="mt-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="hidden md:table-header-group">
                  <TableRow>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      FUND NAME
                    </TableHead>
                    <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                      MONTHLY AMT
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      START DATE
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      NEXT DEBIT
                    </TableHead>
                    <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                      TOTAL INVESTED
                    </TableHead>
                    <TableHead className="text-right text-[0.65rem] font-medium tracking-wider">
                      CURRENT VALUE
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      STATUS
                    </TableHead>
                    <TableHead className="text-[0.65rem] font-medium tracking-wider">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sipList.map((sip) => (
                    <SIPRow
                      key={sip.id}
                      sip={sip}
                      onTogglePause={handleTogglePause}
                      onEdit={handleEdit}
                      onCancel={handleCancel}
                    />
                  ))}
                  {sipList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                          No active SIPs. Start a new SIP to begin investing.
                        </p>
                        <Button size="sm" className="mt-4" asChild>
                          <Link to="/dashboard/explore">
                            <IconPlus className="mr-1 size-3.5" />
                            Start New SIP
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
      </FadeIn>
      </>
      )}

      {/* ── Pause / Resume confirmation ── */}
      <AlertDialog open={!!pauseTarget} onOpenChange={() => setPauseTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pauseTarget?.status === "ACTIVE" ? "Pause SIP?" : "Resume SIP?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pauseTarget?.status === "ACTIVE" ? (
                <>
                  Your SIP for <span className="font-medium text-foreground">{pauseTarget.fundName}</span> of{" "}
                  {formatCurrency(pauseTarget.monthlyAmt)}/month will be paused. No further debits will occur until you resume.
                </>
              ) : (
                <>
                  Your SIP for <span className="font-medium text-foreground">{pauseTarget?.fundName}</span> of{" "}
                  {formatCurrency(pauseTarget?.monthlyAmt ?? 0)}/month will be resumed. Debits will restart from the next scheduled date.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTogglePause}>
              {pauseTarget?.status === "ACTIVE" ? "Pause SIP" : "Resume SIP"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Edit SIP dialog ── */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) { setEditTarget(null); setEditSaved(false) } }}>
        <DialogContent className="sm:max-w-md">
          {!editSaved ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit SIP</DialogTitle>
                <DialogDescription>
                  Update the monthly investment amount for{" "}
                  <span className="font-medium text-foreground">{editTarget?.fundName}</span>.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sip-fund" className="text-xs">Fund Name</Label>
                  <Input id="sip-fund" value={editTarget?.fundName ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sip-amount" className="text-xs">Monthly Amount (₹)</Label>
                  <Input
                    id="sip-amount"
                    type="number"
                    min={100}
                    step={100}
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  {editAmount && parseInt(editAmount, 10) < 100 && (
                    <p className="text-xs text-destructive">Minimum SIP amount is ₹100</p>
                  )}
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Current Amount</span>
                    <span>{formatCurrency(editTarget?.monthlyAmt ?? 0)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">New Amount</span>
                    <span className="font-medium">
                      {editAmount && parseInt(editAmount, 10) >= 100
                        ? formatCurrency(parseInt(editAmount, 10))
                        : "--"}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setEditTarget(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmEdit}
                  disabled={!editAmount || parseInt(editAmount, 10) < 100 || parseInt(editAmount, 10) === editTarget?.monthlyAmt}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                <IconCheck className="size-7 text-emerald-500" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">SIP Updated</h3>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Monthly amount changed to {formatCurrency(parseInt(editAmount, 10))} for{" "}
                {editTarget?.fundName}.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Cancel SIP confirmation ── */}
      <AlertDialog open={!!cancelTargetId} onOpenChange={() => setCancelTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel SIP?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently cancel your SIP for{" "}
              <span className="font-medium text-foreground">{cancelTarget?.fundName}</span>.
              Your existing investments will remain intact, but no further installments will be
              debited. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Monthly Amount</span>
                <p className="font-medium">{formatCurrency(cancelTarget?.monthlyAmt ?? 0)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Invested</span>
                <p className="font-medium">{formatCurrency(cancelTarget?.totalInvested ?? 0)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Value</span>
                <p className="font-medium text-emerald-500">
                  {formatCurrency(cancelTarget?.currentValue ?? 0)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">SIP Since</span>
                <p className="font-medium">{cancelTarget?.startDate}</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep SIP</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel SIP
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
