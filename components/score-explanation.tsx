"use client"

import { useEffect, useState } from "react"
import type { CvssMetrics } from "@/lib/cvss-types"

interface ScoreExplanationProps {
  metrics: CvssMetrics
  scores: {
    baseScore: number
    threatScore: number
    environmentalScore: number
    supplementalScore: number
    finalScore: number
    severity: string
  }
}

export default function ScoreExplanation({ metrics, scores }: ScoreExplanationProps) {
  const [explanation, setExplanation] = useState<string>("")

  useEffect(() => {
    // Generate detailed explanation of the score calculation
    const generateExplanation = () => {
      let text = `# CVSS 4.0 Score Calculation Explanation\n\n`

      // Base Score explanation
      text += `## Base Score: ${scores.baseScore.toFixed(1)}\n\n`
      text += `The Base Score represents the intrinsic qualities of a vulnerability that are constant over time and across user environments.\n\n`

      text += `### Exploitability Metrics:\n`
      text += `- Attack Vector (AV): ${metrics.attackVector}\n`
      text += `- Attack Complexity (AC): ${metrics.attackComplexity}\n`
      text += `- Attack Requirements (AT): ${metrics.attackRequirements}\n`
      text += `- Privileges Required (PR): ${metrics.privilegesRequired}\n`
      text += `- User Interaction (UI): ${metrics.userInteraction}\n\n`

      text += `### Impact Metrics:\n`
      text += `- Confidentiality Impact (VC): ${metrics.confidentialityImpact}\n`
      text += `- Integrity Impact (VI): ${metrics.integrityImpact}\n`
      text += `- Availability Impact (VA): ${metrics.availabilityImpact}\n\n`

      text += `### Subsequent System Impact Metrics:\n`
      text += `- Subsequent Confidentiality Impact (SC): ${metrics.subsequentConfidentialityImpact}\n`
      text += `- Subsequent Integrity Impact (SI): ${metrics.subsequentIntegrityImpact}\n`
      text += `- Subsequent Availability Impact (SA): ${metrics.subsequentAvailabilityImpact}\n\n`

      // Threat Score explanation
      text += `## Threat Score: ${scores.threatScore.toFixed(1)}\n\n`
      text += `The Threat Score incorporates the Base Score and adds information about exploit maturity.\n\n`

      text += `### Exploit Maturity:\n`
      text += `- Exploit (E): ${metrics.exploit}\n\n`

      // Environmental Score explanation
      text += `## Environmental Score: ${scores.environmentalScore.toFixed(1)}\n\n`
      text += `The Environmental Score customizes the Base and Threat Scores based on the importance of the affected IT asset to your organization.\n\n`

      text += `### Security Requirements:\n`
      text += `- Confidentiality Requirement (CR): ${metrics.confidentialityRequirement}\n`
      text += `- Integrity Requirement (IR): ${metrics.integrityRequirement}\n`
      text += `- Availability Requirement (AR): ${metrics.availabilityRequirement}\n\n`

      text += `### Modified Base Metrics:\n`
      text += `- Modified Attack Vector (MAV): ${metrics.modifiedAttackVector}\n`
      text += `- Modified Attack Complexity (MAC): ${metrics.modifiedAttackComplexity}\n`
      text += `- Modified Attack Requirements (MAT): ${metrics.modifiedAttackRequirements}\n`
      text += `- Modified Privileges Required (MPR): ${metrics.modifiedPrivilegesRequired}\n`
      text += `- Modified User Interaction (MUI): ${metrics.modifiedUserInteraction}\n`
      text += `- Modified Confidentiality Impact (MVC): ${metrics.modifiedConfidentialityImpact}\n`
      text += `- Modified Integrity Impact (MVI): ${metrics.modifiedIntegrityImpact}\n`
      text += `- Modified Availability Impact (MVA): ${metrics.modifiedAvailabilityImpact}\n\n`

      text += `### Modified Subsequent System Impact Metrics:\n`
      text += `- Modified Subsequent Confidentiality Impact (MSC): ${metrics.modifiedSubsequentConfidentialityImpact}\n`
      text += `- Modified Subsequent Integrity Impact (MSI): ${metrics.modifiedSubsequentIntegrityImpact}\n`
      text += `- Modified Subsequent Availability Impact (MSA): ${metrics.modifiedSubsequentAvailabilityImpact}\n\n`

      // Supplemental Score explanation
      text += `## Supplemental Score: ${scores.supplementalScore.toFixed(1)}\n\n`
      text += `The Supplemental Score provides additional context that may affect the score.\n\n`

      text += `### Supplemental Metrics:\n`
      text += `- Safety (S): ${metrics.safety}\n`
      text += `- Automatable (AU): ${metrics.automatable}\n`
      text += `- Recovery (R): ${metrics.recovery}\n`
      text += `- Value Density (V): ${metrics.valueDensity}\n`
      text += `- Response Effort (RE): ${metrics.responseEffort}\n`
      text += `- Provider Urgency (U): ${metrics.providerUrgency}\n\n`

      // Final Score explanation
      text += `## Final Score: ${scores.finalScore.toFixed(1)}\n\n`

      if (scores.finalScore === scores.environmentalScore && scores.environmentalScore !== scores.baseScore) {
        text += `The Final Score is equal to the Environmental Score because environmental metrics have been defined.\n\n`
      } else if (scores.finalScore === scores.threatScore && scores.threatScore !== scores.baseScore) {
        text += `The Final Score is equal to the Threat Score because threat metrics have been defined but no environmental metrics.\n\n`
      } else {
        text += `The Final Score is equal to the Base Score because neither threat nor environmental metrics have been defined.\n\n`
      }

      // Severity Rating explanation
      text += `## Severity Rating: ${scores.severity}\n\n`
      text += `The severity rating is determined by the Final Score:\n`
      text += `- 0.0: None\n`
      text += `- 0.1-3.9: Low\n`
      text += `- 4.0-6.9: Medium\n`
      text += `- 7.0-8.9: High\n`
      text += `- 9.0-10.0: Critical\n\n`

      return text
    }

    setExplanation(generateExplanation())
  }, [metrics, scores])

  // Helper function to get color based on metric value
  const getMetricColor = (value: string) => {
    switch (value) {
      case "H":
        return "text-red-400"
      case "M":
        return "text-yellow-400"
      case "L":
        return "text-blue-400"
      case "N":
        return "text-gray-400"
      case "P":
        return "text-purple-400"
      case "A":
        return "text-orange-400"
      case "Y":
        return "text-green-400"
      case "X":
        return "text-gray-400"
      default:
        return "text-green-400"
    }
  }

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return "text-red-500 font-bold"
    if (score >= 7.0) return "text-orange-500 font-bold"
    if (score >= 4.0) return "text-yellow-500 font-bold"
    if (score > 0.0) return "text-blue-500 font-bold"
    return "text-gray-500 font-bold"
  }

  return (
    <div className="space-y-4 font-sans text-green-400">
      <h2 className="text-2xl font-pixel mb-4">CVSS 4.0 Score Calculation Explanation</h2>

      <div className="bg-gray-800/50 p-4 rounded-lg pixelated-border">
        <h3 className="text-xl font-pixel mb-2">Score Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="text-sm mb-1">Base Score</div>
            <div className={getScoreColor(scores.baseScore)}>{scores.baseScore.toFixed(1)}</div>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="text-sm mb-1">Threat Score</div>
            <div className={getScoreColor(scores.threatScore)}>{scores.threatScore.toFixed(1)}</div>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="text-sm mb-1">Environmental</div>
            <div className={getScoreColor(scores.environmentalScore)}>{scores.environmentalScore.toFixed(1)}</div>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="text-sm mb-1">Supplemental</div>
            <div className={getScoreColor(scores.supplementalScore)}>{scores.supplementalScore.toFixed(1)}</div>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="text-sm mb-1">Final Score</div>
            <div className={getScoreColor(scores.finalScore)}>{scores.finalScore.toFixed(1)}</div>
          </div>
        </div>

        <div className="bg-gray-700/50 p-3 rounded-lg text-center mb-4">
          <div className="text-sm mb-1">Severity Rating</div>
          <div
            className={`text-lg font-bold ${
              scores.severity === "Critical"
                ? "text-red-500"
                : scores.severity === "High"
                  ? "text-orange-500"
                  : scores.severity === "Medium"
                    ? "text-yellow-500"
                    : scores.severity === "Low"
                      ? "text-blue-500"
                      : "text-gray-500"
            }`}
          >
            {scores.severity}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg pixelated-border">
        <h3 className="text-xl font-pixel mb-2">Base Metrics</h3>

        <div className="mb-4">
          <h4 className="text-lg font-pixel text-green-400/80 mb-2">Exploitability Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Attack Vector (AV)</div>
              <div className={getMetricColor(metrics.attackVector)}>{metrics.attackVector}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Attack Complexity (AC)</div>
              <div className={getMetricColor(metrics.attackComplexity)}>{metrics.attackComplexity}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Attack Requirements (AT)</div>
              <div className={getMetricColor(metrics.attackRequirements)}>{metrics.attackRequirements}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Privileges Required (PR)</div>
              <div className={getMetricColor(metrics.privilegesRequired)}>{metrics.privilegesRequired}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">User Interaction (UI)</div>
              <div className={getMetricColor(metrics.userInteraction)}>{metrics.userInteraction}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-pixel text-green-400/80 mb-2">Vulnerable System Impact Metrics</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Confidentiality (VC)</div>
              <div className={getMetricColor(metrics.confidentialityImpact)}>{metrics.confidentialityImpact}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Integrity (VI)</div>
              <div className={getMetricColor(metrics.integrityImpact)}>{metrics.integrityImpact}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Availability (VA)</div>
              <div className={getMetricColor(metrics.availabilityImpact)}>{metrics.availabilityImpact}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-pixel text-green-400/80 mb-2">Subsequent System Impact Metrics</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Confidentiality (SC)</div>
              <div className={getMetricColor(metrics.subsequentConfidentialityImpact)}>
                {metrics.subsequentConfidentialityImpact}
              </div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Integrity (SI)</div>
              <div className={getMetricColor(metrics.subsequentIntegrityImpact)}>
                {metrics.subsequentIntegrityImpact}
              </div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Availability (SA)</div>
              <div className={getMetricColor(metrics.subsequentAvailabilityImpact)}>
                {metrics.subsequentAvailabilityImpact}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg pixelated-border">
        <h3 className="text-xl font-pixel mb-2">Threat Metrics</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Exploit Maturity (E)</div>
            <div className={getMetricColor(metrics.exploit)}>{metrics.exploit}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg pixelated-border">
        <h3 className="text-xl font-pixel mb-2">Environmental Metrics</h3>

        <div className="mb-4">
          <h4 className="text-lg font-pixel text-green-400/80 mb-2">Security Requirements</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Confidentiality (CR)</div>
              <div className={getMetricColor(metrics.confidentialityRequirement)}>
                {metrics.confidentialityRequirement}
              </div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Integrity (IR)</div>
              <div className={getMetricColor(metrics.integrityRequirement)}>{metrics.integrityRequirement}</div>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="text-sm">Availability (AR)</div>
              <div className={getMetricColor(metrics.availabilityRequirement)}>{metrics.availabilityRequirement}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-pixel text-green-400/80 mb-2">Modified Metrics</h4>
          <p className="text-sm mb-2">
            These metrics allow you to customize the base metrics for your specific environment.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries({
              MAV: metrics.modifiedAttackVector,
              MAC: metrics.modifiedAttackComplexity,
              MAT: metrics.modifiedAttackRequirements,
              MPR: metrics.modifiedPrivilegesRequired,
              MUI: metrics.modifiedUserInteraction,
              MVC: metrics.modifiedConfidentialityImpact,
              MVI: metrics.modifiedIntegrityImpact,
              MVA: metrics.modifiedAvailabilityImpact,
              MSC: metrics.modifiedSubsequentConfidentialityImpact,
              MSI: metrics.modifiedSubsequentIntegrityImpact,
              MSA: metrics.modifiedSubsequentAvailabilityImpact,
            }).map(([key, value]) => (
              <div key={key} className="bg-gray-700/50 p-2 rounded-lg">
                <div className="text-sm">{key}</div>
                <div className={getMetricColor(value)}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg pixelated-border">
        <h3 className="text-xl font-pixel mb-2">Supplemental Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Safety (S)</div>
            <div className={getMetricColor(metrics.safety)}>{metrics.safety}</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Automatable (AU)</div>
            <div className={getMetricColor(metrics.automatable)}>{metrics.automatable}</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Recovery (R)</div>
            <div className={getMetricColor(metrics.recovery)}>{metrics.recovery}</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Value Density (V)</div>
            <div className={getMetricColor(metrics.valueDensity)}>{metrics.valueDensity}</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Response Effort (RE)</div>
            <div className={getMetricColor(metrics.responseEffort)}>{metrics.responseEffort}</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg">
            <div className="text-sm">Provider Urgency (U)</div>
            <div className={getMetricColor(metrics.providerUrgency)}>{metrics.providerUrgency}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg pixelated-border">
        <h3 className="text-xl font-pixel mb-2">Final Score Determination</h3>
        <p className="mb-2">
          {scores.finalScore === scores.environmentalScore && scores.environmentalScore !== scores.baseScore
            ? "The Final Score is equal to the Environmental Score because environmental metrics have been defined."
            : scores.finalScore === scores.threatScore && scores.threatScore !== scores.baseScore
              ? "The Final Score is equal to the Threat Score because threat metrics have been defined but no environmental metrics."
              : "The Final Score is equal to the Base Score because neither threat nor environmental metrics have been defined."}
        </p>

        <h4 className="text-lg font-pixel text-green-400/80 mt-4 mb-2">Severity Rating Scale</h4>
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-gray-700/50 p-2 rounded-lg text-center">
            <div className="text-sm">None</div>
            <div className="text-gray-400">0.0</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg text-center">
            <div className="text-sm">Low</div>
            <div className="text-blue-400">0.1-3.9</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg text-center">
            <div className="text-sm">Medium</div>
            <div className="text-yellow-400">4.0-6.9</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg text-center">
            <div className="text-sm">High</div>
            <div className="text-orange-400">7.0-8.9</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-lg text-center">
            <div className="text-sm">Critical</div>
            <div className="text-red-400">9.0-10.0</div>
          </div>
        </div>
      </div>
    </div>
  )
}
