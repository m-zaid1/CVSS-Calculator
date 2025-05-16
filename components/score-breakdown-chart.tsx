"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ScoreBreakdownChartProps {
  baseScore: number
  threatScore: number
  environmentalScore: number
  supplementalScore: number
}

export default function ScoreBreakdownChart({
  baseScore,
  threatScore,
  environmentalScore,
  supplementalScore,
}: ScoreBreakdownChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark" || theme === "system"

  const data = [
    {
      name: "Base",
      score: Number.parseFloat(baseScore.toFixed(1)),
    },
    {
      name: "Threat",
      score: Number.parseFloat(threatScore.toFixed(1)),
    },
    {
      name: "Environmental",
      score: Number.parseFloat(environmentalScore.toFixed(1)),
    },
    {
      name: "Supplemental",
      score: Number.parseFloat(supplementalScore.toFixed(1)),
    },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4ade8050" />
        <XAxis
          dataKey="name"
          stroke="#4ade80"
          tick={{ fill: "#4ade80", fontFamily: "var(--font-vt323)", fontSize: 14 }}
        />
        <YAxis
          domain={[0, 10]}
          stroke="#4ade80"
          tick={{ fill: "#4ade80", fontFamily: "var(--font-vt323)", fontSize: 14 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            borderColor: "#4ade80",
            fontFamily: "var(--font-vt323)",
            color: "#4ade80",
          }}
          itemStyle={{ color: "#4ade80" }}
          labelStyle={{ fontFamily: "var(--font-press-start-2p)", fontSize: 12, color: "#4ade80" }}
        />
        <Legend
          wrapperStyle={{
            fontFamily: "var(--font-vt323)",
            fontSize: 14,
            color: "#4ade80",
          }}
        />
        <Bar dataKey="score" fill="#4ade80" name="Score" />
      </BarChart>
    </ResponsiveContainer>
  )
}
