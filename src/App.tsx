import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard/layout"
import { PageLoader } from "@/components/page-loader"

const LandingPage = lazy(() =>
  import("@/pages/landing").then((m) => ({ default: m.LandingPage }))
)
const SignInPage = lazy(() =>
  import("@/pages/signin").then((m) => ({ default: m.SignInPage }))
)
const SignUpPage = lazy(() =>
  import("@/pages/signup").then((m) => ({ default: m.SignUpPage }))
)
const ForgotPasswordPage = lazy(() =>
  import("@/pages/forgot-password").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
)
const ResetPasswordPage = lazy(() =>
  import("@/pages/reset-password").then((m) => ({
    default: m.ResetPasswordPage,
  }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((m) => ({ default: m.NotFoundPage }))
)
const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage }))
)
const ExplorePage = lazy(() =>
  import("@/pages/explore").then((m) => ({ default: m.ExplorePage }))
)
const SipPage = lazy(() =>
  import("@/pages/sip").then((m) => ({ default: m.SipPage }))
)
const TransactionsPage = lazy(() =>
  import("@/pages/transactions").then((m) => ({
    default: m.TransactionsPage,
  }))
)
const ProfilePage = lazy(() =>
  import("@/pages/profile").then((m) => ({ default: m.ProfilePage }))
)
const ChatPage = lazy(() =>
  import("@/pages/chat").then((m) => ({ default: m.ChatPage }))
)

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
