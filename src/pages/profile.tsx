import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconShieldCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated"

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
  const [firstName, setFirstName] = useState("Arjun")
  const [lastName, setLastName] = useState("Kapoor")
  const [phone, setPhone] = useState("+91 98765 43210")
  const [newPassword, setNewPassword] = useState("")

  const strength = getPasswordStrength(newPassword)

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left column */}
        <StaggerContainer className="flex flex-col gap-6">
          {/* Profile header card */}
          <StaggerItem><Card>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  AK
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Arjun Kapoor</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    arjun.kapoor@example.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +91 98765 43210
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="w-fit gap-1 border-emerald-500/30 text-emerald-500"
              >
                <IconShieldCheck className="size-3" />
                KYC Verified
              </Badge>
            </CardContent>
          </Card></StaggerItem>

          {/* Edit profile card */}
          <StaggerItem><Card>
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

              <Button className="mt-5" size="sm">
                Save Changes
              </Button>
            </CardContent>
          </Card></StaggerItem>
        </StaggerContainer>

        {/* Right column */}
        <StaggerContainer className="flex flex-col gap-6">
          {/* Security card */}
          <StaggerItem><Card>
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
                    defaultValue="password"
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
                              "h-1 flex-1 rounded-full transition-colors",
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
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <Button className="mt-5" size="sm">
                Update Password
              </Button>
            </CardContent>
          </Card></StaggerItem>

          {/* Danger zone */}
          <StaggerItem><Card className="border-destructive/30">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-destructive">
                Danger Zone
              </h3>
              <Separator className="mt-3 mb-5" />

              <p className="text-xs leading-relaxed text-muted-foreground">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <Button variant="destructive" size="sm" className="mt-4">
                Delete Account
              </Button>
            </CardContent>
          </Card></StaggerItem>
        </StaggerContainer>
      </div>
    </>
  )
}
