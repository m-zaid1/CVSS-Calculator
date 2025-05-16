"use client"

import { useEffect, useRef } from "react"

interface SeverityGaugeProps {
  score: number
  severity: string
}

export default function SeverityGauge({ score, severity }: SeverityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height
    const radius = Math.min(width, height) * 0.8

    // Draw gauge background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#374151"
    ctx.stroke()

    // Calculate score position (0-10 scale)
    const angle = Math.PI - (score / 10) * Math.PI
    const endX = centerX + radius * Math.cos(angle)
    const endY = centerY - radius * Math.sin(angle)

    // Draw colored gauge based on severity
    let gradientColor
    switch (severity) {
      case "Critical":
        gradientColor = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
        gradientColor.addColorStop(0, "#4ade80")
        gradientColor.addColorStop(0.6, "#eab308")
        gradientColor.addColorStop(1, "#dc2626")
        break
      case "High":
        gradientColor = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
        gradientColor.addColorStop(0, "#4ade80")
        gradientColor.addColorStop(0.7, "#eab308")
        gradientColor.addColorStop(1, "#f97316")
        break
      case "Medium":
        gradientColor = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
        gradientColor.addColorStop(0, "#4ade80")
        gradientColor.addColorStop(1, "#eab308")
        break
      case "Low":
        gradientColor = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
        gradientColor.addColorStop(0, "#4ade80")
        gradientColor.addColorStop(1, "#3b82f6")
        break
      default:
        gradientColor = "#4ade80"
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, angle, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = gradientColor
    ctx.stroke()

    // Draw needle
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(endX, endY)
    ctx.lineWidth = 4
    ctx.strokeStyle = "#ffffff"
    ctx.stroke()

    // Draw center point
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false)
    ctx.fillStyle = "#4ade80"
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = "#1f2937"
    ctx.stroke()

    // Draw scale markers
    for (let i = 0; i <= 10; i++) {
      const markerAngle = Math.PI - (i / 10) * Math.PI
      const markerStartX = centerX + (radius - 25) * Math.cos(markerAngle)
      const markerStartY = centerY - (radius - 25) * Math.sin(markerAngle)
      const markerEndX = centerX + (radius + 5) * Math.cos(markerAngle)
      const markerEndY = centerY - (radius + 5) * Math.sin(markerAngle)

      ctx.beginPath()
      ctx.moveTo(markerStartX, markerStartY)
      ctx.lineTo(markerEndX, markerEndY)
      ctx.lineWidth = i % 5 === 0 ? 3 : 1
      ctx.strokeStyle = "#4ade80"
      ctx.stroke()

      if (i % 2 === 0) {
        const textX = centerX + (radius - 40) * Math.cos(markerAngle)
        const textY = centerY - (radius - 40) * Math.sin(markerAngle)
        ctx.font = "12px 'VT323', monospace"
        ctx.fillStyle = "#4ade80"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(i.toString(), textX, textY)
      }
    }

    // Add severity labels
    ctx.font = "14px 'Press Start 2P', monospace"
    ctx.fillStyle = "#4ade80"
    ctx.textAlign = "center"

    // Low
    ctx.fillText("L", centerX - radius * 0.7, centerY - radius * 0.3)

    // Medium
    ctx.fillText("M", centerX - radius * 0.3, centerY - radius * 0.6)

    // High
    ctx.fillText("H", centerX + radius * 0.3, centerY - radius * 0.6)

    // Critical
    ctx.fillText("C", centerX + radius * 0.7, centerY - radius * 0.3)
  }, [score, severity])

  return (
    <div className="w-full flex justify-center">
      <canvas ref={canvasRef} width={300} height={150} className="pixelated-border bg-gray-900 rounded-t-full" />
    </div>
  )
}
