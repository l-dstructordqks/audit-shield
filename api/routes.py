from fastapi import APIRouter, HTTPException, UploadFile, status
from api.models.scan import ScanResult, PackageResult, TextScanRequest
from api.scanners.requirements_parser import parse_requirements
from api.scanners.osv_client import fetch_vulnerabilities
from api.scanners.pypi_client import get_package_info, is_outdated
from core_logic.scoring import _score_vulns, build_action_message, calculate_audit_score, score_to_level
from api.scanners.net_analyzer import calculate_baseline, detect_anomalies, get_network_risk_score, load_traffic_csv

router = APIRouter(prefix='/api/v1', tags=['Packages'])

def _build_package_result(dependency: dict) -> dict:

    name = dependency['name']
    version = dependency['version']

    vulns = fetch_vulnerabilities(name, version)
    info = get_package_info(name)
    outdated = is_outdated(version, info['latest_version'])
    vuln_score = _score_vulns(vulns)

    return {
        'name': name,
        'current_version': version,
        'latest_version': info['latest_version'],
        'days_since_update': info['days_since_update'],
        'is_outdated': outdated,
        'vulnerabilities': vulns,
        'risk_level': score_to_level(vuln_score),
        'action': build_action_message(name, info['latest_version']) if outdated else 'No update required',
    }

def _build_scan_result( content: str, traffic: str | None = None) -> ScanResult:

    parsed   = parse_requirements(content)
    packages = [_build_package_result(dep) for dep in parsed]

    risk_score = None

    if traffic:
        try:
            df = load_traffic_csv(traffic)
            baseline   = calculate_baseline(df)
            anomalies  = detect_anomalies(df, baseline)
            risk_score = get_network_risk_score(anomalies, total=len(df))
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

    
    audit_result   = calculate_audit_score(packages, risk_score)

    return {
        'packages': packages,
        'audit_score': audit_result['score'],
        'audit_level': audit_result['level'],
        'breakdown': audit_result['breakdown'],
    }

@router.post('/scan')
async def scan_requirements(file: UploadFile) -> ScanResult:

    if not file.filename.endswith(('.txt')):
        raise HTTPException(status_code=400, detail="File format not supported.")

    content = (await file.read()).decode()

    if not content.strip():
        raise HTTPException(status_code=400, detail="El archivo está vacío.")

    return _build_scan_result(content)


@router.post('/scan/text')
async def scan_from_text(body: TextScanRequest) -> ScanResult:

    return _build_scan_result(body.content)


@router.get('/package/{package_name}')
async def get_package_detail(package_name: str) -> PackageResult:

    dependency = {'name': package_name, 'version': None}
    return _build_package_result(dependency)
    
@router.post('/scan/full')
async def scan_full(
    requirements: UploadFile,
    traffic:      UploadFile,
) -> ScanResult:
    
    try:
        content = (await requirements.read()).decode()

        traffic_content = None
        if traffic:
            traffic_content = (await traffic.read()).decode()

        return _build_scan_result(content, traffic_content)

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo debe ser un texto válido (UTF-8)."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error procesando el escaneo: {str(e)}"
        )