import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Steps } from "@/components/landing/steps"
import { Capabilities } from "@/components/landing/capabilities"
import { FundPreview } from "@/components/landing/fund-preview"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export function LandingPage() {
  return (
    <div className="min-h-svh">
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
