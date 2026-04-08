import { useState, useEffect, useRef } from "react"

export function useMinDelay(isLoading: boolean, minMs = 300): boolean {
  const [show, setShow] = useState(isLoading)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
      startRef.current = Date.now()
      if (timerRef.current) clearTimeout(timerRef.current)
    } else if (startRef.current !== null) {
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, minMs - elapsed)
      timerRef.current = setTimeout(() => {
        setShow(false)
        startRef.current = null
      }, remaining)
    } else {
      setShow(false)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isLoading, minMs])

  return show
}
