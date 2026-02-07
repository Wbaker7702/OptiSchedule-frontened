# Security Policy

We take security seriously and appreciate responsible disclosure.

## Supported Versions

Security fixes are provided for the latest code on the default branch (`main`) only.

| Version | Supported |
| ------- | --------- |
| `main` | :white_check_mark: |
| latest (default branch) | :white_check_mark: |
| older builds/releases | :x: |

## Reporting a Vulnerability

Please report security issues **privately** using GitHub Security Advisories (preferred). Do not open a public GitHub issue.

- Report a vulnerability (private): https://github.com/Wbaker7702/OptiSchedule-pro/security/advisories/new
- Or: open the repository on GitHub → **Security** tab → **Report a vulnerability**

If you are unable to use GitHub Security Advisories, open a GitHub issue requesting a private contact channel **without including vulnerability details**.
If the Security tab is unavailable, open a new issue titled **Security contact request**
without including sensitive details. We will reply with a secure channel to continue the report.

### What to include

- A description of the issue and potential impact
- Steps to reproduce or a proof-of-concept
- Affected components, versions, or environments
- Any proposed mitigations or workarounds
- Logs, screenshots, or stack traces (if helpful)

### Scope

In scope:

- Vulnerabilities in code and configuration contained in this repository (including the web app, local proxy/server code, and build/deploy scripts)
- Vulnerabilities in published releases of this project (if any)

Out of scope (examples):

- Social engineering, phishing, or physical attacks
- Denial of service (DoS) via excessive traffic volume
- Reports that only describe missing security headers or best-practice recommendations without a demonstrated impact
- Vulnerabilities in third-party dependencies (please report to the upstream project)

### Response timeline

- Acknowledgement within 3 business days
- Initial triage within 7 business days
- Status updates at least every 7 days until resolution

### Coordinated disclosure

Please do not disclose the issue publicly until a fix is available or we agree on a
public disclosure timeline.

### Safe harbor

We will not pursue legal action for good-faith security research that:

- Avoids privacy violations and data exfiltration
- Avoids disruption (no DDoS, spam, or destructive testing)
- Uses only the minimum testing necessary to confirm the issue
