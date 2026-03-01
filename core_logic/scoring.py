from statistics import mean
from packaging import version

SEVERITY_WEIGHTS = {
    "CRITICAL": 25,
    "HIGH":     10,
    "MEDIUM":    5,
    "LOW":       2,
    "UNKNOWN":   0,
}

def calculate_audit_score(packages: list[dict], network_score: float = 0.0) -> dict:

    if not packages:
        return {
            'score': 0,
            'level': score_to_level(0),
            'breakdown': {'V': 0, 'M': 0, 'N': network_score}
        }

    # los packaes llean del requirements_parser
    V_raw = mean([_score_vulns(p.get('vulnerabilities')) for p in packages])
    M_raw = mean([_score_maintenance(p.get('days_since_update'), p.get('is_outdated')) for p in packages])
    N_raw = network_score or 0.0 # float 0-100, viene de net_analyzer

    V = _normalize(V_raw, 100)
    M = _normalize(M_raw, 70)
    N = _normalize(N_raw, 100)

    score = int((0.5 * V) + (0.2 * M) + (0.3 * N))
    return {
        'score': score,
        'level': score_to_level(score),
        'breakdown': {'V': V, 'M': M, 'N': N}
    }


def _score_vulns(vulnerabilities: list[dict]) -> float:
    total_score = 0
    for vuln in vulnerabilities:
        total_score += SEVERITY_WEIGHTS.get(vuln.get('severity'), 0)
    return total_score

def _score_maintenance(days: int, is_outdated: bool) -> float:
    score = 0
    if is_outdated:
        score += 10
    if days > 90:
        score += min(days // 90, 60)
    return score

def _normalize(raw: float, max_val: float) -> int:
    return min(int(raw * 100 / max_val), 100)

def score_to_level(score: int) -> str:
    if score >= 70:
        return 'RED' # CRITICAL risk
    elif score >= 40:
        return 'YELLOW' # MODERATE risk
    else:
        return 'GREEN'  # LOW risk

def build_action_message(pkg_name: str, latest: str | None) -> str:
    message = f'pip install --upgrade {pkg_name}' 
    if latest:
        message += f'=={latest}'
    return message