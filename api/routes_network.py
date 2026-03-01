from fastapi import APIRouter, UploadFile, HTTPException, status
from api.models.scan import TrafficAnalysisResult
from api.scanners.net_analyzer import (
    load_traffic_csv,
    calculate_baseline,
    detect_anomalies,
    get_timeseries,
    analyze_endpoints,
    get_network_risk_score,
)

router = APIRouter(prefix='/api/v1', tags=['Network'])


@router.post('/network/analyze')
async def analyze_traffic(file: UploadFile) -> TrafficAnalysisResult:
    # 1. Read the file
    content = await file.read()

    # 2. Parsear and validate the CSV
    try:
        df = load_traffic_csv(content.decode())
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)   # "CSV missing required columns: {'bytes'}"
        )

    # 3. Ochest te analysis
    baseline = calculate_baseline(df)
    anomalies = detect_anomalies(df, baseline)
    timeseries = get_timeseries(df, baseline)
    endpoints = analyze_endpoints(df)
    risk_score = get_network_risk_score(anomalies, total=len(df))

    return {
        'baseline': baseline,
        'anomalies': anomalies,
        'timeseries': timeseries,
        'endpoints': endpoints,
        'network_risk_score': risk_score,
        'total_events': len(df),
    }