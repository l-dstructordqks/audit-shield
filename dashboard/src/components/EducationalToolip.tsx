import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────
interface Explanation {
  title:  string;
  description: string;
  body:   string;
  action: string;
}

interface EducationalTooltipProps {
  type:     "cve" | "staleness" | "anomaly" | "score";
  data:     Record<string, unknown>;
  children: ReactNode;
}

// ─── getExplanation ───────────────────────────────────────────────
/**
 * Genera el contenido educativo según el tipo de alerta.
 * Cada explicación tiene: título, cuerpo y acción recomendada.
 */
export function getExplanation(
  type: string,
  data: Record<string, unknown>
): Explanation {
  switch (type) {

    case "cve": {
      const id       = data.id       as string;
      const description = data.description as string;
      const severity = data.severity as string;
      const score    = data.cvss_score != null ? ` (CVSS ${data.cvss_score})` : "";
      const pkg      = data.package  as string | undefined;
      const latest   = data.latest   as string | undefined;

      const severityDescriptions: Record<string, string> = {
        CRITICAL: "can be exploited remotely with no authentication and no user interaction required. This represents the highest possible risk.",
        HIGH:     "can be exploited remotely but may require some user interaction or specific conditions. Immediate attention is needed.",
        MEDIUM:   "requires specific conditions to be exploited, such as local network access or prior authentication.",
        LOW:      "has limited impact and generally requires physical access or very specific conditions to exploit.",
        UNKNOWN:  "does not have a CVSS score assigned yet. Treat this vulnerability with caution until more information is available.",
      };

      return {
        title:  `What is ${id}?`,
        description: `${description}`,
        body:   `${id} is a ${severity}${score} severity vulnerability that ${severityDescriptions[severity] ?? severityDescriptions.UNKNOWN}`,
        action: latest && pkg
          ? `Update by running: pip install --upgrade ${pkg}==${latest}`
          : `Check ${id} on NVD to find out which version patches this vulnerability.`,
      };
    }

    case "staleness": {
      const days = data.days as number;
      const name = data.name as string;

      let risk = "";
      if      (days > 730) risk = "a high risk — it likely has unpatched vulnerabilities.";
      else if (days > 365) risk = "a moderate risk — there may be known bugs left unresolved.";
      else                 risk = "something to monitor, though not critical yet.";

      return {
        title:  "What does Staleness mean?",
        body:   `${name} has not received updates in ${days} days. Unmaintained packages silently accumulate vulnerabilities over time. ${days} days of inactivity represents ${risk}`,
        action: `Look for an actively maintained alternative on PyPI, or consider forking the project if you depend on it.`,
      };
    }

    case "anomaly": {
      const anomalyType = data.type  as string;
      const value       = data.value as number;
      const threshold   = data.threshold as number;
      const mean        = data.mean      as number;
      const std         = data.std       as number;

      const descriptions: Record<string, { what: string; why: string; calc: string }> = {
        HIGH_LATENCY: {
          what: `A latency spike was detected above the normal threshold of ${threshold}ms.`,
          why:  "High latency spikes can indicate network congestion, a blocking process, or communication with geographically distant servers.",
          calc: `Threshold = mean (${mean.toFixed(1)}ms) + 2 × std (${std.toFixed(1)}ms) = ${threshold.toFixed(1)}ms. This covers 95% of normal traffic — any value above this is statistically unusual.`,
        },
        HIGH_BYTES: {
          what: `An unusually large data transfer was detected above the normal threshold of ${threshold} bytes.`,
          why:  "Unusual data volumes may indicate an unexpected large download or, in extreme cases, data exfiltration.",
          calc: `Threshold = mean (${mean.toFixed(0)} bytes) × 10 = ${threshold.toFixed(0)} bytes. A volume 10× above average is statistically unusual for normal traffic.`,
        },
      };

      const desc = descriptions[anomalyType] ?? {
        what: `A value of ${value} was detected exceeding the threshold of ${threshold}.`,
        why:  "This pattern deviates from the expected system behavior.",
      };

      return {
        title:  "What is a network anomaly?",
        body:   `${desc.what} ${desc.why} This is not necessarily an attack, it is a signal that deserves attention.\n\n📐How the threshold was calculated: \n${desc.calc}`,
        action: "Check which process generated this traffic and on which destination IP. Use the Endpoint Summary for more context.",
      };
    }

    case "score": {
      const score = data.score as number;
      const level = data.level as string;
      const V     = data.V    as number;
      const M     = data.M    as number;
      const N     = data.N    as number;

      const levelDesc: Record<string, string> = {
        RED:    "indicates critical risk. There are active vulnerabilities or highly unusual network patterns that require immediate action.",
        YELLOW: "indicates moderate risk. There are aspects to improve but they do not represent an immediate threat.",
        GREEN:  "indicates the project is in good security standing based on the criteria analyzed.",
      };

      return {
        title:  "How is the Audit Score calculated?",
        body:   `A score of ${score}/100 ${levelDesc[level] ?? ""}. It is calculated using the formula: Score = (0.5 × V) + (0.2 × M) + (0.3 × N), where V=${V} (vulnerabilities), M=${M} (maintenance) and N=${N} (network anomalies). A higher score means higher risk.`,
        action: V > M && V > N
          ? "The highest risk comes from CVE vulnerabilities. Update critical packages first."
          : M > N
          ? "The highest risk comes from maintenance. Update outdated packages."
          : "The highest risk comes from network anomalies. Review your application's outbound traffic.",
      };
    }

    default:
      return {
        title:  "Information",
        body:   "No explanation is available for this alert type.",
        action: "Check the Audit-Shield documentation for more information.",
      };
  }
}

// ─── EducationalTooltip ───────────────────────────────────────────
/**
 * Wrapper con ícono '?'. Al hover muestra un panel educativo
 * con título, cuerpo explicativo y acción recomendada.
 */
export const EducationalTooltip = ({
  type,
  data,
  children,
}: EducationalTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const containerRef = useRef<HTMLDivElement>(null);
  const explanation  = getExplanation(type, data);

  // Detecta si hay espacio arriba o abajo para mostrar el panel
  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition(rect.top > 200 ? "top" : "bottom");
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center gap-1.5"
    >
      {/* Contenido original */}
      {children}

      {/* Ícono '?' */}
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label={`Más información: ${explanation.title}`}
        className="
          inline-flex items-center justify-center
          w-4 h-4 rounded-full
          text-[10px] font-bold
          bg-gray-100 text-gray-500
          hover:bg-blue-100 hover:text-blue-600
          transition-colors cursor-help
          border border-gray-300 hover:border-blue-400
          flex-shrink-0
        "
      >
        ?
      </button>

      {/* Panel educativo */}
      {visible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 w-72 rounded-lg shadow-lg
            bg-white border border-gray-200
            p-4 font-ptsans
            ${position === "top"
              ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
              : "top-full mt-2 left-1/2 -translate-x-1/2"
            }
          `}
        >
          {/* Flecha */}
          <div className={`
            absolute left-1/2 -translate-x-1/2 w-2 h-2
            bg-white border-gray-200 rotate-45
            ${position === "top"
              ? "bottom-[-5px] border-r border-b"
              : "top-[-5px] border-l border-t"
            }
          `} />

          {/* Título */}
          <p className="text-xs font-semibold text-gray-900 mb-2 tracking-wide">
            {explanation.title}
          </p>

          {/* Description */}
          {explanation.description && (
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              {explanation.description}
            </p>
          )}

          {/* Cuerpo */}
          <p className="text-xs text-gray-600 leading-relaxed mb-3 whitespace-pre-line">
            {explanation.body}
          </p>

          {/* Acción */}
          <div className="bg-blue-50 rounded p-2 border-l-2 border-blue-400">
            <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
              Recommended action
            </p>
            <p className="text-xs text-blue-800 leading-relaxed font-mono">
              {explanation.action}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalTooltip;

/*
// En DependencyTable — junto al badge de severidad
<EducationalTooltip type="cve" data={{ id: vuln.id, severity: vuln.severity, cvss_score: vuln.cvss_score, package: pkg.name, latest: pkg.latest_version }}>
  <RiskBadge level={vuln.severity} />
</EducationalTooltip>

// En DependencyTable — junto a los días sin update
<EducationalTooltip type="staleness" data={{ days: pkg.days_since_update, name: pkg.name }}>
  <span>{pkg.days_since_update} días</span>
</EducationalTooltip>

// En ScoreGauge — junto al score total
<EducationalTooltip type="score" data={{ score: auditScore, level: auditLevel, ...breakdown }}>
  <ScoreGauge score={auditScore} level={auditLevel} breakdown={breakdown} />
</EducationalTooltip>

*/