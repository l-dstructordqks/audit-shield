from typing import Dict, Any, Optional


def extract_cvss_score(vuln: Dict[str, Any]) -> Optional[float]:
    """
    Extract CVSS score from OSV vulnerability entry.
    """
    severity_entries = vuln.get("severity", [])

    for entry in severity_entries:
        if entry.get("type") == "CVSS_V3":
            score = entry.get("score")
            try:
                return float(score)
            except (TypeError, ValueError):
                return None

    return None


def classify_severity(cvss_score: Optional[float]) -> str:
    if cvss_score is None:
        return "UNKNOWN"
    if cvss_score >= 9.0:
        return "CRITICAL"
    if cvss_score >= 7.0:
        return "HIGH"
    if cvss_score >= 4.0:
        return "MEDIUM"
    return "LOW"


def enrich_vulnerability_with_severity(
    vuln: Dict[str, Any],
) -> Dict[str, Any]:
    score = extract_cvss_score(vuln)
    severity = classify_severity(score)

    return {
        **vuln,
        "cvss_score": score,
        "severity_level": severity,
    }
