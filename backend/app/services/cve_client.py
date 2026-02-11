import os
import requests
from typing import List, Dict, Any

OSV_API_URL = os.getenv("OSV_API_URL", "https://api.osv.dev/v1/query")
REQUEST_TIMEOUT_SECONDS = int(os.getenv("OSV_TIMEOUT", "5"))


def fetch_vulnerabilities(package_name: str) -> List[Dict[str, Any]]:
    """
    Fetch known vulnerabilities for a given package using OSV API.
    """
    payload = {
        "package": {
            "name": package_name,
            "ecosystem": "PyPI",
        }
    }

    try: 
        response = requests.post(
            OSV_API_URL,
            json=payload,
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except requests.RequestException:
        return []

    data = response.json()
    return data.get("vulns", [])
