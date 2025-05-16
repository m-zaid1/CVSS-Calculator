import type { CvssMetrics } from "./cvss-types"

// CVSS 4.0 metric weights
const CVSS_WEIGHTS = {
  // Attack Vector (AV)
  AV: {
    N: 0.85, // Network
    A: 0.62, // Adjacent
    L: 0.55, // Local
    P: 0.2, // Physical
  },
  // Attack Complexity (AC)
  AC: {
    L: 0.77, // Low
    H: 0.44, // High
  },
  // Attack Requirements (AT)
  AT: {
    N: 0.86, // None
    P: 0.77, // Present
  },
  // Privileges Required (PR)
  PR: {
    N: 0.85, // None
    L: 0.62, // Low
    H: 0.27, // High
  },
  // User Interaction (UI)
  UI: {
    N: 0.85, // None
    P: 0.62, // Passive
    A: 0.43, // Active
  },
  // Impact values (for VC, VI, VA, SC, SI, SA)
  Impact: {
    H: 0.56, // High
    L: 0.22, // Low
    N: 0, // None
  },
  // Exploit Maturity (E)
  E: {
    A: 1.0, // Attacked
    P: 0.94, // PoC
    U: 0.91, // Unreported
    X: 1.0, // Not Defined
  },
  // Security Requirements (CR, IR, AR)
  Req: {
    H: 1.5, // High
    M: 1.0, // Medium
    L: 0.5, // Low
    X: 1.0, // Not Defined
  },
  // Supplemental Metrics
  // Safety (S)
  S: {
    N: 1.0, // Negligible
    P: 1.1, // Present
    X: 1.0, // Not Defined
  },
  // Automatable (AU)
  AU: {
    N: 0.95, // No
    Y: 1.05, // Yes
    X: 1.0, // Not Defined
  },
  // Recovery (R)
  R: {
    A: 0.9, // Automatic
    U: 1.0, // User
    I: 1.1, // Irrecoverable
    X: 1.0, // Not Defined
  },
  // Value Density (V)
  V: {
    D: 0.9, // Diffuse
    C: 1.1, // Concentrated
    X: 1.0, // Not Defined
  },
  // Response Effort (RE)
  RE: {
    L: 0.9, // Low
    M: 1.0, // Moderate
    H: 1.1, // High
    X: 1.0, // Not Defined
  },
  // Provider Urgency (U)
  U: {
    C: 0.8, // Clear
    G: 0.9, // Green
    A: 1.0, // Amber
    R: 1.1, // Red
    X: 1.0, // Not Defined
  },
}

// Helper function to round up to 1 decimal place
const roundUp = (value: number): number => {
  return Math.ceil(value * 10) / 10
}

// Calculate the Base Score
const calculateBaseScore = (metrics: CvssMetrics): number => {
  // Calculate Exploitability
  const exploitability =
    8.22 *
    CVSS_WEIGHTS.AV[metrics.attackVector as keyof typeof CVSS_WEIGHTS.AV] *
    CVSS_WEIGHTS.AC[metrics.attackComplexity as keyof typeof CVSS_WEIGHTS.AC] *
    CVSS_WEIGHTS.AT[metrics.attackRequirements as keyof typeof CVSS_WEIGHTS.AT] *
    CVSS_WEIGHTS.PR[metrics.privilegesRequired as keyof typeof CVSS_WEIGHTS.PR] *
    CVSS_WEIGHTS.UI[metrics.userInteraction as keyof typeof CVSS_WEIGHTS.UI]

  // Calculate Impact
  const confidentialityImpact = CVSS_WEIGHTS.Impact[metrics.confidentialityImpact as keyof typeof CVSS_WEIGHTS.Impact]
  const integrityImpact = CVSS_WEIGHTS.Impact[metrics.integrityImpact as keyof typeof CVSS_WEIGHTS.Impact]
  const availabilityImpact = CVSS_WEIGHTS.Impact[metrics.availabilityImpact as keyof typeof CVSS_WEIGHTS.Impact]

  const impact = 1 - (1 - confidentialityImpact) * (1 - integrityImpact) * (1 - availabilityImpact)

  // Calculate Base Score
  return roundUp(Math.min(exploitability * impact, 10))
}

// Calculate the Threat Score
const calculateThreatScore = (metrics: CvssMetrics, baseScore: number): number => {
  // If Exploit is not defined, return the Base Score
  if (
    metrics.exploit === "X" &&
    metrics.subsequentConfidentialityImpact === "N" &&
    metrics.subsequentIntegrityImpact === "N" &&
    metrics.subsequentAvailabilityImpact === "N"
  ) {
    return baseScore
  }

  // Calculate Exploitability
  const exploitability =
    8.22 *
    CVSS_WEIGHTS.AV[metrics.attackVector as keyof typeof CVSS_WEIGHTS.AV] *
    CVSS_WEIGHTS.AC[metrics.attackComplexity as keyof typeof CVSS_WEIGHTS.AC] *
    CVSS_WEIGHTS.AT[metrics.attackRequirements as keyof typeof CVSS_WEIGHTS.AT] *
    CVSS_WEIGHTS.PR[metrics.privilegesRequired as keyof typeof CVSS_WEIGHTS.PR] *
    CVSS_WEIGHTS.UI[metrics.userInteraction as keyof typeof CVSS_WEIGHTS.UI]

  // Calculate Subsequent Impact
  const subsequentConfidentialityImpact =
    CVSS_WEIGHTS.Impact[metrics.subsequentConfidentialityImpact as keyof typeof CVSS_WEIGHTS.Impact]
  const subsequentIntegrityImpact =
    CVSS_WEIGHTS.Impact[metrics.subsequentIntegrityImpact as keyof typeof CVSS_WEIGHTS.Impact]
  const subsequentAvailabilityImpact =
    CVSS_WEIGHTS.Impact[metrics.subsequentAvailabilityImpact as keyof typeof CVSS_WEIGHTS.Impact]

  const subsequentImpact =
    1 - (1 - subsequentConfidentialityImpact) * (1 - subsequentIntegrityImpact) * (1 - subsequentAvailabilityImpact)

  // Get Exploit Factor
  const exploitFactor = CVSS_WEIGHTS.E[metrics.exploit as keyof typeof CVSS_WEIGHTS.E]

  // Calculate Threat Score
  return roundUp(Math.min(baseScore + exploitability * subsequentImpact * exploitFactor, 10))
}

// Calculate the Environmental Score
const calculateEnvironmentalScore = (metrics: CvssMetrics, baseScore: number, threatScore: number): number => {
  // Check if any Environmental metrics are defined
  const hasEnvironmentalMetrics =
    metrics.confidentialityRequirement !== "X" ||
    metrics.integrityRequirement !== "X" ||
    metrics.availabilityRequirement !== "X" ||
    metrics.modifiedAttackVector !== "X" ||
    metrics.modifiedAttackComplexity !== "X" ||
    metrics.modifiedAttackRequirements !== "X" ||
    metrics.modifiedPrivilegesRequired !== "X" ||
    metrics.modifiedUserInteraction !== "X" ||
    metrics.modifiedConfidentialityImpact !== "X" ||
    metrics.modifiedIntegrityImpact !== "X" ||
    metrics.modifiedAvailabilityImpact !== "X" ||
    metrics.modifiedSubsequentConfidentialityImpact !== "X" ||
    metrics.modifiedSubsequentIntegrityImpact !== "X" ||
    metrics.modifiedSubsequentAvailabilityImpact !== "X"

  if (!hasEnvironmentalMetrics) {
    return threatScore
  }

  // Get modified values or use base values if not defined
  const modifiedAttackVector =
    metrics.modifiedAttackVector === "X" ? metrics.attackVector : metrics.modifiedAttackVector
  const modifiedAttackComplexity =
    metrics.modifiedAttackComplexity === "X" ? metrics.attackComplexity : metrics.modifiedAttackComplexity
  const modifiedAttackRequirements =
    metrics.modifiedAttackRequirements === "X" ? metrics.attackRequirements : metrics.modifiedAttackRequirements
  const modifiedPrivilegesRequired =
    metrics.modifiedPrivilegesRequired === "X" ? metrics.privilegesRequired : metrics.modifiedPrivilegesRequired
  const modifiedUserInteraction =
    metrics.modifiedUserInteraction === "X" ? metrics.userInteraction : metrics.modifiedUserInteraction
  const modifiedConfidentialityImpact =
    metrics.modifiedConfidentialityImpact === "X"
      ? metrics.confidentialityImpact
      : metrics.modifiedConfidentialityImpact
  const modifiedIntegrityImpact =
    metrics.modifiedIntegrityImpact === "X" ? metrics.integrityImpact : metrics.modifiedIntegrityImpact
  const modifiedAvailabilityImpact =
    metrics.modifiedAvailabilityImpact === "X" ? metrics.availabilityImpact : metrics.modifiedAvailabilityImpact
  const modifiedSubsequentConfidentialityImpact =
    metrics.modifiedSubsequentConfidentialityImpact === "X"
      ? metrics.subsequentConfidentialityImpact
      : metrics.modifiedSubsequentConfidentialityImpact
  const modifiedSubsequentIntegrityImpact =
    metrics.modifiedSubsequentIntegrityImpact === "X"
      ? metrics.subsequentIntegrityImpact
      : metrics.modifiedSubsequentIntegrityImpact
  const modifiedSubsequentAvailabilityImpact =
    metrics.modifiedSubsequentAvailabilityImpact === "X"
      ? metrics.subsequentAvailabilityImpact
      : metrics.modifiedSubsequentAvailabilityImpact

  // Calculate Modified Exploitability
  const modifiedExploitability =
    8.22 *
    CVSS_WEIGHTS.AV[modifiedAttackVector as keyof typeof CVSS_WEIGHTS.AV] *
    CVSS_WEIGHTS.AC[modifiedAttackComplexity as keyof typeof CVSS_WEIGHTS.AC] *
    CVSS_WEIGHTS.AT[modifiedAttackRequirements as keyof typeof CVSS_WEIGHTS.AT] *
    CVSS_WEIGHTS.PR[modifiedPrivilegesRequired as keyof typeof CVSS_WEIGHTS.PR] *
    CVSS_WEIGHTS.UI[modifiedUserInteraction as keyof typeof CVSS_WEIGHTS.UI]

  // Get Security Requirements
  const confidentialityRequirement =
    CVSS_WEIGHTS.Req[metrics.confidentialityRequirement as keyof typeof CVSS_WEIGHTS.Req]
  const integrityRequirement = CVSS_WEIGHTS.Req[metrics.integrityRequirement as keyof typeof CVSS_WEIGHTS.Req]
  const availabilityRequirement = CVSS_WEIGHTS.Req[metrics.availabilityRequirement as keyof typeof CVSS_WEIGHTS.Req]

  // Calculate Modified Impact with Security Requirements
  const modifiedConfImpact =
    CVSS_WEIGHTS.Impact[modifiedConfidentialityImpact as keyof typeof CVSS_WEIGHTS.Impact] * confidentialityRequirement
  const modifiedIntImpact =
    CVSS_WEIGHTS.Impact[modifiedIntegrityImpact as keyof typeof CVSS_WEIGHTS.Impact] * integrityRequirement
  const modifiedAvailImpact =
    CVSS_WEIGHTS.Impact[modifiedAvailabilityImpact as keyof typeof CVSS_WEIGHTS.Impact] * availabilityRequirement

  const modifiedImpact =
    1 -
    (1 - Math.min(modifiedConfImpact, 0.915)) *
      (1 - Math.min(modifiedIntImpact, 0.915)) *
      (1 - Math.min(modifiedAvailImpact, 0.915))

  // Calculate Modified Base Score
  const modifiedBaseScore = roundUp(Math.min(modifiedExploitability * modifiedImpact, 10))

  // Calculate Modified Subsequent Impact
  const modifiedSubConfImpact =
    CVSS_WEIGHTS.Impact[modifiedSubsequentConfidentialityImpact as keyof typeof CVSS_WEIGHTS.Impact] *
    confidentialityRequirement
  const modifiedSubIntImpact =
    CVSS_WEIGHTS.Impact[modifiedSubsequentIntegrityImpact as keyof typeof CVSS_WEIGHTS.Impact] * integrityRequirement
  const modifiedSubAvailImpact =
    CVSS_WEIGHTS.Impact[modifiedSubsequentAvailabilityImpact as keyof typeof CVSS_WEIGHTS.Impact] *
    availabilityRequirement

  const modifiedSubsequentImpact =
    1 -
    (1 - Math.min(modifiedSubConfImpact, 0.915)) *
      (1 - Math.min(modifiedSubIntImpact, 0.915)) *
      (1 - Math.min(modifiedSubAvailImpact, 0.915))

  // Get Exploit Factor
  const exploitFactor = CVSS_WEIGHTS.E[metrics.exploit as keyof typeof CVSS_WEIGHTS.E]

  // Calculate Environmental Score
  return roundUp(Math.min(modifiedBaseScore + modifiedExploitability * modifiedSubsequentImpact * exploitFactor, 10))
}

// Calculate the Supplemental Score
const calculateSupplementalScore = (metrics: CvssMetrics, baseScore: number): number => {
  // Get supplemental factors
  const safetyFactor = CVSS_WEIGHTS.S[metrics.safety as keyof typeof CVSS_WEIGHTS.S]
  const automatableFactor = CVSS_WEIGHTS.AU[metrics.automatable as keyof typeof CVSS_WEIGHTS.AU]
  const recoveryFactor = CVSS_WEIGHTS.R[metrics.recovery as keyof typeof CVSS_WEIGHTS.R]
  const valueDensityFactor = CVSS_WEIGHTS.V[metrics.valueDensity as keyof typeof CVSS_WEIGHTS.V]
  const responseEffortFactor = CVSS_WEIGHTS.RE[metrics.responseEffort as keyof typeof CVSS_WEIGHTS.RE]
  const providerUrgencyFactor = CVSS_WEIGHTS.U[metrics.providerUrgency as keyof typeof CVSS_WEIGHTS.U]

  // Calculate Supplemental Score
  const supplementalScore =
    baseScore *
    safetyFactor *
    automatableFactor *
    recoveryFactor *
    valueDensityFactor *
    responseEffortFactor *
    providerUrgencyFactor

  return roundUp(Math.min(supplementalScore, 10))
}

// Determine severity rating based on score
const getSeverityRating = (score: number): string => {
  if (score === 0) return "None"
  if (score < 4.0) return "Low"
  if (score < 7.0) return "Medium"
  if (score < 9.0) return "High"
  return "Critical"
}

// Main function to calculate CVSS score
export const calculateCvssScore = (metrics: CvssMetrics) => {
  const baseScore = calculateBaseScore(metrics)
  const threatScore = calculateThreatScore(metrics, baseScore)
  const environmentalScore = calculateEnvironmentalScore(metrics, baseScore, threatScore)
  const supplementalScore = calculateSupplementalScore(metrics, baseScore)

  // Determine final score
  let finalScore = baseScore
  if (
    metrics.exploit !== "X" ||
    metrics.subsequentConfidentialityImpact !== "N" ||
    metrics.subsequentIntegrityImpact !== "N" ||
    metrics.subsequentAvailabilityImpact !== "N"
  ) {
    finalScore = threatScore
  }

  if (
    metrics.confidentialityRequirement !== "X" ||
    metrics.integrityRequirement !== "X" ||
    metrics.availabilityRequirement !== "X" ||
    metrics.modifiedAttackVector !== "X" ||
    metrics.modifiedAttackComplexity !== "X" ||
    metrics.modifiedAttackRequirements !== "X" ||
    metrics.modifiedPrivilegesRequired !== "X" ||
    metrics.modifiedUserInteraction !== "X" ||
    metrics.modifiedConfidentialityImpact !== "X" ||
    metrics.modifiedIntegrityImpact !== "X" ||
    metrics.modifiedAvailabilityImpact !== "X" ||
    metrics.modifiedSubsequentConfidentialityImpact !== "X" ||
    metrics.modifiedSubsequentIntegrityImpact !== "X" ||
    metrics.modifiedSubsequentAvailabilityImpact !== "X"
  ) {
    finalScore = environmentalScore
  }

  const severity = getSeverityRating(finalScore)

  return {
    baseScore,
    threatScore,
    environmentalScore,
    supplementalScore,
    finalScore,
    severity,
  }
}
