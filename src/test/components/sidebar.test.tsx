import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { render } from "@/test/utils/test-utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, BottomNav } from "@/components/dashboard/sidebar"

// Mock the animated icon components
vi.mock("@/components/ui/layout-grid", () => ({
  LayoutGridIcon: () => <span data-testid="icon-layout-grid" />,
}))
vi.mock("@/components/ui/search", () => ({
  SearchIcon: () => <span data-testid="icon-search" />,
}))
vi.mock("@/components/ui/settings", () => ({
  SettingsIcon: () => <span data-testid="icon-settings" />,
}))
vi.mock("@/components/ui/layers", () => ({
  LayersIcon: () => <span data-testid="icon-layers" />,
}))
vi.mock("@/components/ui/bot-message-square", () => ({
  BotMessageSquareIcon: () => <span data-testid="icon-bot" />,
}))
vi.mock("@/components/ui/id-card", () => ({
  IdCardIcon: () => <span data-testid="icon-id-card" />,
}))

describe("SidebarProvider", () => {
  it("renders all 6 nav items", () => {
    render(
      <SidebarProvider>
        <div />
      </SidebarProvider>,
    )

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Fund Explorer")).toBeInTheDocument()
    expect(screen.getByText("SIP Management")).toBeInTheDocument()
    expect(screen.getByText("Transactions")).toBeInTheDocument()
    expect(screen.getByText("Ask X")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
  })

  it("nav items link to correct paths", () => {
    render(
      <SidebarProvider>
        <div />
      </SidebarProvider>,
    )

    const links = [
      { text: "Dashboard", href: "/dashboard" },
      { text: "Fund Explorer", href: "/dashboard/explore" },
      { text: "SIP Management", href: "/dashboard/sip" },
      { text: "Transactions", href: "/dashboard/transactions" },
      { text: "Ask X", href: "/dashboard/chat" },
      { text: "Profile", href: "/dashboard/profile" },
    ]

    links.forEach(({ text, href }) => {
      expect(screen.getByText(text).closest("a")).toHaveAttribute("href", href)
    })
  })

  it("renders WealthWise logo text in expanded state", () => {
    render(
      <SidebarProvider>
        <div />
      </SidebarProvider>,
    )

    expect(screen.getByText("WealthWise")).toBeInTheDocument()
  })

  it("renders collapse button", () => {
    render(
      <SidebarProvider>
        <div />
      </SidebarProvider>,
    )

    expect(screen.getByLabelText("Collapse sidebar")).toBeInTheDocument()
  })

  it("clicking collapse hides nav labels and WealthWise text", async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <SidebarProvider>
          <div />
        </SidebarProvider>
      </TooltipProvider>,
    )

    await user.click(screen.getByLabelText("Collapse sidebar"))

    // After collapse, labels should not be rendered
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument()
    expect(screen.queryByText("WealthWise")).not.toBeInTheDocument()
    // Should show expand button now
    expect(screen.getByLabelText("Expand sidebar")).toBeInTheDocument()
  })
})

describe("BottomNav", () => {
  it("renders 5 bottom nav items", () => {
    render(<BottomNav />)

    expect(screen.getByLabelText("Dashboard")).toBeInTheDocument()
    expect(screen.getByLabelText("Fund Explorer")).toBeInTheDocument()
    expect(screen.getByLabelText("SIP Management")).toBeInTheDocument()
    expect(screen.getByLabelText("Ask X")).toBeInTheDocument()
    expect(screen.getByLabelText("Profile")).toBeInTheDocument()
  })

  it("does not include Transactions in bottom nav", () => {
    render(<BottomNav />)

    // Transactions is excluded from bottom nav (only 5 items)
    expect(screen.queryByLabelText("Transactions")).not.toBeInTheDocument()
  })
})
