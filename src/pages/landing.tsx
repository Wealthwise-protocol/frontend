import { usePageTitle } from "@/hooks/use-page-title"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Steps } from "@/components/landing/steps"
import { Capabilities } from "@/components/landing/capabilities"
import { FundPreview } from "@/components/landing/fund-preview"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export function LandingPage() {
  usePageTitle("")

  return (
    <div className="min-h-svh bg-grid-pattern">
      <Navbar />
      <main>
        <Hero />
        <Steps />
        <Capabilities />
        <FundPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
