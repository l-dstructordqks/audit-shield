from pathlib import Path
from typing import List

# function to convert file of dependencies in a list of dependencies
def parse_requirements(file_path: Path) -> List[str]:
    # prevent empty file
    if not file_path.exists():
        raise FileNotFoundError("requirements.txt not found")

    dependencies: List[str] = []

    with file_path.open() as file:
        for line in file:
            line = line.strip()
            # skip empty lines and commets
            if not line or line.startswith("#"):
                continue

            dependencies.append(line)

    return dependencies
