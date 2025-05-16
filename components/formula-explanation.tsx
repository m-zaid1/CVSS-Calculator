export default function FormulaExplanation() {
  return (
    <div className="space-y-6 font-mono text-green-400">
      <div>
        <h3 className="text-xl font-pixel mb-2">CVSS 4.0 Formula Explanation</h3>
        <p>
          This document explains how CVSS 4.0 scores are calculated using the official formulas from the CVSS 4.0
          specification.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Score Components</h4>
        <p>CVSS 4.0 consists of four metric groups, each contributing to the final score:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Base Score: Represents the intrinsic qualities of a vulnerability</li>
          <li>Threat Score: Reflects the current state of exploit techniques and threat factors</li>
          <li>Environmental Score: Customizes the score based on the importance of the affected IT asset</li>
          <li>Supplemental Score: Provides additional context without affecting the numerical score</li>
        </ol>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Base Score Calculation</h4>
        <p>The Base Score is calculated using the following formula:</p>
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
        <p>The Threat Score incorporates subsequent system impacts and exploit maturity:</p>
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
        <p>
          The Environmental Score customizes the Base and Threat Scores based on the importance of the affected IT
          asset:
        </p>
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
        <h4 className="text-lg font-pixel mb-2">Final Score Calculation</h4>
        <p>The Final CVSS Score is determined by the following logic:</p>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`If Environmental metrics are defined:
  FinalScore = EnvironmentalScore
Else if Threat metrics are defined:
  FinalScore = ThreatScore
Else:
  FinalScore = BaseScore`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Severity Rating</h4>
        <p>The numerical score is translated to a qualitative severity rating:</p>
        <pre className="bg-gray-700 p-3 rounded overflow-x-auto pixelated-border">
          {`0.0: None
0.1-3.9: Low
4.0-6.9: Medium
7.0-8.9: High
9.0-10.0: Critical`}
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Implementation Notes</h4>
        <p>In our calculator implementation:</p>
        <ul className="list-disc pl-6">
          <li>All calculations follow the official CVSS 4.0 specification</li>
          <li>Roundup function rounds up to 1 decimal place</li>
          <li>
            When "Not Defined" (X) is selected for a modified metric, the calculator uses the corresponding Base metric
            value
          </li>
          <li>The calculator handles all edge cases as specified in the CVSS 4.0 documentation</li>
        </ul>
      </div>
    </div>
  )
}
