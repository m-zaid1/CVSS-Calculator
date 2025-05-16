"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { SavedAssessment } from "@/lib/cvss-types"

interface HistoricalComparisonProps {
  assessments: SavedAssessment[]
  currentScore: number
  currentVector: string
}

export default function HistoricalComparison({ assessments, currentScore, currentVector }: HistoricalComparisonProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Prepare data for the chart
    const data = assessments.map((assessment) => ({
      name: assessment.name,
      score: assessment.scores.finalScore,
      date: new Date(assessment.date).toLocaleDateString(),
      vector: assessment.vector,
    }))

    // Add current assessment if it's not saved yet
    const isCurrentSaved = assessments.some((a) => a.vector === currentVector)

    if (!isCurrentSaved && currentScore > 0) {
      data.push({
        name: "Current",
        score: currentScore,
        date: new Date().toLocaleDateString(),
        vector: currentVector,
      })
    }

    // Sort by date
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setChartData(data)
  }, [assessments, currentScore, currentVector])

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-mono text-green-400/80">No historical data available.</p>
        <p className="font-mono text-green-400/60 text-sm mt-2">
          Save assessments to see how vulnerability scores change over time.
        </p>
      </div>
    )
  }

  return (
    <div className="pixelated-border bg-gray-900 p-4 rounded-lg h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4ade8050" />
          <XAxis
            dataKey="name"
            stroke="#4ade80"
            tick={{ fill: "#4ade80", fontFamily: "var(--font-vt323)", fontSize: 14 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[0, 10]}
            stroke="#4ade80"
            tick={{ fill: "#4ade80", fontFamily: "var(--font-vt323)", fontSize: 14 }}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
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
            formatter={(value: any, name: any) => [value.toFixed(1), "Score"]}
            labelFormatter={(label) => `Assessment: ${label}`}
          />
          <Legend
            wrapperStyle={{
              fontFamily: "var(--font-vt323)",
              fontSize: 14,
              color: "#4ade80",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ r: 6, fill: "#4ade80", stroke: "#000" }}
            activeDot={{ r: 8, fill: "#4ade80", stroke: "#000" }}
            name="CVSS Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
