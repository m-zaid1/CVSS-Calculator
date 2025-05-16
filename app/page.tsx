import CvssCalculator from "@/components/cvss-calculator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CVSS 4.0 Calculator | Pixel Security",
  description: "Calculate and analyze CVSS 4.0 scores with our retro-styled calculator",
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <CvssCalculator />
    </main>
  )
}
