import requests
from cvss import CVSS2, CVSS3, CVSS4

OSV_URL = 'https://api.osv.dev/v1/query'

def fetch_vulnerabilities( name: str, version: str | None) -> list[dict]:	

    try:
        response = requests.post(OSV_URL, json=_build_payload(name, version), timeout=10)

        if response.status_code != 200:
            return []

        data = response.json()
        vulns = data.get('vulns', [])
        vulnerabilities = []

        for vuln in vulns:
            aliases = vuln.get('aliases', [])
            cve_id = aliases[0] if aliases else vuln.get('id')
            cvss_score, severity = _parse_severity(vuln)
            vulnerabilities.append({
                "id": cve_id,
                "severity": severity,
                "cvss_score": cvss_score,
                "description": vuln.get('summary'),
                "link": _get_nvd_link(cve_id)
                })

        return vulnerabilities
    
    except requests.RequestException:
        return []

def _build_payload( name: str, version: str | None) -> dict:

    payload = {"package": {"name": name, "ecosystem": "PyPI"}}
    if version:
        payload["version"] = version
    return payload

def _parse_severity(vuln: dict) ->  tuple[str|None, str]:

    for s in vuln.get("severity", []):
        try:
            if s.get("type") == "CVSS_V4":
                vector = CVSS4(s["score"])
                return float(vector.base_score), vector.severities()[0].upper()
            elif s.get("type") == "CVSS_V3":
                vector = CVSS3(s["score"])
                return float(vector.base_score), vector.severities()[0].upper()
            elif s.get("type") == "CVSS_V2":
                vector = CVSS2(s["score"])
                return float(vector.base_score), vector.severities()[0].upper()
        except Exception:
            continue
    return None, "UNKNOWN"

def _get_nvd_link( cve_id: str) -> str:	

    return f'https://nvd.nist.gov/vuln/detail/{cve_id}'

