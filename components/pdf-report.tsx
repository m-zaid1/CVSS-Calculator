"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { CvssMetrics } from "@/lib/cvss-types"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

interface PdfReportProps {
  metrics: CvssMetrics
  scores: {
    baseScore: number
    threatScore: number
    environmentalScore: number
    supplementalScore: number
    finalScore: number
    severity: string
  }
  vector: string
}

export default function PdfReport({ metrics, scores, vector }: PdfReportProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePdf = async () => {
    setIsGenerating(true)

    try {
      const pdfDoc = await PDFDocument.create()
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      // Add a page
      const page = pdfDoc.addPage([612, 792])
      const { width, height } = page.getSize()

      // Title with green background
      page.drawRectangle({
        x: 0,
        y: height - 50,
        width: width,
        height: 50,
        color: rgb(0, 0.5, 0),
      })

      page.drawText("CVSS 4.0 Vulnerability Assessment", {
        x: 50,
        y: height - 30,
        size: 24,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      // Date
      page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
        x: 50,
        y: height - 70,
        size: 12,
        font: timesRomanFont,
      })

      // CVSS Scores Table Header
      page.drawText("CVSS Scores", {
        x: 50,
        y: height - 100,
        size: 16,
        font: timesRomanBoldFont,
      })

      // Table header with green background
      page.drawRectangle({
        x: 50,
        y: height - 125,
        width: width - 100,
        height: 25,
        color: rgb(0, 0.5, 0),
      })

      page.drawText("Score Type", {
        x: 200,
        y: height - 110,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      page.drawText("Value", {
        x: 470,
        y: height - 110,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      // Table rows
      const rowHeight = 25
      let yPos = height - 125 - rowHeight

      // Draw row background (alternating)
      page.drawRectangle({
        x: 50,
        y: yPos,
        width: width - 100,
        height: rowHeight,
        color: rgb(0.95, 0.95, 0.95),
      })

      page.drawText("Base Score", {
        x: 60,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      page.drawText(scores.baseScore.toFixed(1), {
        x: 470,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      yPos -= rowHeight

      page.drawText("Threat Score", {
        x: 60,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      page.drawText(scores.threatScore.toFixed(1), {
        x: 470,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      yPos -= rowHeight

      // Draw row background (alternating)
      page.drawRectangle({
        x: 50,
        y: yPos,
        width: width - 100,
        height: rowHeight,
        color: rgb(0.95, 0.95, 0.95),
      })

      page.drawText("Environmental Score", {
        x: 60,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      page.drawText(scores.environmentalScore.toFixed(1), {
        x: 470,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      yPos -= rowHeight

      page.drawText("Supplemental Score", {
        x: 60,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      page.drawText(scores.supplementalScore.toFixed(1), {
        x: 470,
        y: yPos + 8,
        size: 12,
        font: timesRomanFont,
      })

      yPos -= rowHeight

      // Draw row background for final score (green)
      page.drawRectangle({
        x: 50,
        y: yPos,
        width: width - 100,
        height: rowHeight,
        color: rgb(0, 0.5, 0),
      })

      page.drawText("Final Score", {
        x: 60,
        y: yPos + 8,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      page.drawText(scores.finalScore.toFixed(1), {
        x: 470,
        y: yPos + 8,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      yPos -= rowHeight * 1.5

      // Vector string
      page.drawText("Vector String:", {
        x: 50,
        y: yPos,
        size: 12,
        font: timesRomanBoldFont,
      })

      // Break the vector string into multiple lines if needed
      const vectorString = vector
      const maxWidth = width - 100
      const fontSize = 10
      const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6))

      if (vectorString.length > charsPerLine) {
        let remainingText = vectorString
        let lineY = yPos - 20

        while (remainingText.length > 0) {
          const lineText = remainingText.substring(0, charsPerLine)
          page.drawText(lineText, {
            x: 50,
            y: lineY,
            size: fontSize,
            font: timesRomanFont,
          })

          remainingText = remainingText.substring(charsPerLine)
          lineY -= 15
        }

        yPos = lineY - 20
      } else {
        page.drawText(vectorString, {
          x: 50,
          y: yPos - 20,
          size: fontSize,
          font: timesRomanFont,
        })

        yPos -= 40
      }

      // Metrics details
      page.drawText("Metrics Details", {
        x: 50,
        y: yPos,
        size: 16,
        font: timesRomanBoldFont,
      })

      yPos -= 25

      // Table header with green background
      page.drawRectangle({
        x: 50,
        y: yPos,
        width: width - 100,
        height: 25,
        color: rgb(0, 0.5, 0),
      })

      page.drawText("Category", {
        x: 100,
        y: yPos + 8,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      page.drawText("Metric", {
        x: 300,
        y: yPos + 8,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      page.drawText("Value", {
        x: 470,
        y: yPos + 8,
        size: 12,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      yPos -= rowHeight

      // Base metrics
      const metricsList = [
        { category: "Base", name: "Attack Vector", value: metrics.attackVector },
        { category: "Base", name: "Attack Complexity", value: metrics.attackComplexity },
        { category: "Base", name: "Attack Requirements", value: metrics.attackRequirements },
        { category: "Base", name: "Privileges Required", value: metrics.privilegesRequired },
        { category: "Base", name: "User Interaction", value: metrics.userInteraction },
        { category: "Base", name: "Confidentiality Impact", value: metrics.confidentialityImpact },
        { category: "Base", name: "Integrity Impact", value: metrics.integrityImpact },
        { category: "Base", name: "Availability Impact", value: metrics.availabilityImpact },
        {
          category: "Threat",
          name: "Subsequent Confidentiality Impact",
          value: metrics.subsequentConfidentialityImpact,
        },
        { category: "Threat", name: "Subsequent Integrity Impact", value: metrics.subsequentIntegrityImpact },
        { category: "Threat", name: "Subsequent Availability Impact", value: metrics.subsequentAvailabilityImpact },
        { category: "Threat", name: "Exploit Maturity", value: metrics.exploit },
        { category: "Environmental", name: "Confidentiality Requirement", value: metrics.confidentialityRequirement },
        { category: "Environmental", name: "Integrity Requirement", value: metrics.integrityRequirement },
        { category: "Environmental", name: "Availability Requirement", value: metrics.availabilityRequirement },
        { category: "Environmental", name: "Modified Attack Vector", value: metrics.modifiedAttackVector },
        { category: "Environmental", name: "Modified Attack Complexity", value: metrics.modifiedAttackComplexity },
        { category: "Environmental", name: "Modified Attack Requirements", value: metrics.modifiedAttackRequirements },
        { category: "Environmental", name: "Modified Privileges Required", value: metrics.modifiedPrivilegesRequired },
        { category: "Environmental", name: "Modified User Interaction", value: metrics.modifiedUserInteraction },
        {
          category: "Environmental",
          name: "Modified Confidentiality Impact",
          value: metrics.modifiedConfidentialityImpact,
        },
        { category: "Environmental", name: "Modified Integrity Impact", value: metrics.modifiedIntegrityImpact },
        { category: "Environmental", name: "Modified Availability Impact", value: metrics.modifiedAvailabilityImpact },
        {
          category: "Environmental",
          name: "Modified Subsequent Confidentiality Impact",
          value: metrics.modifiedSubsequentConfidentialityImpact,
        },
        {
          category: "Environmental",
          name: "Modified Subsequent Integrity Impact",
          value: metrics.modifiedSubsequentIntegrityImpact,
        },
        {
          category: "Environmental",
          name: "Modified Subsequent Availability Impact",
          value: metrics.modifiedSubsequentAvailabilityImpact,
        },
        { category: "Supplemental", name: "Safety", value: metrics.safety },
        { category: "Supplemental", name: "Automatable", value: metrics.automatable },
        { category: "Supplemental", name: "Recovery", value: metrics.recovery },
        { category: "Supplemental", name: "Value Density", value: metrics.valueDensity },
        { category: "Supplemental", name: "Response Effort", value: metrics.responseEffort },
        { category: "Supplemental", name: "Provider Urgency", value: metrics.providerUrgency },
      ]

      let rowCount = 0
      let currentPage = page
      let currentHeight = height

      for (const metric of metricsList) {
        // Check if we need a new page
        if (yPos < 50) {
          currentPage = pdfDoc.addPage([612, 792])
          currentHeight = currentPage.getSize().height
          yPos = currentHeight - 50

          // Add header to new page
          currentPage.drawRectangle({
            x: 50,
            y: yPos,
            width: width - 100,
            height: 25,
            color: rgb(0, 0.5, 0),
          })

          currentPage.drawText("Category", {
            x: 100,
            y: yPos + 8,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(1, 1, 1),
          })

          currentPage.drawText("Metric", {
            x: 300,
            y: yPos + 8,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(1, 1, 1),
          })

          currentPage.drawText("Value", {
            x: 470,
            y: yPos + 8,
            size: 12,
            font: timesRomanBoldFont,
            color: rgb(1, 1, 1),
          })

          yPos -= rowHeight
          rowCount = 0
        }

        // Draw row background (alternating)
        if (rowCount % 2 === 0) {
          currentPage.drawRectangle({
            x: 50,
            y: yPos,
            width: width - 100,
            height: rowHeight,
            color: rgb(0.95, 0.95, 0.95),
          })
        }

        currentPage.drawText(metric.category, {
          x: 60,
          y: yPos + 8,
          size: 10,
          font: timesRomanFont,
        })

        currentPage.drawText(metric.name, {
          x: 180,
          y: yPos + 8,
          size: 10,
          font: timesRomanFont,
        })

        currentPage.drawText(metric.value, {
          x: 470,
          y: yPos + 8,
          size: 10,
          font: timesRomanFont,
        })

        yPos -= rowHeight
        rowCount++
      }

      // Severity Rating
      currentPage.drawText("Severity Rating", {
        x: 50,
        y: 100,
        size: 16,
        font: timesRomanBoldFont,
      })

      // Draw severity box with appropriate color
      let severityColor
      switch (scores.severity) {
        case "Critical":
          severityColor = rgb(0.8, 0.1, 0.1)
          break
        case "High":
          severityColor = rgb(0.9, 0.5, 0.1)
          break
        case "Medium":
          severityColor = rgb(0.9, 0.8, 0.2)
          break
        case "Low":
          severityColor = rgb(0.2, 0.5, 0.8)
          break
        default:
          severityColor = rgb(0.5, 0.5, 0.5)
      }

      currentPage.drawRectangle({
        x: 50,
        y: 70,
        width: 100,
        height: 25,
        color: severityColor,
      })

      currentPage.drawText(scores.severity, {
        x: 70,
        y: 80,
        size: 14,
        font: timesRomanBoldFont,
        color: rgb(1, 1, 1),
      })

      // Footer
      currentPage.drawText("Generated with CVSS 4.0 Pixel Calculator", {
        x: width / 2 - 100,
        y: 30,
        size: 10,
        font: timesRomanFont,
      })

      // Save the PDF
      const pdfBytes = await pdfDoc.save()

      // Convert to blob URL
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    generatePdf()

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [metrics, scores, vector])

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = `cvss4_report_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {pdfUrl ? (
        <>
          <iframe src={pdfUrl} className="w-full h-[60vh] border-2 border-green-400 pixelated-border mb-4" />
          <Button
            onClick={handleDownload}
            className="font-pixel pixelated-border bg-green-600 hover:bg-green-500 text-black"
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-pixel text-green-400">Generating PDF...</p>
        </div>
      )}
    </div>
  )
}
