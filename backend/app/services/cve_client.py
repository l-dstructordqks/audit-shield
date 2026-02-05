import requests
from typing import List, Dict

OSV_API_URL = "https://api.osv.dev/v1/query"
REQUEST_TIMEOUT_SECONDS = 5


def fetch_vulnerabilities(package_name: str) -> List[Dict]:
    """
    Fetch known vulnerabilities for a given package using OSV API.
    """
    payload = {
        "package": {
            "name": package_name,
            "ecosystem": "PyPI",
        }
    }

    response = requests.post(
        OSV_API_URL,
        json=payload,
        timeout=REQUEST_TIMEOUT_SECONDS,
    )

    if response.status_code != 200:
        return []

    data = response.json()
    return data.get("vulns", [])
