from typing import Dict


def normalize_dependency(raw_dependency: str) -> Dict[str, str]:
    """
    Normalize a dependency string into dictionary with name and version.
    Example:
      fastapi==0.110.0 -> {"name": "fastapi", "version": "0.110.0"}
      requests         -> {"name": "requests", "version": "unknown"}
    """
    if "==" in raw_dependency:
        name, version = raw_dependency.split("==", maxsplit=1)
        return {"name": name.strip(), "version": version.strip()}

    return {"name": raw_dependency.strip(), "version": "unknown"}
