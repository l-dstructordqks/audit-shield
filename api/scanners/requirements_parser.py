import re
def parse_requirements(content: str) -> list[dict]:
    lines = content.split()
    dependencies_list = []
    
    for line in lines:
        clean_line = _clean_line(line)
        
        if not clean_line:
            continue

        name, version = _extract_name_version(clean_line)

        dependency_dict = {
            "name": name,
            "version": version,
            "raw": clean_line,
        }
        
        dependencies_list.append(dependency_dict)
    print(dependencies_list)


def _clean_line(line: str) -> str|None:
    line = line.strip()

    if "#" in line or not line :
        return None
    else:
        return line

def _extract_name_version(line: str) -> tuple[str, str|None]:

    if "==" in line or ">=" in line or "~=" in line :
        dependency = re.split(r'==|>=|~=', line)

        name = dependency[0].strip()
        version = dependency[1].strip()

        return name, version
    
    return line, None

    