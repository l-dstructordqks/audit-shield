from pydantic import BaseModel
from typing import Optional

class Vulnerability(BaseModel):
    id: str
    severity: str           # 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    cvss_score: float|None
    description: str|None
    link: str

class PackageResult(BaseModel):
    name: str
    current_version: Optional[str]
    latest_version: Optional[str]
    days_since_update: int|None
    is_outdated: bool
    vulnerabilities: list[Vulnerability]
    risk_level: str           # 'GREEN' | 'YELLOW' | 'RED'
    action: str

class ScanResult(BaseModel):
    packages: list[PackageResult]
    audit_score: int          # 0-100
    audit_level: str          # 'GREEN' | 'YELLOW' | 'RED'
    breakdown: dict           

class TextScanRequest(BaseModel):
    content: str

#network classes

class AnomalyEvent(BaseModel):
    timestamp: str
    type: str        # 'HIGH_LATENCY' | 'HIGH_BYTES'
    value: float
    threshold: float

class TimePoint(BaseModel):
    timestamp: str
    avg_latency: float
    max_latency: float
    total_bytes: int
    max_bytes: int
    event_count: int
    latency_anomaly_count: int
    bytes_anomaly_count: int

class EndpointSummary(BaseModel):
    ip: str
    protocol: str
    total_bytes: int
    request_count: int
    is_suspicious: bool

class Baseline(BaseModel):
    latency_mean: float
    latency_std: float
    bytes_mean: float
    bytes_std: float
    events_per_min: float
    latency_threshold: float
    bytes_threshold: float

class TrafficAnalysisResult(BaseModel):
    baseline: Baseline
    anomalies: list[AnomalyEvent]
    timeseries: list[TimePoint]
    endpoints: list[EndpointSummary]
    network_risk_score: float      # el N del Audit-Score
    total_events: int