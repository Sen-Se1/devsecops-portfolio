# DevSecOps Portfolio

## XVII. GitHub Actions and GitHub Security

### 74. GitHub Advanced Security – CodeQL vs Semgrep

#### Objective

Enable GitHub CodeQL and compare its static application security testing (SAST) results with Semgrep to identify potential security vulnerabilities in the DevSecOps Portfolio project.

#### Tools Used

- **GitHub CodeQL:** A semantic code analysis engine that identifies potential security vulnerabilities and coding errors. Its findings are published in GitHub Code Scanning.
- **Semgrep:** A static analysis tool that uses configurable rules to detect security vulnerabilities and potentially unsafe coding patterns.

#### Integration into GitHub Actions

Both tools are integrated into the CI security pipeline:

1. Semgrep analyzes the application source code.
2. CodeQL analyzes JavaScript and TypeScript files.
3. CodeQL publishes its findings to GitHub Code Scanning.
4. Developers review the detected alerts and investigate potential vulnerabilities.

#### Results Comparison

The following table compares the security findings obtained from both tools during the pipeline execution.

| Comparison criteria | CodeQL | Semgrep |
|---|---|---|
| Analysis type | Semantic static analysis | Rule-based static analysis |
| Configuration | Security-extended queries | Automatic configuration (`auto`) |
| Languages analyzed | JavaScript / TypeScript | Languages supported by selected rules |
| Total alerts detected | To be completed | To be completed |
| Critical alerts | To be completed | To be completed |
| High alerts | To be completed | To be completed |
| Medium alerts | To be completed | To be completed |
| Low alerts | To be completed | To be completed |
| Results location | GitHub Security → Code Scanning | GitHub Actions logs |

#### Analysis and Comparison

CodeQL and Semgrep provide complementary security analysis capabilities.

- **CodeQL** performs semantic analysis and integrates directly with GitHub Code Scanning, allowing developers to track and review security alerts.
- **Semgrep** provides flexible rule-based analysis and can be configured with different rule sets to detect security issues.

The number of alerts detected by each tool may differ because they use different analysis engines, rules, and detection techniques.

Each finding must be reviewed to determine whether it represents a genuine vulnerability or a false positive.

#### Conclusion

Integrating CodeQL and Semgrep strengthens the project's SAST process by combining two complementary security analysis approaches.

Using both tools improves the visibility of potential security issues and helps developers identify and remediate vulnerabilities earlier in the development lifecycle.