import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function useFocusOnNavigate() {
  const { pathname } = useLocation()

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const main = document.querySelector<HTMLElement>("main")
      if (main) {
        main.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])
}
