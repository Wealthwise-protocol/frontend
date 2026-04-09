import { createContext, useContext } from "react"

type SidebarContextValue = { collapsed: boolean }

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
})

export const useSidebarState = () => useContext(SidebarContext)
