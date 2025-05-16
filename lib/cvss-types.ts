export interface CvssMetrics {
  // Base Metrics
  attackVector: string
  attackComplexity: string
  attackRequirements: string
  privilegesRequired: string
  userInteraction: string
  confidentialityImpact: string
  integrityImpact: string
  availabilityImpact: string

  // Threat Metrics
  subsequentConfidentialityImpact: string
  subsequentIntegrityImpact: string
  subsequentAvailabilityImpact: string
  exploit: string

  // Environmental Metrics
  confidentialityRequirement: string
  integrityRequirement: string
  availabilityRequirement: string
  modifiedAttackVector: string
  modifiedAttackComplexity: string
  modifiedAttackRequirements: string
  modifiedPrivilegesRequired: string
  modifiedUserInteraction: string
  modifiedConfidentialityImpact: string
  modifiedIntegrityImpact: string
  modifiedAvailabilityImpact: string
  modifiedSubsequentConfidentialityImpact: string
  modifiedSubsequentIntegrityImpact: string
  modifiedSubsequentAvailabilityImpact: string

  // Supplemental Metrics
  safety: string
  automatable: string
  recovery: string
  valueDensity: string
  responseEffort: string
  providerUrgency: string
}

export interface SavedAssessment {
  id: string
  name: string
  date: string
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

export const defaultMetrics: CvssMetrics = {
  // Base Metrics
  attackVector: "N",
  attackComplexity: "L",
  attackRequirements: "N",
  privilegesRequired: "N",
  userInteraction: "N",
  confidentialityImpact: "H",
  integrityImpact: "H",
  availabilityImpact: "H",

  // Threat Metrics
  subsequentConfidentialityImpact: "N",
  subsequentIntegrityImpact: "N",
  subsequentAvailabilityImpact: "N",
  exploit: "X",

  // Environmental Metrics
  confidentialityRequirement: "X",
  integrityRequirement: "X",
  availabilityRequirement: "X",
  modifiedAttackVector: "X",
  modifiedAttackComplexity: "X",
  modifiedAttackRequirements: "X",
  modifiedPrivilegesRequired: "X",
  modifiedUserInteraction: "X",
  modifiedConfidentialityImpact: "X",
  modifiedIntegrityImpact: "X",
  modifiedAvailabilityImpact: "X",
  modifiedSubsequentConfidentialityImpact: "X",
  modifiedSubsequentIntegrityImpact: "X",
  modifiedSubsequentAvailabilityImpact: "X",

  // Supplemental Metrics
  safety: "X",
  automatable: "X",
  recovery: "X",
  valueDensity: "X",
  responseEffort: "X",
  providerUrgency: "X",
}
