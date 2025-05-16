"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, HelpCircle, Save, Wand2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import MetricsForm from "./metrics-form"
import ScoreDisplay from "./score-display"
import VectorDisplay from "./vector-display"
import ScoreBreakdownChart from "./score-breakdown-chart"
import ThreatRadarChart from "./threat-radar-chart"
import SeverityGauge from "./severity-gauge"
import PdfReport from "./pdf-report"
import TutorialGuide from "./tutorial-guide"
import WizardContent from "./wizard-content"
import PixelatedBackground from "./pixelated-background"
import SavedAssessments from "./saved-assessments"
import HistoricalComparison from "./historical-comparison"
import ScoreExplanation from "./score-explanation"

import { calculateCvssScore } from "@/lib/cvss-calculator"
import { type CvssMetrics, defaultMetrics, type SavedAssessment } from "@/lib/cvss-types"
import { playClickSound } from "@/lib/sound-effects"

export default function CvssCalculator() {
  const [metrics, setMetrics] = useState<CvssMetrics>(defaultMetrics)
  const [scores, setScores] = useState({
    baseScore: 0,
    threatScore: 0,
    environmentalScore: 0,
    supplementalScore: 0,
    finalScore: 0,
    severity: "None",
  })
  const [vector, setVector] = useState("")
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showScoreExplanation, setShowScoreExplanation] = useState(false)
  const [assessmentName, setAssessmentName] = useState("")
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([])
  const [activeTab, setActiveTab] = useState("base")

  useEffect(() => {
    // Load saved assessments from localStorage
    const saved = localStorage.getItem("savedAssessments")
    if (saved) {
      setSavedAssessments(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const result = calculateCvssScore(metrics)
    setScores(result)
    setVector(generateVector(metrics))
  }, [metrics])

  const generateVector = (metrics: CvssMetrics): string => {
    return `CVSS:4.0/AV:${metrics.attackVector}/AC:${metrics.attackComplexity}/AT:${metrics.attackRequirements}/PR:${metrics.privilegesRequired}/UI:${metrics.userInteraction}/VC:${metrics.confidentialityImpact}/VI:${metrics.integrityImpact}/VA:${metrics.availabilityImpact}/SC:${metrics.subsequentConfidentialityImpact}/SI:${metrics.subsequentIntegrityImpact}/SA:${metrics.subsequentAvailabilityImpact}/E:${metrics.exploit}/CR:${metrics.confidentialityRequirement}/IR:${metrics.integrityRequirement}/AR:${metrics.availabilityRequirement}/MAV:${metrics.modifiedAttackVector}/MAC:${metrics.modifiedAttackComplexity}/MAT:${metrics.modifiedAttackRequirements}/MPR:${metrics.modifiedPrivilegesRequired}/MUI:${metrics.modifiedUserInteraction}/MVC:${metrics.modifiedConfidentialityImpact}/MVI:${metrics.modifiedIntegrityImpact}/MVA:${metrics.modifiedAvailabilityImpact}/MSC:${metrics.modifiedSubsequentConfidentialityImpact}/MSI:${metrics.modifiedSubsequentIntegrityImpact}/MSA:${metrics.modifiedSubsequentAvailabilityImpact}/S:${metrics.safety}/AU:${metrics.automatable}/R:${metrics.recovery}/V:${metrics.valueDensity}/RE:${metrics.responseEffort}/U:${metrics.providerUrgency}`
  }

  const handleMetricsChange = (newMetrics: Partial<CvssMetrics>) => {
    playClickSound()
    setMetrics((prevMetrics) => ({
      ...prevMetrics,
      ...newMetrics,
    }))
  }

  const handleReset = () => {
    setMetrics(defaultMetrics)
  }

  const handleSaveAssessment = () => {
    if (!assessmentName.trim()) return

    const newAssessment: SavedAssessment = {
      id: Date.now().toString(),
      name: assessmentName,
      date: new Date().toISOString(),
      metrics,
      scores,
      vector,
    }

    const updatedAssessments = [...savedAssessments, newAssessment]
    setSavedAssessments(updatedAssessments)
    localStorage.setItem("savedAssessments", JSON.stringify(updatedAssessments))
    setShowSaveDialog(false)
    setAssessmentName("")
  }

  const handleLoadAssessment = (assessment: SavedAssessment) => {
    setMetrics(assessment.metrics)
  }

  const handleDeleteAssessment = (id: string) => {
    const updatedAssessments = savedAssessments.filter((a) => a.id !== id)
    setSavedAssessments(updatedAssessments)
    localStorage.setItem("savedAssessments", JSON.stringify(updatedAssessments))
  }

  return (
    <div className="space-y-8">
      <PixelatedBackground />

      <div className="text-center">
        <h1 className="text-4xl font-pixel text-green-400 mb-2">CVSS 4.0 Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-800 pixelated-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-pixel text-green-400">Metrics Selection</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleReset} className="font-pixel pixelated-border">
                  Reset
                </Button>
              </div>
            </div>
            <CardDescription className="font-mono text-green-400/80">
              Select values for each metric to calculate the CVSS score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4 bg-gray-700 pixelated-border">
                <TabsTrigger value="base" className="font-pixel text-xs">
                  Base
                </TabsTrigger>
                <TabsTrigger value="threat" className="font-pixel text-xs">
                  Threat
                </TabsTrigger>
                <TabsTrigger value="environmental" className="font-pixel text-xs">
                  Environmental
                </TabsTrigger>
                <TabsTrigger value="supplemental" className="font-pixel text-xs">
                  Supplemental
                </TabsTrigger>
              </TabsList>
              <MetricsForm metrics={metrics} onChange={handleMetricsChange} activeTab={activeTab} />
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gray-800 pixelated-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-pixel text-green-400">CVSS Score</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="pixelated-border"
                        onClick={() => setShowScoreExplanation(true)}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-green-400 pixelated-border">
                      <p className="font-mono">View Score Explanation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="font-mono text-green-400/80">Score and severity rating</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ScoreDisplay score={scores.finalScore} severity={scores.severity} />
              <SeverityGauge score={scores.finalScore} severity={scores.severity} />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 pixelated-border">
            <CardHeader>
              <CardTitle className="font-pixel text-green-400">Vector String</CardTitle>
              <CardDescription className="font-mono text-green-400/80">CVSS 4.0 vector representation</CardDescription>
            </CardHeader>
            <CardContent>
              <VectorDisplay vector={vector} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              className="font-pixel pixelated-border bg-green-600 hover:bg-green-500 text-black"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button
              className="font-pixel pixelated-border bg-green-600 hover:bg-green-500 text-black"
              onClick={() => setShowPdfPreview(true)}
            >
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-pixel pixelated-border bg-green-600 hover:bg-green-500 text-black">
                  <Wand2 className="mr-2 h-4 w-4" /> Wizard
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-green-400 pixelated-border max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="font-pixel">CVSS 4.0 Wizard</DialogTitle>
                  <DialogDescription className="font-mono">
                    Learn about CVSS 4.0 formulas and calculations
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <WizardContent />
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-pixel pixelated-border bg-green-600 hover:bg-green-500 text-black">
                  <HelpCircle className="mr-2 h-4 w-4" /> Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-green-400 pixelated-border max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="font-pixel">CVSS 4.0 Guide</DialogTitle>
                  <DialogDescription className="font-mono">Learn how to use the CVSS 4.0 calculator</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <TutorialGuide />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 pixelated-border">
          <CardHeader>
            <CardTitle className="font-pixel text-green-400">Score Breakdown</CardTitle>
            <CardDescription className="font-mono text-green-400/80">Comparison of metric group scores</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[300px]">
              <ScoreBreakdownChart
                baseScore={scores.baseScore}
                threatScore={scores.threatScore}
                environmentalScore={scores.environmentalScore}
                supplementalScore={scores.supplementalScore}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 pixelated-border">
          <CardHeader>
            <CardTitle className="font-pixel text-green-400">Threat Radar</CardTitle>
            <CardDescription className="font-mono text-green-400/80">
              Visual representation of vulnerability impact
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[300px]">
              <ThreatRadarChart metrics={metrics} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 pixelated-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-pixel text-green-400">Saved Assessments</CardTitle>
          </div>
          <CardDescription className="font-mono text-green-400/80">
            Your previously saved vulnerability assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SavedAssessments
            assessments={savedAssessments}
            onLoad={handleLoadAssessment}
            onDelete={handleDeleteAssessment}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-800 pixelated-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-pixel text-green-400">Historical Comparison</CardTitle>
          </div>
          <CardDescription className="font-mono text-green-400/80">
            Compare scores across multiple assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <HistoricalComparison
              assessments={savedAssessments}
              currentScore={scores.finalScore}
              currentVector={vector}
            />
          </div>
        </CardContent>
      </Card>

      {showSaveDialog && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="bg-gray-800 text-green-400 pixelated-border">
            <DialogHeader>
              <DialogTitle className="font-pixel">Save Assessment</DialogTitle>
              <DialogDescription className="font-mono">
                Enter a name for this vulnerability assessment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assessment-name" className="font-pixel">
                  Assessment Name
                </Label>
                <Input
                  id="assessment-name"
                  placeholder="e.g., CVE-2023-1234"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  className="font-mono bg-gray-700 border-green-400 pixelated-border"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="font-pixel pixelated-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAssessment}
                  className="font-pixel pixelated-border bg-green-600 hover:bg-green-500 text-black"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showPdfPreview && (
        <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
          <DialogContent className="bg-gray-800 text-green-400 pixelated-border max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="font-pixel">CVSS 4.0 Report</DialogTitle>
              <DialogDescription className="font-mono">
                Preview and download your vulnerability assessment report
              </DialogDescription>
            </DialogHeader>
            <div className="h-[70vh] overflow-auto">
              <PdfReport metrics={metrics} scores={scores} vector={vector} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showScoreExplanation && (
        <Dialog open={showScoreExplanation} onOpenChange={setShowScoreExplanation}>
          <DialogContent className="bg-gray-800 text-green-400 pixelated-border max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="font-pixel">Score Explanation</DialogTitle>
              <DialogDescription className="font-mono">
                Detailed explanation of how your CVSS score was calculated
              </DialogDescription>
            </DialogHeader>
            <div className="h-[70vh] overflow-auto">
              <ScoreExplanation metrics={metrics} scores={scores} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
