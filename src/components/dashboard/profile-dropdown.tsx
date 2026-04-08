import { IconUser, IconLogout } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { useSignOut } from "@/hooks/use-auth"

export function ProfileDropdown() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const signOutMutation = useSignOut()

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu">
          {user ? (
            <span className="text-xs font-bold">{initials}</span>
          ) : (
            <IconUser className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
          <IconUser className="mr-2 size-3.5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={signOutMutation.isPending}
          onClick={() => signOutMutation.mutate()}
        >
          <IconLogout className="mr-2 size-3.5" />
          {signOutMutation.isPending ? "Signing out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
