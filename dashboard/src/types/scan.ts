export interface Vulnerability {
    id: string;
    severity: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';           // 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    cvss_score: number | null;
    description: string | null;
    link: string;
}
export interface PackageResult {
    name: string;
    current_version?: string;
    latest_version?: string;
    days_since_update: number | null;
    is_outdated: boolean;
    vulnerabilities: Vulnerability[];
    risk_level: 'GREEN' | 'YELLOW' | 'RED';           // 'GREEN' | 'YELLOW' | 'RED'
    action: string;
}
export interface ScanResult {
    packages: PackageResult[];
    audit_score: number;        // 0-100
    audit_level: 'GREEN' | 'YELLOW' | 'RED';          // 'GREEN' | 'YELLOW' | 'RED'
    breakdown: Record<string, number>;           
}
export interface TrafficResult {
    packages: PackageResult[];
    audit_score: number;        // 0-100
    audit_level: 'GREEN' | 'YELLOW' | 'RED';          // 'GREEN' | 'YELLOW' | 'RED'
    breakdown: Record<string, number>;           
}
export interface TextScanRequest {
    content: string;
}

// network analysis

export interface AnomalyEvent {
    timestamp: string;
    type: 'HIGH_LATENCY' | 'HIGH_BYTES';
    value: number;
    threshold: number;
}
export interface TimePoint {
    timestamp: string;
    avg_latency: number;
    max_latency: number;
    total_bytes: number;
    max_bytes: number;
    event_count: number;
    latency_anomaly_count: number;
    bytes_anomaly_count: number;
}
export interface EndpointSummary {
    ip: string;
    protocol: string;
    total_bytes: number;
    request_count: number;
    is_suspicious: number;
}
export interface Baseline {
    latency_mean: number;
    latency_std: number;
    bytes_mean: number;
    bytes_std: number;
    events_per_min: number;
    latency_threshold: number;
    bytes_threshold: number;
}
export interface TrafficAnalysisResult{
    baseline: Baseline;
    anomalies: AnomalyEvent[];
    timeseries: TimePoint[];
    endpoints: EndpointSummary[];
    network_risk_score: number;      // el N del Audit-Score
    total_events: number;
}