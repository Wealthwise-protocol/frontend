import { Outlet } from "react-router-dom"
import { SidebarProvider, BottomNav, useSidebarState } from "@/components/dashboard/sidebar"
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

function LayoutShell() {
  const { collapsed } = useSidebarState()

  return (
    <div
      className={cn(
        "flex min-h-svh flex-col transition-all duration-200",
        collapsed ? "md:ml-14" : "md:ml-56"
      )}
    >
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-end border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>

      <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  )
}
