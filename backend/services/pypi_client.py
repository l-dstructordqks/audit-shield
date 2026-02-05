import requests
from typing import Dict

# Public PyPI JSON API base URL
PYPI_BASE_URL = "https://pypi.org/pypi"

REQUEST_TIMEOUT_SECONDS = 5

def fetch_package_metadata(package_name: str) -> Dict:
    """
    Fetch basic package metadata from PyPI.
    """
    url = f"{PYPI_BASE_URL}/{package_name}/json"

    response = requests.get(url, timeout=REQUEST_TIMEOUT_SECONDS)

    if response.status_code != 200:
        return {"error": "Package not found"}

    data = response.json()

    return {
        "name": data["info"]["name"],
        "version": data["info"]["version"],
        "summary": data["info"]["summary"],
        "license": data["info"]["license"],
        "home_page": data["info"]["home_page"],
    }