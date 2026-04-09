import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconShieldCheck, IconAlertTriangle, IconClock } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/error-messages"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"
import { useAuthStore } from "@/stores/auth-store"
import { authService } from "@/services/auth"
import { toast } from "sonner"

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
const strengthColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
]

export function ProfilePage() {
  usePageTitle("Profile")
  const navigate = useNavigate()
  const { user, updateProfile, signOut } = useAuthStore()

  const [firstName, setFirstName] = useState(user?.firstName ?? "")
  const [lastName, setLastName] = useState(user?.lastName ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const strength = getPasswordStrength(newPassword)

  if (!user) {
    return <p className="text-muted-foreground">Not logged in</p>
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

  const lastLogin = localStorage.getItem("ww-last-login")
  const lastLoginFormatted = lastLogin
    ? new Date(lastLogin).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  function getBrowserName() {
    const ua = navigator.userAgent
    if (ua.includes("Firefox")) return "Firefox"
    if (ua.includes("Edg")) return "Edge"
    if (ua.includes("Chrome")) return "Chrome"
    if (ua.includes("Safari")) return "Safari"
    return "Unknown"
  }

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left column */}
        <StaggerContainer className="flex flex-col gap-6">
          {/* Profile header card */}
          <StaggerItem><Card className="card-shadow">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {initials}
                </div>
                <div>
                  <h2 className="text-sm font-semibold">{user.firstName} {user.lastName}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.phone}
                  </p>
                </div>
              </div>
              {user.kycVerified ? (
                <Badge
                  variant="outline"
                  className="w-fit gap-1 bg-gain"
                >
                  <IconShieldCheck className="size-3" />
                  KYC Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="w-fit gap-1 bg-warning"
                >
                  KYC Pending
                </Badge>
              )}
            </CardContent>
          </Card></StaggerItem>

          {/* Last session */}
          {lastLoginFormatted && (
            <StaggerItem>
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-2.5">
                <IconClock className="size-3.5 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Last session: {lastLoginFormatted} &bull; {getBrowserName()}
                </p>
              </div>
            </StaggerItem>
          )}

          {/* Edit profile card */}
          <StaggerItem><Card className="card-shadow">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Edit Profile</h3>
              <Separator className="mt-3 mb-5" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="phone" className="text-xs">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button
                className=" mt-5"
                size="sm"
                onClick={async () => {
                  try {
                    const updated = await authService.updateProfile({ firstName, lastName, phone })
                    updateProfile(updated)
                    toast.success("Profile updated")
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err, "Failed to update profile"))
                  }
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card></StaggerItem>
        </StaggerContainer>

        {/* Right column */}
        <StaggerContainer className="flex flex-col gap-6">
          {/* Security card */}
          <StaggerItem><Card className="card-shadow">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Security</h3>
              <Separator className="mt-3 mb-5" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword.length > 0 && (
                    <>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 transition-colors",
                              i < strength
                                ? strengthColors[strength - 1]
                                : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      <p
                        className={cn(
                          "text-xs",
                          strength <= 1
                            ? "text-red-500"
                            : strength === 2
                              ? "text-orange-500"
                              : strength === 3
                                ? "text-yellow-500"
                                : "text-emerald-500"
                        )}
                      >
                        {strengthLabels[strength - 1] ?? "Too short"}
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className=" mt-5"
                size="sm"
                onClick={async () => {
                  try {
                    await authService.changePassword({ currentPassword, newPassword })
                    toast.success("Password updated")
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err, "Failed to update password"))
                  }
                }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card></StaggerItem>

          {/* Danger zone */}
          <StaggerItem><Card className="card-shadow border border-destructive/30">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-destructive">
                Danger Zone
              </h3>
              <Separator className="mt-3 mb-5" />

              <p className="text-xs leading-relaxed text-muted-foreground">
                Once you delete your account, there is no going back. All your
                data including holdings, SIPs, and transaction history will be
                permanently removed.
              </p>

              <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
                setDeleteDialogOpen(open)
                if (!open) setDeleteConfirmation("")
              }}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className=" mt-4">
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <IconAlertTriangle className="size-5" />
                      Delete your account?
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-sm leading-relaxed">
                      This action is <span className="font-semibold text-foreground">irreversible</span>.
                      All your holdings, SIPs, and transaction history will be permanently removed.
                      Your invested funds will need to be redeemed separately.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 pt-2">
                    <div className="rounded-md border border-destructive/30 bg-muted p-3">
                      <p className="text-xs text-muted-foreground">
                        To confirm, type{" "}
                        <span className="font-mono font-semibold text-foreground">
                          delete my account
                        </span>{" "}
                        below:
                      </p>
                    </div>
                    <label htmlFor="delete-confirm" className="sr-only">Type &quot;delete my account&quot; to confirm</label>
                    <Input
                      id="delete-confirm"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="delete my account"
                      className="font-mono text-sm"
                      autoComplete="off"
                    />
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className=""
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className=""
                      disabled={deleteConfirmation !== "delete my account" || deleting}
                      onClick={async () => {
                        setDeleting(true)
                        try {
                          await authService.deleteAccount()
                          signOut()
                          navigate("/")
                          toast.success("Your account has been deleted")
                        } catch (err: unknown) {
                          toast.error(getErrorMessage(err, "Failed to delete account"))
                        } finally {
                          setDeleting(false)
                        }
                      }}
                    >
                      {deleting ? "Deleting..." : "I understand, delete my account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card></StaggerItem>
        </StaggerContainer>
      </div>
    </>
  )
}
