## Vulnerability Analysis Scope

Audit-Shield uses public vulnerability databases (such as OSV)
to identify known security issues affecting third-party dependencies
in the Python ecosystem.

The analysis performed by Audit-Shield is:

- informational
- non-intrusive
- read-only
- focused on dependency risk awareness

Vulnerabilities are classified using publicly available severity
metrics (e.g. CVSS scores) and grouped into qualitative risk levels
such as LOW, MEDIUM, HIGH, and CRITICAL.

Audit-Shield does not perform:

- exploitation
- penetration testing
- active scanning
- runtime attack simulation

The goal of this project is to help developers and teams
better understand and prioritize dependency-related security risks.
