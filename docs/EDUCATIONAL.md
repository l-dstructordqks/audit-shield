# 📚 Audit-Shield — Educational Guide

> This document is part of Audit-Shield's commitment to making security accessible.
> Every concept here is explained from scratch — no prior security knowledge required.

---

## Table of Contents

1. [What is Supply Chain Security?](#1-what-is-supply-chain-security)
2. [Why is PyPI Critical for the Python Ecosystem?](#2-why-is-pypi-critical-for-the-python-ecosystem)
3. [What Audit-Shield Does NOT Do](#3-what-audit-shield-does-not-do)
4. [How to Interpret the Results](#4-how-to-interpret-the-results)
5. [Security ≠ Hacking](#5-security--hacking)
6. [Safety Manifest](#6-safety-manifest)

---

## 1. What is Supply Chain Security?

When you write `pip install requests`, you are not just downloading code — you are **trusting an entire chain of people and systems** to deliver safe software to your machine.

This chain includes:

```
You → pip → PyPI → the package author → their dependencies → their dependencies' dependencies
```

**Supply chain security** is the practice of auditing that chain. It asks:

- Is this package maintained? When was it last updated?
- Does it have known vulnerabilities (CVEs)?
- Are the packages it depends on also safe?

### A real-world analogy

Think of your `requirements.txt` like the ingredients list of a product you buy at a store. Supply chain security is the equivalent of checking whether any of those ingredients have been recalled, are expired, or come from an unreliable supplier.

### Why it matters for Python

The 2020 SolarWinds attack and the 2021 `ua-parser-js` npm incident showed that **a single compromised dependency can affect thousands of projects**. Python is not immune — PyPI has seen typosquatting attacks, malicious packages, and abandoned packages with unpatched CVEs.

---

## 2. Why is PyPI Critical for the Python Ecosystem?

**PyPI (Python Package Index)** is the official repository for Python packages. It hosts over 500,000 packages and serves billions of downloads per month.

### What makes PyPI crucial

- It is the **default source** for `pip install` — most developers use it without thinking
- **Anyone can publish** a package — there is no mandatory security review before publication
- Packages can be **abandoned** — leaving security vulnerabilities unpatched indefinitely
- **Transitive dependencies** — when you install `requests`, you also install `urllib3`, `certifi`, and others. Each is a potential attack surface

### The CVE pipeline for PyPI

```
Researcher discovers vulnerability
        ↓
CVE assigned by MITRE (e.g. CVE-2023-XXXXX)
        ↓
CVSS score assigned (0-10 severity rating)
        ↓
Published to NVD (National Vulnerability Database)
        ↓
Indexed by OSV.dev (the source Audit-Shield uses)
        ↓
You see it in Audit-Shield with a recommended fix
```

---

## 3. What Audit-Shield Does NOT Do

### ✅ Audit-Shield does

- Scan your `requirements.txt` against real, public CVE databases
- Show you which packages are outdated and by how much
- Analyze simulated network traffic for statistical anomalies
- Give you a unified risk score with an actionable breakdown
- Explain every alert in plain language

### ❌ Audit-Shield does NOT

| What it does not do                         | Why this matters                                             |
| ------------------------------------------- | ------------------------------------------------------------ |
| Provide exploit code or attack instructions | This tool is defensive, not offensive                        |
| Perform penetration testing                 | Audit-Shield is not a pentesting framework                   |
| Capture or analyze real network traffic     | All network analysis uses simulated CSV data                 |
| Upload your source code anywhere            | Analysis happens locally or via public APIs only             |
| Guarantee that your project is secure       | It surfaces known risks — security is a process, not a state |

---

## 4. How to Interpret the Results

### The Audit Score

```
Score = (0.5 × V) + (0.2 × M) + (0.3 × N)
```

| Component                 | What it measures                     | Weight |
| ------------------------- | ------------------------------------ | ------ |
| **V** — Vulnerabilities   | CVEs found across your dependencies  | 50%    |
| **M** — Maintenance       | Outdated packages and staleness      | 20%    |
| **N** — Network anomalies | Unusual patterns in your traffic log | 30%    |

A **higher score means higher risk**.

```
0 ──────── 40 ──────── 70 ──────── 100
│  GREEN   │  YELLOW   │    RED    │
│ Low risk │ Moderate  │ High risk │
```

### Reading the Dependency Table

- **Current version** vs **Latest version** — if they differ, the package is outdated
- **Days since update** — how long since the package received a new release
- **Vulnerabilities** — CVEs found for that specific version, with severity and CVSS score
- **Action** — the exact `pip install` command to fix the issue

### Reading the Network Analysis

The network analysis compares your traffic against a **statistical baseline** (the Digital Twin):

- **Baseline** — the expected behavior, calculated as the mean of your traffic data
- **Latency Threshold** — mean + 2 standard deviations (covers 95% of normal traffic)
- **Bytes Threshold** — mean \* 10 (a spike 10 times the mean usually indicates a critical event.)
- **Anomaly** — any event that exceeds the threshold

> These patterns are **signals of attention**, not confirmed attacks.

---

## 5. Security ≠ Hacking

The vast majority of security work is **defensive and analytical**:

```
Offensive security (pentesting, red team)  →  ~10% of security work
Defensive security (monitoring, auditing)  →  ~90% of security work
```

### What security actually looks like day to day

- Keeping dependencies updated
- Reading CVE advisories for the libraries you use
- Reviewing what network traffic your application generates
- Understanding what data your packages have access to

### The Mindset shift

Old mindset:

> "Security is something experts do to find attacks"

New mindset:

> "Security as a habitual practice of understanding and mitigating risk"

---

## 6. Safety Manifest

### 1. Privacy

> The analysis happens locally or via public APIs. Your source code is never uploaded anywhere.

- `requirements.txt` is analyzed using PyPI's public JSON API and OSV.dev
- Network analysis uses CSV files you provide — no live traffic capture
- No telemetry, no tracking, no data retention

### 2. Transparency

> Every alert links directly to its official source.

- CVEs link to NVD (`https://nvd.nist.gov/vuln/detail/{CVE-ID}`) and Mitre
- Vulnerability data comes from OSV.dev (https://api.osv.dev/v1/query) — the same source used by PyPA officially
- The Audit Score formula is fully documented and reproducible

### 3. Actionability

> Audit-Shield does not just show problems — it tells you how to fix them.

Every flagged package includes the exact command to remediate:

```bash
pip install --upgrade requests==2.31.0
```

### 4. Responsibility

> Network patterns are presented as signals of attention, never as confirmed attack diagnoses.

Statistical anomalies are not proof of malicious activity. Audit-Shield gives you the signal — you provide the context and the judgment.

---

## Further Reading

- [OSV.dev documentation](https://osv.dev/docs/)
- [PyPI security advisories](https://pypi.org/security/)
- [NVD — National Vulnerability Database](https://nvd.nist.gov/)
- [CVSS scoring system explained](https://www.first.org/cvss/v3.1/specification-document)
- [Python Packaging Authority (PyPA)](https://www.pypa.io/)

---

_Audit-Shield is an educational tool built for the Python community._  
_Developed as part of a PSF grant application with the goal of making security concepts accessible to developers at all levels._

# 📚 Audit-Shield — Educational Guide

> This document is part of Audit-Shield's commitment to making security accessible.
> Every concept here is explained from scratch — no prior security knowledge required.

---

## Table of Contents

1. [What is Supply Chain Security?](#1-what-is-supply-chain-security)
2. [Why is PyPI Critical for the Python Ecosystem?](#2-why-is-pypi-critical-for-the-python-ecosystem)
3. [What Audit-Shield Does NOT Do](#3-what-audit-shield-does-not-do)
4. [How to Interpret the Results](#4-how-to-interpret-the-results)
5. [Security ≠ Hacking](#5-security--hacking)
6. [Safety Manifest](#6-safety-manifest)

---

## 1. What is Supply Chain Security?

When you write `pip install requests`, you are not just downloading code — you are **trusting an entire chain of people and systems** to deliver safe software to your machine.

This chain includes:

```
You → pip → PyPI → the package author → their dependencies → their dependencies' dependencies
```

**Supply chain security** is the practice of auditing that chain. It asks:

- Is this package maintained? When was it last updated?
- Does it have known vulnerabilities (CVEs)?
- Are the packages it depends on also safe?

### A real-world analogy

Think of your `requirements.txt` like the ingredients list of a product you buy at a store. Supply chain security is the equivalent of checking whether any of those ingredients have been recalled, are expired, or come from an unreliable supplier.

### Why it matters for Python

The 2020 SolarWinds attack and the 2021 `ua-parser-js` npm incident showed that **a single compromised dependency can affect thousands of projects**. Python is not immune — PyPI has seen typosquatting attacks, malicious packages, and abandoned packages with unpatched CVEs.

---

## 2. Why is PyPI Critical for the Python Ecosystem?

**PyPI (Python Package Index)** is the official repository for Python packages. It hosts over 500,000 packages and serves billions of downloads per month.

### What makes PyPI crucial

- It is the **default source** for `pip install` — most developers use it without thinking
- **Anyone can publish** a package — there is no mandatory security review before publication
- Packages can be **abandoned** — leaving security vulnerabilities unpatched indefinitely
- **Transitive dependencies** — when you install `requests`, you also install `urllib3`, `certifi`, and others. Each is a potential attack surface

### The CVE pipeline for PyPI

```
Researcher discovers vulnerability
        ↓
CVE assigned by MITRE (e.g. CVE-2023-XXXXX)
        ↓
CVSS score assigned (0-10 severity rating)
        ↓
Published to NVD (National Vulnerability Database)
        ↓
Indexed by OSV.dev (the source Audit-Shield uses)
        ↓
You see it in Audit-Shield with a recommended fix
```

---

## 3. What Audit-Shield Does NOT Do

### ✅ Audit-Shield does

- Scan your `requirements.txt` against real, public CVE databases
- Show you which packages are outdated and by how much
- Analyze simulated network traffic for statistical anomalies
- Give you a unified risk score with an actionable breakdown
- Explain every alert in plain language

### ❌ Audit-Shield does NOT

| What it does not do                         | Why this matters                                             |
| ------------------------------------------- | ------------------------------------------------------------ |
| Provide exploit code or attack instructions | This tool is defensive, not offensive                        |
| Perform penetration testing                 | Audit-Shield is not a pentesting framework                   |
| Capture or analyze real network traffic     | All network analysis uses simulated CSV data                 |
| Upload your source code anywhere            | Analysis happens locally or via public APIs only             |
| Guarantee that your project is secure       | It surfaces known risks — security is a process, not a state |

---

## 4. How to Interpret the Results

### The Audit Score

```
Score = (0.5 × V) + (0.2 × M) + (0.3 × N)
```

| Component                 | What it measures                     | Weight |
| ------------------------- | ------------------------------------ | ------ |
| **V** — Vulnerabilities   | CVEs found across your dependencies  | 50%    |
| **M** — Maintenance       | Outdated packages and staleness      | 20%    |
| **N** — Network anomalies | Unusual patterns in your traffic log | 30%    |

A **higher score means higher risk**.

```
0 ──────── 40 ──────── 70 ──────── 100
│  GREEN   │  YELLOW   │    RED    │
│ Low risk │ Moderate  │ High risk │
```

### Reading the Dependency Table

- **Current version** vs **Latest version** — if they differ, the package is outdated
- **Days since update** — how long since the package received a new release
- **Vulnerabilities** — CVEs found for that specific version, with severity and CVSS score
- **Action** — the exact `pip install` command to fix the issue

### Reading the Network Analysis

The network analysis compares your traffic against a **statistical baseline** (the Digital Twin):

- **Baseline** — the expected behavior, calculated as the mean of your traffic data
- **Latency Threshold** — mean + 2 standard deviations (covers 95% of normal traffic)
- **Bytes Threshold** — mean \* 10 (a spike 10 times the mean usually indicates a critical event.)
- **Anomaly** — any event that exceeds the threshold

> These patterns are **signals of attention**, not confirmed attacks.

---

## 5. Security ≠ Hacking

The vast majority of security work is **defensive and analytical**:

```
Offensive security (pentesting, red team)  →  ~10% of security work
Defensive security (monitoring, auditing)  →  ~90% of security work
```

### What security actually looks like day to day

- Keeping dependencies updated
- Reading CVE advisories for the libraries you use
- Reviewing what network traffic your application generates
- Understanding what data your packages have access to

### The Mindset shift

Old mindset:

> "Security is something experts do to find attacks"

New mindset:

> "Security as a habitual practice of understanding and mitigating risk"

---

## 6. Safety Manifest

### 1. Privacy

> The analysis happens locally or via public APIs. Your source code is never uploaded anywhere.

- `requirements.txt` is analyzed using PyPI's public JSON API and OSV.dev
- Network analysis uses CSV files you provide — no live traffic capture
- No telemetry, no tracking, no data retention

### 2. Transparency

> Every alert links directly to its official source.

- CVEs link to NVD (`https://nvd.nist.gov/vuln/detail/{CVE-ID}`) and Mitre
- Vulnerability data comes from OSV.dev (https://api.osv.dev/v1/query) — the same source used by PyPA officially
- The Audit Score formula is fully documented and reproducible

### 3. Actionability

> Audit-Shield does not just show problems — it tells you how to fix them.

Every flagged package includes the exact command to remediate:

```bash
pip install --upgrade requests==2.31.0
```

### 4. Responsibility

> Network patterns are presented as signals of attention, never as confirmed attack diagnoses.

Statistical anomalies are not proof of malicious activity. Audit-Shield gives you the signal — you provide the context and the judgment.

---

## Further Reading

- [OSV.dev documentation](https://osv.dev/docs/)
- [PyPI security advisories](https://pypi.org/security/)
- [NVD — National Vulnerability Database](https://nvd.nist.gov/)
- [CVSS scoring system explained](https://www.first.org/cvss/v3.1/specification-document)
- [Python Packaging Authority (PyPA)](https://www.pypa.io/)

---

_Audit-Shield is an educational tool built for the Python community._  
_Developed as part of a PSF grant application with the goal of making security concepts accessible to developers at all levels._
