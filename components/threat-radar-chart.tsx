"use client"

import { useTheme } from "next-themes"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"
import type { CvssMetrics } from "@/lib/cvss-types"

interface ThreatRadarChartProps {
  metrics: CvssMetrics
}

export default function ThreatRadarChart({ metrics }: ThreatRadarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark" || theme === "system"

  // Convert metric values to numerical scores for visualization
  const getMetricScore = (value: string, metricType: string) => {
    switch (metricType) {
      case "impact":
        return value === "H" ? 1.0 : value === "L" ? 0.5 : 0.0
      case "attack":
        switch (value) {
          case "N":
            return 1.0 // Network
          case "A":
            return 0.75 // Adjacent
          case "L":
            return 0.5 // Local
          case "P":
            return 0.25 // Physical
          default:
            return 0.0
        }
      case "complexity":
        return value === "L" ? 1.0 : 0.5
      case "requirements":
        return value === "N" ? 1.0 : 0.5
      case "privileges":
        switch (value) {
          case "N":
            return 1.0 // None
          case "L":
            return 0.5 // Low
          case "H":
            return 0.25 // High
          default:
            return 0.0
        }
      case "interaction":
        switch (value) {
          case "N":
            return 1.0 // None
          case "P":
            return 0.5 // Passive
          case "A":
            return 0.25 // Active
          default:
            return 0.0
        }
      case "exploit":
        switch (value) {
          case "A":
            return 1.0 // Attacked
          case "P":
            return 0.75 // PoC
          case "U":
            return 0.5 // Unreported
          case "X":
            return 0.25 // Not Defined
          default:
            return 0.0
        }
      case "safety":
        return value === "P" ? 1.0 : 0.0
      default:
        return 0.0
    }
  }

  const data = [
    {
      subject: "Attack Vector",
      A: getMetricScore(metrics.attackVector, "attack"),
      fullMark: 1,
    },
    {
      subject: "Attack Complexity",
      A: getMetricScore(metrics.attackComplexity, "complexity"),
      fullMark: 1,
    },
    {
      subject: "Privileges Required",
      A: getMetricScore(metrics.privilegesRequired, "privileges"),
      fullMark: 1,
    },
    {
      subject: "User Interaction",
      A: getMetricScore(metrics.userInteraction, "interaction"),
      fullMark: 1,
    },
    {
      subject: "Confidentiality",
      A: getMetricScore(metrics.confidentialityImpact, "impact"),
      fullMark: 1,
    },
    {
      subject: "Integrity",
      A: getMetricScore(metrics.integrityImpact, "impact"),
      fullMark: 1,
    },
    {
      subject: "Availability",
      A: getMetricScore(metrics.availabilityImpact, "impact"),
      fullMark: 1,
    },
    {
      subject: "Exploit Maturity",
      A: getMetricScore(metrics.exploit, "exploit"),
      fullMark: 1,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#4ade8050" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#4ade80", fontFamily: "var(--font-vt323)", fontSize: 12 }} />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 1]}
          tick={{ fill: "#4ade80", fontFamily: "var(--font-vt323)", fontSize: 12 }}
        />
        <Radar name="Threat Surface" dataKey="A" stroke="#4ade80" fill="#4ade80" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
