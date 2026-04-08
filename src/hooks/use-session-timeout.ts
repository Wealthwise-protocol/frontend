import { useEffect, useRef, useState, useCallback } from "react"

const IDLE_TIMEOUT = 20 * 60 * 1000 // 20 minutes
const COUNTDOWN_DURATION = 120 // seconds

export function useSessionTimeout(onTimeout: () => void) {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

  const startIdleTimer = useCallback(() => {
    clearTimers()
    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      setCountdown(COUNTDOWN_DURATION)

      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearTimers()
            setShowWarning(false)
            onTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, IDLE_TIMEOUT)
  }, [clearTimers, onTimeout])

  const stayLoggedIn = useCallback(() => {
    setShowWarning(false)
    setCountdown(COUNTDOWN_DURATION)
    startIdleTimer()
  }, [startIdleTimer])

  useEffect(() => {
    const resetTimer = () => {
      if (!showWarning) startIdleTimer()
    }

    const events = ["mousemove", "keydown", "click"]
    events.forEach((e) => window.addEventListener(e, resetTimer))
    startIdleTimer()

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      clearTimers()
    }
  }, [startIdleTimer, showWarning, clearTimers])

  return { showWarning, countdown, stayLoggedIn }
}
