import { Routes, Route } from "react-router-dom"
import { LandingPage } from "@/pages/landing"
import { SignInPage } from "@/pages/signin"
import { SignUpPage } from "@/pages/signup"
import { ForgotPasswordPage } from "@/pages/forgot-password"
import { ResetPasswordPage } from "@/pages/reset-password"
import { NotFoundPage } from "@/pages/not-found"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DashboardPage } from "@/pages/dashboard"
import { ProfilePage } from "@/pages/profile"
import { ExplorePage } from "@/pages/explore"
import { SipPage } from "@/pages/sip"
import { TransactionsPage } from "@/pages/transactions"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="sip" element={<SipPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
