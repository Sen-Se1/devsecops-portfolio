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

### 75. Automated Dependency Management with GitHub Dependabot

#### Objective

Enable GitHub Dependabot to automatically detect vulnerable and outdated dependencies and propose updates through automated Pull Requests.

#### Dependabot Configuration

GitHub Dependabot is configured using the `.github/dependabot.yml` file.

The configuration monitors three areas of the DevSecOps Portfolio project:

| Ecosystem | Directory | Dependencies monitored |
|---|---|---|
| npm – Frontend | `/` | Next.js, React, Jest and other frontend packages |
| npm – Backend | `/api` | Express, Prisma, Zod and other API packages |
| GitHub Actions | `/` | Third-party GitHub Actions used in CI/CD workflows |

Updates are checked weekly.

#### GitHub Security Features

The following GitHub security features are enabled:

- **Dependency graph:** Identifies and tracks project dependencies.
- **Dependabot alerts:** Detects dependencies affected by known security vulnerabilities.
- **Dependabot security updates:** Automatically creates Pull Requests when compatible security fixes are available.
- **Dependabot version updates:** Proposes updates to outdated dependencies according to the configured schedule.

#### Automatic Pull Request Workflow

When Dependabot detects an available dependency update, it can automatically create a Pull Request.

The workflow is as follows:

1. Dependabot checks the project's dependency manifests and lockfiles.
2. It identifies outdated or vulnerable dependencies.
3. It determines whether a compatible update is available.
4. It creates a Pull Request with the proposed dependency update.
5. GitHub Actions runs the configured CI/CD checks.
6. The developer reviews the changes and merges the Pull Request after successful verification.

#### Screenshot – Dependabot Automated Pull Request

The following screenshot demonstrates an automatically generated dependency update Pull Request.

![Dependabot automatically generated Pull Request](images/75-dependabot-pull-request.png)

**Pull Request evidence should show:**
- The author `dependabot[bot]`.
- The dependency being updated.
- The previous and proposed versions.
- The Pull Request title and description.
- The CI/CD checks associated with the update.

#### Verification

The configuration can be verified by checking:

1. The presence of `.github/dependabot.yml` in the repository.
2. The enabled Dependency Graph feature.
3. The enabled Dependabot alerts.
4. The enabled Dependabot security updates.
5. An automatically generated Pull Request from `dependabot[bot]`.

#### Conclusion

GitHub Dependabot automates dependency monitoring and update proposals for the frontend, backend and GitHub Actions components.

By generating Pull Requests for available updates, Dependabot helps developers identify vulnerable dependencies, apply security fixes and maintain a more secure software supply chain.