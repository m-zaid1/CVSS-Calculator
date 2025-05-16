export default function WizardContent() {
  return (
    <div className="space-y-6 font-mono text-green-400">
      <div>
        <h3 className="text-xl font-pixel mb-2">CVSS 4.0 Wizard</h3>
        <p>
          This wizard combines both formula explanations and usage guidance to help you understand and use the CVSS 4.0
          calculator effectively.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Formula Explanation</h4>
        <p>CVSS 4.0 consists of four metric groups, each contributing to the final score:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Base Score: Represents the intrinsic qualities of a vulnerability</li>
          <li>Threat Score: Reflects the current state of exploit techniques and threat factors</li>
          <li>Environmental Score: Customizes the score based on the importance of the affected IT asset</li>
          <li>Supplemental Score: Provides additional context that may affect the score</li>
        </ol>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Base Score Calculation</h4>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`BaseScore = Roundup(Minimum[(EQ × Impact), 10])

Where:
- EQ (Exploitability) = 8.22 × AV × AC × AT × PR × UI
- Impact = 1 - [(1 - VC) × (1 - VI) × (1 - VA)]

AV (Attack Vector) values:
- Network (N): 0.85
- Adjacent (A): 0.62
- Local (L): 0.55
- Physical (P): 0.2

AC (Attack Complexity) values:
- Low (L): 0.77
- High (H): 0.44

AT (Attack Requirements) values:
- None (N): 0.86
- Present (P): 0.77

PR (Privileges Required) values:
- None (N): 0.85
- Low (L): 0.62
- High (H): 0.27

UI (User Interaction) values:
- None (N): 0.85
- Passive (P): 0.62
- Active (A): 0.43

VC/VI/VA (Impact) values:
- High (H): 0.56
- Low (L): 0.22
- None (N): 0`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Threat Score Calculation</h4>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`ThreatScore = Roundup(Minimum[(BaseScore + (EQ × SubsequentScore × ExploitFactor)), 10])

Where:
- SubsequentScore = 1 - [(1 - SC) × (1 - SI) × (1 - SA)]
- ExploitFactor depends on Exploit Maturity (E):
  - Attacked (A): 1.0
  - PoC (P): 0.94
  - Unreported (U): 0.91
  - Not Defined (X): 1.0

SC/SI/SA (Subsequent Impact) values:
- High (H): 0.56
- Low (L): 0.22
- None (N): 0`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Environmental Score Calculation</h4>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`EnvironmentalScore = Roundup(Minimum[(ModifiedBaseScore + (ModifiedEQ × ModifiedSubsequentScore × ExploitFactor)), 10])

Where:
- ModifiedBaseScore uses the same formula as BaseScore but with modified metrics (MAV, MAC, etc.)
- Security Requirements (CR, IR, AR) adjust the impact values:
  - High (H): 1.5
  - Medium (M): 1.0
  - Low (L): 0.5
  - Not Defined (X): 1.0

Modified metrics use the same values as their Base counterparts, or the specified modified value.`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Supplemental Score Calculation</h4>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`SupplementalScore = BaseScore × SafetyFactor × AutomatableFactor × RecoveryFactor × ValueDensityFactor × ResponseEffortFactor × ProviderUrgencyFactor

Where:
- Safety (S): 
  - Present (P): 1.1
  - Negligible (N): 1.0
  - Not Defined (X): 1.0

- Automatable (AU):
  - Yes (Y): 1.05
  - No (N): 0.95
  - Not Defined (X): 1.0

- Recovery (R):
  - Automatic (A): 0.9
  - User (U): 1.0
  - Irrecoverable (I): 1.1
  - Not Defined (X): 1.0

- Value Density (V):
  - Diffuse (D): 0.9
  - Concentrated (C): 1.1
  - Not Defined (X): 1.0

- Response Effort (RE):
  - Low (L): 0.9
  - Moderate (M): 1.0
  - High (H): 1.1
  - Not Defined (X): 1.0

- Provider Urgency (U):
  - Clear: 0.8
  - Green: 0.9
  - Amber: 1.0
  - Red: 1.1
  - Not Defined (X): 1.0`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Final Score Calculation</h4>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`If Environmental metrics are defined:
  FinalScore = EnvironmentalScore
Else if Threat metrics are defined:
  FinalScore = ThreatScore
Else:
  FinalScore = BaseScore

The Supplemental Score is applied as a modifier to the Final Score.`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">How to Use the Calculator</h4>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Select Metric Values:</strong> Navigate through the tabs (Base, Threat, Environmental, Supplemental)
            and select appropriate values for each metric based on your vulnerability assessment.
          </li>
          <li>
            <strong>View Real-time Results:</strong> As you select values, the calculator will automatically update the
            score, severity rating, and visualizations.
          </li>
          <li>
            <strong>Save Your Assessment:</strong> Click the "Save" button to store your assessment for future reference
            and comparison.
          </li>
          <li>
            <strong>Generate a Report:</strong> Click the "PDF" button to create a detailed PDF report of your
            vulnerability assessment.
          </li>
          <li>
            <strong>Compare Assessments:</strong> Use the Historical Comparison section to see how different
            vulnerabilities compare to each other.
          </li>
        </ol>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Tips for Accurate Assessment</h4>
        <ul className="list-disc pl-6">
          <li>Be objective and consistent in your evaluations</li>
          <li>Consider the worst-case impact when selecting values</li>
          <li>Use the Environmental metrics to contextualize the score for your organization</li>
          <li>Document your reasoning for each metric selection</li>
          <li>Compare similar vulnerabilities to ensure consistent scoring</li>
        </ul>
      </div>
    </div>
  )
}
