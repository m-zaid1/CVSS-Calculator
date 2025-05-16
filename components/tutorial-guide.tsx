export default function TutorialGuide() {
  return (
    <div className="space-y-6 font-mono text-green-400">
      <div>
        <h3 className="text-xl font-pixel mb-2">CVSS 4.0 Calculator Guide</h3>
        <p>
          This guide will help you understand how to use the CVSS 4.0 Calculator to assess the severity of
          vulnerabilities.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">What is CVSS?</h4>
        <p>
          The Common Vulnerability Scoring System (CVSS) is an open framework for communicating the characteristics and
          severity of software vulnerabilities. CVSS 4.0 is the latest version of this standard.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">How to Use This Calculator</h4>
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
            <strong>Understand the Vector String:</strong> The CVSS vector string represents all your selected metrics
            in a standardized format that can be shared with others.
          </li>
          <li>
            <strong>Generate a Report:</strong> Click the "Generate Report" button to create a detailed PDF report of
            your vulnerability assessment.
          </li>
        </ol>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Metric Groups Explained</h4>

        <div className="mb-4">
          <h5 className="font-pixel text-green-400">Base Metrics</h5>
          <p>
            These metrics reflect the intrinsic characteristics of a vulnerability that are constant over time and
            across user environments. They include:
          </p>
          <ul className="list-disc pl-6">
            <li>Attack Vector (AV): How the vulnerability can be exploited</li>
            <li>Attack Complexity (AC): Conditions beyond the attacker's control</li>
            <li>Attack Requirements (AT): Prerequisites needed for exploitation</li>
            <li>Privileges Required (PR): Level of privileges needed</li>
            <li>User Interaction (UI): Whether a user needs to take action</li>
            <li>Confidentiality Impact (VC): Impact on information confidentiality</li>
            <li>Integrity Impact (VI): Impact on information integrity</li>
            <li>Availability Impact (VA): Impact on resource availability</li>
          </ul>
        </div>

        <div className="mb-4">
          <h5 className="font-pixel text-green-400">Threat Metrics</h5>
          <p>
            These metrics capture the current state of exploit techniques or code availability, and the potential for
            subsequent system impacts:
          </p>
          <ul className="list-disc pl-6">
            <li>Subsequent Confidentiality Impact (SC): Confidentiality impact on other components</li>
            <li>Subsequent Integrity Impact (SI): Integrity impact on other components</li>
            <li>Subsequent Availability Impact (SA): Availability impact on other components</li>
            <li>Exploit Maturity (E): Current state of exploit techniques</li>
          </ul>
        </div>

        <div className="mb-4">
          <h5 className="font-pixel text-green-400">Environmental Metrics</h5>
          <p>
            These metrics enable customization of the CVSS score based on the importance of the affected IT asset to the
            organization:
          </p>
          <ul className="list-disc pl-6">
            <li>Confidentiality Requirement (CR): Importance of confidentiality</li>
            <li>Integrity Requirement (IR): Importance of integrity</li>
            <li>Availability Requirement (AR): Importance of availability</li>
            <li>Modified Base Metrics: Allow adjusting base metrics to reflect the specific environment</li>
          </ul>
        </div>

        <div>
          <h5 className="font-pixel text-green-400">Supplemental Metrics</h5>
          <p>These metrics provide additional context that doesn't affect the score:</p>
          <ul className="list-disc pl-6">
            <li>Safety (S): Potential for physical harm</li>
          </ul>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Severity Ratings</h4>
        <p>CVSS scores translate to qualitative severity ratings:</p>
        <ul className="list-disc pl-6">
          <li>0.0: None</li>
          <li>0.1-3.9: Low</li>
          <li>4.0-6.9: Medium</li>
          <li>7.0-8.9: High</li>
          <li>9.0-10.0: Critical</li>
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-pixel mb-2">Tips for Accurate Assessment</h4>
        <ul className="list-disc pl-6">
          <li>Be objective and consistent in your evaluations</li>
          <li>Consider the worst-case impact when selecting values</li>
          <li>Use the Environmental metrics to contextualize the score for your organization</li>
          <li>Document your reasoning for each metric selection</li>
        </ul>
      </div>
    </div>
  )
}
