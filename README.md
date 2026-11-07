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

![Dependabot automatically generated Pull Request](images/55-dependabot-pull-request.png)

#### Conclusion

GitHub Dependabot automates dependency monitoring and update proposals for the frontend, backend and GitHub Actions components.

By generating Pull Requests for available updates, Dependabot helps developers identify vulnerable dependencies, apply security fixes and maintain a more secure software supply chain.

### 77. Pinning GitHub Actions to Immutable Commit SHAs

#### Objective

Improve CI/CD supply-chain security by pinning third-party GitHub Actions to immutable commit SHAs instead of relying on mutable version tags.

#### Configuration

All third-party actions used in the Activity 5 workflow are referenced using full commit SHAs.

Examples:

| GitHub Action | Reference |
|---|---|
| `actions/checkout` | `08c6903cd8c0fde910a37f88322edcfb5dd907a8` |
| `actions/setup-node` | `a0853c24544627f65ddf259abe73b1d18a591444` |
| `gitleaks/gitleaks-action` | `e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e` |
| `aquasecurity/trivy-action` | `ed142fd0673e97e23eac54620cfb913e5ce36c25` |

Example:

```yaml
- name: Checkout repository
  uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
```

#### Why CI/CD Pipelines Are an Attack Surface

CI/CD pipelines are part of the software supply chain because they execute code, access credentials, build artifacts and perform automated operations.

Using third-party GitHub Actions introduces an additional security risk. If an action maintainer's account or repository is compromised, a malicious update to a mutable tag could cause workflows to execute unauthorized code.

Potential consequences include:

- Exposure or theft of workflow secrets and authentication tokens.
- Unauthorized modification of build artifacts.
- Injection of malicious code into Docker images.
- Compromise of deployment processes.
- Software supply-chain attacks.

#### Security Benefits

Pinning actions to full commit SHAs:

- Ensures workflows reference a specific source-code revision.
- Prevents unexpected changes caused by moving version tags.
- Improves reproducibility and traceability.
- Reduces the risk of malicious third-party action updates.
- Helps maintain control over CI/CD dependencies.

#### Verification

All third-party `uses:` references in the Activity 5 workflow were checked to ensure that they use full commit SHAs rather than mutable version tags.

#### Conclusion

Pinning GitHub Actions to immutable commit SHAs reduces the CI/CD supply-chain attack surface and provides greater control over the code executed during automated builds and security checks.

### 78. Comparison Between GitHub Actions and Jenkins

#### Objective

Compare GitHub Actions and Jenkins as CI/CD automation platforms used in DevSecOps environments.

#### Comparison

| Criteria | GitHub Actions | Jenkins |
|---|---|---|
| Hosting | GitHub-hosted or self-hosted runners | Self-hosted infrastructure |
| Configuration | YAML workflow files | Jenkinsfile |
| GitHub integration | Native integration | Requires plugins and configuration |
| Pipeline triggers | Push, Pull Request, schedule and manual execution | Webhooks, schedules and manual execution |
| Maintenance | Managed runners reduce infrastructure maintenance | Requires Jenkins server, agents and plugin maintenance |
| Extensibility | GitHub Actions Marketplace | Extensive plugin ecosystem |
| Security | GITHUB_TOKEN permissions and SHA-pinned actions | Credentials management, RBAC and plugin security |

#### Advantages and Limitations

**GitHub Actions:**
- Easy integration with GitHub repositories and Pull Requests.
- Simple YAML-based workflow configuration.
- Direct integration with security tools such as Gitleaks, Semgrep and Trivy.
- Reduced infrastructure maintenance when using GitHub-hosted runners.

**Jenkins:**
- Highly customizable CI/CD pipelines.
- Extensive plugin ecosystem.
- Greater control over build infrastructure and execution environments.
- Requires additional administration and maintenance.

#### Conclusion

For this DevSecOps portfolio project, GitHub Actions is a suitable choice because the source code is hosted on GitHub and the platform provides native integration with Pull Requests, automated testing and security scanning.

Jenkins remains a powerful alternative for organizations requiring extensive customization, dedicated infrastructure and complex CI/CD integrations.

## XVIII. Git Workflow


