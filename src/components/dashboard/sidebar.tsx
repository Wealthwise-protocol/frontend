import type React from "react"
import { useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LayoutGridIcon } from "@/components/ui/layout-grid"
import { SearchIcon } from "@/components/ui/search"
import { SettingsIcon } from "@/components/ui/settings"
import { LayersIcon } from "@/components/ui/layers"
import { BotMessageSquareIcon } from "@/components/ui/bot-message-square"
import { IdCardIcon } from "@/components/ui/id-card"
import { SidebarContext } from "@/components/dashboard/sidebar-context"

const ICON_SIZE = 16

type IconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

const navItemDefs = [
  { label: "Dashboard", icon: LayoutGridIcon, href: "/dashboard" },
  { label: "Fund Explorer", icon: SearchIcon, href: "/dashboard/explore" },
  { label: "SIP Management", icon: SettingsIcon, href: "/dashboard/sip" },
  { label: "Transactions", icon: LayersIcon, href: "/dashboard/transactions" },
  { label: "Ask X", icon: BotMessageSquareIcon, href: "/dashboard/chat" },
  { label: "Profile", icon: IdCardIcon, href: "/dashboard/profile" },
] as const

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <SidebarInner collapsed={collapsed} setCollapsed={setCollapsed} />
      {children}
    </SidebarContext.Provider>
  )
}

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: (typeof navItemDefs)[number]
  isActive: boolean
  collapsed: boolean
}) {
  const iconRef = useRef<IconHandle>(null)
  const Icon = item.icon as React.ForwardRefExoticComponent<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any & React.RefAttributes<IconHandle>
  >

  const linkContent = (
    <Link
      to={item.href}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className={cn(
        "group flex min-h-[44px] items-center text-xs font-medium transition-colors",
        collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
        isActive
          ? "rounded-md border-l-2 border-primary bg-accent text-accent-foreground"
          : "rounded-md text-muted-foreground transition-colors hover:bg-muted",
      )}
    >
      <Icon ref={iconRef} size={ICON_SIZE} className="shrink-0" />
      {!collapsed && item.label}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
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
        collapsed ? "w-14 px-2 py-4" : "w-56 px-3 py-4",
      )}
    >
      <Link
        to="/"
        className={cn(
          "mb-6 flex items-center gap-2",
          collapsed ? "justify-center px-0" : "px-3",
        )}
      >
        <img
          src="/wealthwiselogonobg.png"
          alt="WealthWise"
          className="size-6 shrink-0"
        />
        {!collapsed && (
          <span className="text-sm font-bold tracking-wide text-primary">
            WealthWise
          </span>
        )}
      </Link>

      <nav className="flex flex-col gap-1">
        {navItemDefs.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
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

function BottomNavItem({
  item,
  isActive,
}: {
  item: (typeof navItemDefs)[number]
  isActive: boolean
}) {
  const iconRef = useRef<IconHandle>(null)
  const Icon = item.icon as React.ForwardRefExoticComponent<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any & React.RefAttributes<IconHandle>
  >

  return (
    <Link
      to={item.href}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className={cn(
        "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
      aria-label={item.label}
    >
      <Icon ref={iconRef} size={20} />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  )
}

const bottomNavItems = [
  navItemDefs[0],
  navItemDefs[1],
  navItemDefs[2],
  navItemDefs[4],
  navItemDefs[5],
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="card-shadow fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-background/95 pt-1 pb-4 backdrop-blur-sm md:hidden">
      {bottomNavItems.map((item) => (
        <BottomNavItem
          key={item.href}
          item={item}
          isActive={location.pathname === item.href}
        />
      ))}
    </nav>
  )
}
