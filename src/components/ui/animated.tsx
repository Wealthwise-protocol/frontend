import { motion, AnimatePresence } from "motion/react"
import { type ReactNode } from "react"
import ReactCountUp from "react-countup"

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

// Count-up number animation using react-countup
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.5,
  formatFn,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
  formatFn?: (v: number) => string
}) {
  return (
    <span className={className}>
      {prefix}
      <ReactCountUp
        end={value}
        duration={duration}
        useEasing
        easingFn={(t, b, c, d) => {
          // easeOutCubic
          const x = t / d - 1
          return c * (x * x * x + 1) + b
        }}
        separator=","
        formattingFn={
          formatFn ??
          (value >= 100
            ? (v) => Math.round(v).toLocaleString("en-IN")
            : (v) => v.toFixed(1))
        }
      />
      {suffix}
    </span>
  )
}

// Fade-in triggered when element scrolls into view
export function ScrollFadeIn({
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered container triggered on scroll
export function ScrollStaggerContainer({
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
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
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

// Child item for ScrollStaggerContainer
export function ScrollStaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Page transition wrapper
export function PageTransition({
  children,
  className,
  locationKey,
}: {
  children: ReactNode
  className?: string
  locationKey: string
}) {
  return (
    <motion.div
      key={locationKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
