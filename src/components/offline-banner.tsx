import { useEffect, useState } from "react"
import { IconWifiOff, IconWifi } from "@tabler/icons-react"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showOnline, setShowOnline] = useState(false)

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true)
      setShowOnline(false)
    }

    function handleOnline() {
      setIsOffline(false)
      setShowOnline(true)
      const timer = setTimeout(() => setShowOnline(false), 3000)
      return () => clearTimeout(timer)
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  if (!isOffline && !showOnline) return null

  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium ${
        isOffline
          ? "bg-warning text-warning-foreground"
          : "bg-gain text-gain-foreground"
      }`}
      role="alert"
    >
      {isOffline ? (
        <>
          <IconWifiOff className="size-3.5" />
          <span>
            You&apos;re offline. Showing last known data. Changes won&apos;t be
            saved.
          </span>
        </>
      ) : (
        <>
          <IconWifi className="size-3.5" />
          <span>Back online</span>
        </>
      )}
    </div>
  )
}
