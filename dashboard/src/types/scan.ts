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