import { Routes, Route } from "react-router-dom"
import { LandingPage } from "@/pages/landing"
import { SignInPage } from "@/pages/signin"
import { SignUpPage } from "@/pages/signup"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DashboardPage } from "@/pages/dashboard"
import { ProfilePage } from "@/pages/profile"
import { ExplorePage } from "@/pages/explore"
import { SipPage } from "@/pages/sip"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="sip" element={<SipPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
