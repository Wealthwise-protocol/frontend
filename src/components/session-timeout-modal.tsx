import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { useSessionTimeout } from "@/hooks/use-session-timeout"
import { useQueryClient } from "@tanstack/react-query"
import { IconClock } from "@tabler/icons-react"

export function SessionTimeoutModal() {
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)
  const queryClient = useQueryClient()

  const handleTimeout = () => {
    signOut()
    queryClient.clear()
    navigate("/signin")
  }

  const { showWarning, countdown, stayLoggedIn } = useSessionTimeout(handleTimeout)

  const handleLogout = () => {
    handleTimeout()
  }

  return (
    <Dialog open={showWarning} modal>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconClock className="size-5 text-warning" />
            Still there?
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed">
            You&apos;ve been inactive for 20 minutes. You&apos;ll be logged out
            in{" "}
            <span className="font-semibold text-foreground">{countdown}</span>{" "}
            seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-4">
          <div className="flex size-20 items-center justify-center rounded-full border-4 border-warning/30 bg-warning/10">
            <span className="text-2xl font-bold text-warning">{countdown}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
          <Button onClick={stayLoggedIn}>Stay logged in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
