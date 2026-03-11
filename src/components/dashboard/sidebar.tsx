import type React from "react"
import { createContext, useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  IconChartBar,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutDashboard,
  IconSearch,
  IconSettingsAutomation,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const navItems = [
  { label: "Dashboard", icon: IconLayoutDashboard, href: "/dashboard" },
  { label: "Fund Explorer", icon: IconSearch, href: "/dashboard/explore" },
  {
    label: "SIP Management",
    icon: IconSettingsAutomation,
    href: "/dashboard/sip",
  },
  { label: "Transactions", icon: IconReceipt, href: "/dashboard/transactions" },
  { label: "Profile", icon: IconUser, href: "/dashboard/profile" },
]

type SidebarContextValue = { collapsed: boolean }
const SidebarContext = createContext<SidebarContextValue>({ collapsed: false })
export const useSidebarState = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <SidebarInner collapsed={collapsed} setCollapsed={setCollapsed} />
      {children}
    </SidebarContext.Provider>
  )
}

function SidebarInner({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean
  setCollapsed: (fn: (c: boolean) => boolean) => void
}) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-card transition-all duration-200 md:flex",
        collapsed ? "w-14 px-2 py-4" : "w-56 px-3 py-4"
      )}
    >
      <Link
        to="/"
        className={cn(
          "mb-6 flex items-center gap-2",
          collapsed ? "justify-center px-0" : "px-3"
        )}
      >
        <IconChartBar className="size-5 shrink-0 text-primary" />
        {!collapsed && (
          <span className="text-sm font-bold tracking-wide text-primary">
            WealthWise
          </span>
        )}
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const linkContent = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md text-xs font-medium transition-colors",
                collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return linkContent
        })}
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          size="icon"
          className={cn("w-full", !collapsed && "justify-start px-3")}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <IconChevronsRight className="size-4" />
          ) : (
            <>
              <IconChevronsLeft className="size-4" />
              <span className="ml-3 text-xs font-medium text-muted-foreground">
                Collapse
              </span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-card md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center justify-center px-3 py-2 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={item.label}
          >
            <item.icon className="size-5" />
          </Link>
        )
      })}
    </nav>
  )
}
