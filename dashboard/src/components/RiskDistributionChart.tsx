import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";
import { getColorFromSeverity } from "../utils/colors";
import type { PackageResult } from "../types";


interface ChartDataPoint {
  name: string;
  CRITICAL: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  total: number;
}


const SEVERITY_LABELS: Record<string, string> = {
  CRITICAL: "CRITICAL",
  HIGH:     "HIGH",
  MEDIUM:   "MEDIUM",
  LOW:      "LOW",
};

// ─── prepareChartData ────────────────────────────────────────────
/**
 * Transforma packages en [{name, CRITICAL, HIGH, MEDIUM, LOW, total}]
 * contando CVEs por severidad para cada paquete.
 */
function prepareChartData(packages: PackageResult[]): ChartDataPoint[] {
  return packages.map((pkg) => {
    const counts: ChartDataPoint = {
      name:     pkg.name,
      CRITICAL: 0,
      HIGH:     0,
      MEDIUM:   0,
      LOW:      0,
      total:    pkg.vulnerabilities.length,
    };

    for (const vuln of pkg.vulnerabilities) {
      const sev = vuln.severity;
      if (sev in counts) {
        (counts[sev as keyof ChartDataPoint]++);
      }
    }

    return counts;
  // Solo incluye paquetes que tienen al menos una vulnerabilidad
  }).filter((d) => d.total > 0);
}

// ─── Custom Tooltip ──────────────────────────────────────────────
interface TooltipPayloadItem {
  name: string;
  value: number;
  fill: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm font-ptsans p-3 min-w-45">
      <p className="text-gray-500 text-[12px] font-bold mb-2 tracking-[0.05em]">
        {label}
      </p>
      {payload.map((entry) =>
      
        entry.value > 0 ? (
          <div key={entry.name} className="flex justify-between items-center gap-6 mb-1">
            <span className="text-xs text-gray-600 tracking-[0.04em]" style={{color: entry.fill}}>
              {SEVERITY_LABELS[entry.name] ?? entry.name}
            </span>
            <span className="text-gray-900 text-[11px] font-bold">
              {entry.value}
            </span>
            
          </div>
        ) : null
      )}
      <div className="flex justify-between mt-2 pt-2 font-medium border-t border-solid border-t-gray-600">
        <span className="text-xs text-gray-600">Total CVEs</span>
        <span className="text-gray-900 text-xs font-semibold">{total}</span>
      </div>
    </div>
  );
};

// ─── Custom Legend ───────────────────────────────────────────────
const CustomLegend = () => (
  <div className="flex justify-center gap-6 mt-3">
    {Object.entries(SEVERITY_LABELS).map(([key, severity]) => (
      <div key={key} className="flex items-center font-ptsans text-gray-900 tracking-[0.04em] font-medium gap-1.5">
        <div style={{ width: 10, height: 10, borderRadius: 2, background: getColorFromSeverity(severity) }} />
        <span className="text-xs font-medium text-gray-700 tracking-wide">
          {SEVERITY_LABELS[key]}
        </span>
      </div>
    ))}
  </div>
);

// ─── RiskDistributionChart ───────────────────────────────────────
interface RiskDistributionChartProps {
  packages: PackageResult[];
}

export const RiskDistributionChart = ({ packages }: RiskDistributionChartProps) => {
  const data = prepareChartData(packages);

  if (data.length === 0) {
    return (
      <div className="bg-gray-950 border border-[#1E2D3D] rounded-lg p-10 text-center font-ptsans text-white">
        <div className="text-3xl mb-2" style={{color: "#1A7A4A"}}>✓</div>
        <p className="text-sm tracking-[0.05em]">
          No vulnerabilities found
        </p>
      </div>
    );
  }

  // Trunca nombres largos para el eje X
  const formatXLabel = (name: string) =>
    name.length > 12 ? name.slice(0, 11) + "…" : name;

  return (
    <div className="bg-white rounded-lg shadow font-ptsans" style={{
      padding: "24px 16px 16px",
    }}>
      {/* Header */}
      <div className="flex justify-between font-ptsans text-gray-900 align-baseline mb-5 pl-2">
        <h3 className="font-semibold text-sm tracking-[0.08em] px-2">
          CVE Distribution
        </h3>
        <span className="text-sm">
          {data.length} package{data.length !== 1 ? "s" : ""} affected
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
          barSize={data.length > 8 ? 18 : 28}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E2D3D"
            vertical={false}
          />
          <XAxis
          
            dataKey="name"
            tickFormatter={formatXLabel}
            tick={{ fill: "#8BA3B8", fontSize: 14, fontFamily: "'PT Sans', sans-serif" }}
            axisLine={{ stroke: "#1E2D3D" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#8BA3B8", fontSize: 13, fontFamily: "'PT Sans', sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1E2D3D", opacity: 0.5 }} />

          {/* Barras apiladas por severidad — orden de más a menos grave */}
          <Bar dataKey="CRITICAL" stackId="a" fill={getColorFromSeverity("CRITICAL")} radius={[0, 0, 0, 0]} />
          <Bar dataKey="HIGH"     stackId="a" fill={getColorFromSeverity("HIGH")}     radius={[0, 0, 0, 0]} />
          <Bar dataKey="MEDIUM"   stackId="a" fill={getColorFromSeverity("MEDIUM")}   radius={[0, 0, 0, 0]} />
          <Bar dataKey="LOW"      stackId="a" fill={getColorFromSeverity("LOW")}      radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
};

export default RiskDistributionChart;