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
import { toast } from "sonner"

export function ProfileDropdown() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Profile menu">
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
          onClick={() => {
            signOut()
            navigate("/signin")
            toast.success("Signed out")
          }}
        >
          <IconLogout className="mr-2 size-3.5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
