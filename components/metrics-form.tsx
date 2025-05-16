"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { CvssMetrics } from "@/lib/cvss-types"

interface MetricsFormProps {
  metrics: CvssMetrics
  onChange: (metrics: Partial<CvssMetrics>) => void
  activeTab: string
}

export default function MetricsForm({ metrics, onChange, activeTab }: MetricsFormProps) {
  const renderMetricRadioGroup = (
    id: string,
    label: string,
    description: string,
    options: { value: string; label: string }[],
    value: string,
    onChange: (value: string) => void,
  ) => {
    return (
      <div className="mb-4 bg-gray-700/50 p-3 rounded-lg pixelated-border">
        <div className="flex items-center mb-2">
          <Label htmlFor={id} className="font-pixel text-green-400 mr-2 text-base">
            {label}
          </Label>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-green-400/70 hover:text-green-400">
                <HelpCircle className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-green-400 pixelated-border">
              <DialogHeader>
                <DialogTitle className="font-pixel">{label}</DialogTitle>
                <DialogDescription className="font-sans text-green-400/90">{description}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
                className="border-green-400 text-green-400"
              />
              <Label htmlFor={`${id}-${option.value}`} className="font-sans text-green-400 cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  const renderSectionHeading = (title: string) => (
    <h3 className="font-pixel text-green-400 text-lg mb-3 mt-5 border-b border-green-400/30 pb-1">{title}</h3>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
      {activeTab === "base" && (
        <>
          {renderSectionHeading("Exploitability Metrics")}

          {renderMetricRadioGroup(
            "attack-vector",
            "Attack Vector (AV)",
            "This metric reflects the context by which vulnerability exploitation is possible.",
            [
              { value: "N", label: "Network (N)" },
              { value: "A", label: "Adjacent (A)" },
              { value: "L", label: "Local (L)" },
              { value: "P", label: "Physical (P)" },
            ],
            metrics.attackVector,
            (value) => onChange({ attackVector: value }),
          )}

          {renderMetricRadioGroup(
            "attack-complexity",
            "Attack Complexity (AC)",
            "This metric describes the conditions beyond the attacker's control that must exist in order to exploit the vulnerability.",
            [
              { value: "L", label: "Low (L)" },
              { value: "H", label: "High (H)" },
            ],
            metrics.attackComplexity,
            (value) => onChange({ attackComplexity: value }),
          )}

          {renderMetricRadioGroup(
            "attack-requirements",
            "Attack Requirements (AT)",
            "This metric captures the prerequisite attack components that must already be present in the vulnerable system.",
            [
              { value: "N", label: "None (N)" },
              { value: "P", label: "Present (P)" },
            ],
            metrics.attackRequirements,
            (value) => onChange({ attackRequirements: value }),
          )}

          {renderMetricRadioGroup(
            "privileges-required",
            "Privileges Required (PR)",
            "This metric describes the level of privileges an attacker must possess before successfully exploiting the vulnerability.",
            [
              { value: "N", label: "None (N)" },
              { value: "L", label: "Low (L)" },
              { value: "H", label: "High (H)" },
            ],
            metrics.privilegesRequired,
            (value) => onChange({ privilegesRequired: value }),
          )}

          {renderMetricRadioGroup(
            "user-interaction",
            "User Interaction (UI)",
            "This metric captures the requirement for a human user, other than the attacker, to participate in the successful compromise.",
            [
              { value: "N", label: "None (N)" },
              { value: "P", label: "Passive (P)" },
              { value: "A", label: "Active (A)" },
            ],
            metrics.userInteraction,
            (value) => onChange({ userInteraction: value }),
          )}

          {renderSectionHeading("Vulnerable System Impact Metrics")}

          {renderMetricRadioGroup(
            "confidentiality-impact",
            "Confidentiality Impact (VC)",
            "This metric measures the impact to the confidentiality of the information resources managed by a system.",
            [
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.confidentialityImpact,
            (value) => onChange({ confidentialityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "integrity-impact",
            "Integrity Impact (VI)",
            "This metric measures the impact to integrity of a successfully exploited vulnerability.",
            [
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.integrityImpact,
            (value) => onChange({ integrityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "availability-impact",
            "Availability Impact (VA)",
            "This metric measures the impact to the availability of the affected system.",
            [
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.availabilityImpact,
            (value) => onChange({ availabilityImpact: value }),
          )}

          {renderSectionHeading("Subsequent System Impact Metrics")}

          {renderMetricRadioGroup(
            "subsequent-confidentiality-impact",
            "Subsequent Confidentiality Impact (SC)",
            "This metric measures the impact to the confidentiality of the resources managed by other components.",
            [
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.subsequentConfidentialityImpact,
            (value) => onChange({ subsequentConfidentialityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "subsequent-integrity-impact",
            "Subsequent Integrity Impact (SI)",
            "This metric measures the impact to the integrity of the resources managed by other components.",
            [
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.subsequentIntegrityImpact,
            (value) => onChange({ subsequentIntegrityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "subsequent-availability-impact",
            "Subsequent Availability Impact (SA)",
            "This metric measures the impact to the availability of resources managed by other components.",
            [
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.subsequentAvailabilityImpact,
            (value) => onChange({ subsequentAvailabilityImpact: value }),
          )}
        </>
      )}

      {activeTab === "threat" && (
        <>
          {renderSectionHeading("Exploit Maturity")}

          {renderMetricRadioGroup(
            "exploit",
            "Exploit Maturity (E)",
            "This metric measures the likelihood of the vulnerability being attacked based on the current state of exploit techniques.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "A", label: "Attacked (A)" },
              { value: "P", label: "PoC (P)" },
              { value: "U", label: "Unreported (U)" },
            ],
            metrics.exploit,
            (value) => onChange({ exploit: value }),
          )}
        </>
      )}

      {activeTab === "environmental" && (
        <>
          {renderSectionHeading("Security Requirements")}

          {renderMetricRadioGroup(
            "confidentiality-requirement",
            "Confidentiality Requirement (CR)",
            "This metric enables the analyst to customize the CVSS score depending on the importance of confidentiality to the affected system.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "M", label: "Medium (M)" },
              { value: "L", label: "Low (L)" },
            ],
            metrics.confidentialityRequirement,
            (value) => onChange({ confidentialityRequirement: value }),
          )}

          {renderMetricRadioGroup(
            "integrity-requirement",
            "Integrity Requirement (IR)",
            "This metric enables the analyst to customize the CVSS score depending on the importance of integrity to the affected system.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "M", label: "Medium (M)" },
              { value: "L", label: "Low (L)" },
            ],
            metrics.integrityRequirement,
            (value) => onChange({ integrityRequirement: value }),
          )}

          {renderMetricRadioGroup(
            "availability-requirement",
            "Availability Requirement (AR)",
            "This metric enables the analyst to customize the CVSS score depending on the importance of availability to the affected system.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "M", label: "Medium (M)" },
              { value: "L", label: "Low (L)" },
            ],
            metrics.availabilityRequirement,
            (value) => onChange({ availabilityRequirement: value }),
          )}

          {renderSectionHeading("Modified Exploitability Metrics")}

          {renderMetricRadioGroup(
            "modified-attack-vector",
            "Modified Attack Vector (MAV)",
            "This metric reflects the modified context by which vulnerability exploitation is possible.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "N", label: "Network (N)" },
              { value: "A", label: "Adjacent (A)" },
              { value: "L", label: "Local (L)" },
              { value: "P", label: "Physical (P)" },
            ],
            metrics.modifiedAttackVector,
            (value) => onChange({ modifiedAttackVector: value }),
          )}

          {renderMetricRadioGroup(
            "modified-attack-complexity",
            "Modified Attack Complexity (MAC)",
            "This metric describes the modified conditions beyond the attacker's control that must exist in order to exploit the vulnerability.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "L", label: "Low (L)" },
              { value: "H", label: "High (H)" },
            ],
            metrics.modifiedAttackComplexity,
            (value) => onChange({ modifiedAttackComplexity: value }),
          )}

          {renderMetricRadioGroup(
            "modified-attack-requirements",
            "Modified Attack Requirements (MAT)",
            "This metric captures the modified prerequisite attack components that must already be present in the vulnerable system.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "N", label: "None (N)" },
              { value: "P", label: "Present (P)" },
            ],
            metrics.modifiedAttackRequirements,
            (value) => onChange({ modifiedAttackRequirements: value }),
          )}

          {renderMetricRadioGroup(
            "modified-privileges-required",
            "Modified Privileges Required (MPR)",
            "This metric describes the modified level of privileges an attacker must possess before successfully exploiting the vulnerability.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "N", label: "None (N)" },
              { value: "L", label: "Low (L)" },
              { value: "H", label: "High (H)" },
            ],
            metrics.modifiedPrivilegesRequired,
            (value) => onChange({ modifiedPrivilegesRequired: value }),
          )}

          {renderMetricRadioGroup(
            "modified-user-interaction",
            "Modified User Interaction (MUI)",
            "This metric captures the modified requirement for a human user, other than the attacker, to participate in the successful compromise.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "N", label: "None (N)" },
              { value: "P", label: "Passive (P)" },
              { value: "A", label: "Active (A)" },
            ],
            metrics.modifiedUserInteraction,
            (value) => onChange({ modifiedUserInteraction: value }),
          )}

          {renderSectionHeading("Modified Vulnerable System Impact Metrics")}

          {renderMetricRadioGroup(
            "modified-confidentiality-impact",
            "Modified Confidentiality Impact (MVC)",
            "This metric measures the modified impact to the confidentiality of the information resources managed by a system.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.modifiedConfidentialityImpact,
            (value) => onChange({ modifiedConfidentialityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "modified-integrity-impact",
            "Modified Integrity Impact (MVI)",
            "This metric measures the modified impact to integrity of a successfully exploited vulnerability.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.modifiedIntegrityImpact,
            (value) => onChange({ modifiedIntegrityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "modified-availability-impact",
            "Modified Availability Impact (MVA)",
            "This metric measures the modified impact to the availability of the affected system.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.modifiedAvailabilityImpact,
            (value) => onChange({ modifiedAvailabilityImpact: value }),
          )}

          {renderSectionHeading("Modified Subsequent System Impact Metrics")}

          {renderMetricRadioGroup(
            "modified-subsequent-confidentiality-impact",
            "Modified Subsequent Confidentiality Impact (MSC)",
            "This metric measures the modified impact to the confidentiality of the resources managed by other components.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.modifiedSubsequentConfidentialityImpact,
            (value) => onChange({ modifiedSubsequentConfidentialityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "modified-subsequent-integrity-impact",
            "Modified Subsequent Integrity Impact (MSI)",
            "This metric measures the modified impact to the integrity of the resources managed by other components.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.modifiedSubsequentIntegrityImpact,
            (value) => onChange({ modifiedSubsequentIntegrityImpact: value }),
          )}

          {renderMetricRadioGroup(
            "modified-subsequent-availability-impact",
            "Modified Subsequent Availability Impact (MSA)",
            "This metric measures the modified impact to the availability of resources managed by other components.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "H", label: "High (H)" },
              { value: "L", label: "Low (L)" },
              { value: "N", label: "None (N)" },
            ],
            metrics.modifiedSubsequentAvailabilityImpact,
            (value) => onChange({ modifiedSubsequentAvailabilityImpact: value }),
          )}
        </>
      )}

      {activeTab === "supplemental" && (
        <>
          {renderSectionHeading("Supplemental Metrics")}

          {renderMetricRadioGroup(
            "safety",
            "Safety (S)",
            "This metric measures the potential for a vulnerability to cause physical harm to persons or property.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "N", label: "Negligible (N)" },
              { value: "P", label: "Present (P)" },
            ],
            metrics.safety,
            (value) => onChange({ safety: value }),
          )}

          {renderMetricRadioGroup(
            "automatable",
            "Automatable (AU)",
            "This metric measures whether the vulnerability can be exploited through automated means.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "N", label: "No (N)" },
              { value: "Y", label: "Yes (Y)" },
            ],
            metrics.automatable,
            (value) => onChange({ automatable: value }),
          )}

          {renderMetricRadioGroup(
            "recovery",
            "Recovery (R)",
            "This metric measures the ability to recover from a successful exploitation of the vulnerability.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "A", label: "Automatic (A)" },
              { value: "U", label: "User (U)" },
              { value: "I", label: "Irrecoverable (I)" },
            ],
            metrics.recovery,
            (value) => onChange({ recovery: value }),
          )}

          {renderMetricRadioGroup(
            "value-density",
            "Value Density (V)",
            "This metric measures the concentration of valuable assets that could be affected by the vulnerability.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "D", label: "Diffuse (D)" },
              { value: "C", label: "Concentrated (C)" },
            ],
            metrics.valueDensity,
            (value) => onChange({ valueDensity: value }),
          )}

          {renderMetricRadioGroup(
            "response-effort",
            "Response Effort (RE)",
            "This metric measures the effort required to respond to a successful exploitation of the vulnerability.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "L", label: "Low (L)" },
              { value: "M", label: "Moderate (M)" },
              { value: "H", label: "High (H)" },
            ],
            metrics.responseEffort,
            (value) => onChange({ responseEffort: value }),
          )}

          {renderMetricRadioGroup(
            "provider-urgency",
            "Provider Urgency (U)",
            "This metric captures the urgency assigned by the vulnerability provider.",
            [
              { value: "X", label: "Not Defined (X)" },
              { value: "C", label: "Clear" },
              { value: "G", label: "Green" },
              { value: "A", label: "Amber" },
              { value: "R", label: "Red" },
            ],
            metrics.providerUrgency,
            (value) => onChange({ providerUrgency: value }),
          )}
        </>
      )}
    </div>
  )
}
