import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react"
import { type ReactNode, useEffect, useState } from "react"

// Fade-in with upward slide
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered container
export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Child item for StaggerContainer
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Collapsible with smooth height animation
export function Collapsible({
  open,
  children,
}: {
  open: boolean
  children: ReactNode
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Count-up number animation
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.2,
  formatFn,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
  formatFn?: (v: number) => string
}) {
  const [display, setDisplay] = useState("0")
  const motionValue = useMotionValue(0)
  const formatted = useTransform(motionValue, (v) => {
    if (formatFn) return formatFn(v)
    if (value >= 100) return Math.round(v).toLocaleString("en-IN")
    return v.toFixed(1)
  })

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    })
    const unsubscribe = formatted.on("change", (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, duration, motionValue, formatted])

  return (
    <span className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
