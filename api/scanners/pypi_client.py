from datetime import datetime, timezone
from packaging import version
import requests

PYPI_URL = "https://pypi.org/pypi"

def get_package_info(package_name: str) -> dict | None:
    url = f"{PYPI_URL}/{package_name}/json"

    try: 
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return None
    
        data = response.json()

        info = data.get("info", {})
        latest_version = info.get("version")
        version_releases = data.get("releases", {}).get(latest_version, [])

        last_updated_time = None
        days = None

        if version_releases:
            last_updated_time = version_releases[-1].get("upload_time_iso_8601")
            if last_updated_time:
                days = _calculate_staleness(last_updated_time)
        
        return {
            "name": info.get("name", package_name),
            "latest_version" : latest_version,
            "last_updated_iso": last_updated_time,
            "days_since_update": days
        }
    
    except (requests.RequestException, Exception):
        return None

    

def _calculate_staleness(upload_time: str) -> int:
    last_updated = datetime.fromisoformat(upload_time.replace("Z", "+00:00"))
    
    now = datetime.now(timezone.utc)
    days = (now - last_updated).days
    return days


def is_outdated(current: str | None, latest: str ) -> bool:
    if not current or not latest:
        return False
    try:
        return version.parse(current) < version.parse(latest)
    except (version.InvalidVersion, TypeError):
        return False

