import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, Line, ResponsiveContainer, type DotItemDotProps, Bar, ReferenceLine } from 'recharts';
import type { AnomalyEvent, Baseline, TimePoint } from '../types';



// Interfaces
// 1. Estructura para los objetos dentro del array de Latencia
interface LatencyEntry {
  timestamp: string;
  latency_per_minute: number;
  max_latency: number;
  latency_threshold: number;
  anomalies_count: number;
}

// 2. Estructura para los objetos dentro del array de Bytes
interface BytesEntry {
  timestamp: string;
  total_bytes: number;
  max_bytes: number;
  bytes_threshold: number;
  anomalies_count: number;
}

interface TransformedData {
  Latency: LatencyEntry[];
  Bytes: BytesEntry[];
}

interface CustomizedDotProps extends DotItemDotProps {
  threshold: number;
}
interface LegendConfig {
  bar: { label: string; color: string };
  area: { label: string; color: string };
  line: { label: string; color: string };
  reference: { label: string; color: string };
}

interface CustomLegendProps {
  config: LegendConfig;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string; // "ms", "KB", "req", etc.
  thresholdKey: string; // La key para comparar (ej: "latency_threshold")
}
interface TrafficTwinChartProps {
  baseline: Baseline;
  timeseries: TimePoint[];
}


const prepareChartData = (baseline: Baseline, timeseries: TimePoint[]): TransformedData => {
  return {
    Latency: timeseries.map(point => ({
      timestamp: point.timestamp,
      // Mapeamos avg_latency a latency_per_minute para tu componente
      latency_per_minute: point.avg_latency,
      max_latency: point.max_latency,
      latency_threshold: baseline.latency_threshold,
      anomalies_count: point.latency_anomaly_count,
    })),

    Bytes: timeseries.map(point => ({
      timestamp: point.timestamp,
      total_bytes: point.total_bytes,
      max_bytes: point.max_bytes,
      bytes_threshold: baseline.bytes_threshold,
      anomalies_count: point.bytes_anomaly_count,
    }))
  };
};

// Custom Dot

const CustomizedDot: React.FC<CustomizedDotProps> = ({
  threshold,
  ...props
}) =>  {
  const { cx, cy, value } = props;

    if (cx == null || cy == null) {
      return <g />;
    }

    if (value > threshold) {
      return (
        <svg x={cx - 7} y={cy - 7} width={14} height={14} fill="red" viewBox="0 0 1024 1024">
          <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
        </svg>
      );
    }
    return <circle {...props} />;
  };

// Custom Legend
const CustomLegend: React.FC<CustomLegendProps> = ({ config }) => {
  const items = [
    { key: 'area', type: 'area', ...config.area },
    { key: 'bar', type: 'bar', ...config.bar },
    { key: 'line', type: 'line', ...config.line },
    { key: 'ref', type: 'ref', ...config.reference },
  ];

  return (
    <div className="flex justify-center flex-wrap gap-6 mt-4 font-ptsans">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          {/* Icono dinámico según el tipo de dato */}
          {item.type === 'area' && (
            <div style={{ width: 14, height: 10, backgroundColor: item.color, opacity: 0.3, border: `1px solid ${item.color}`, borderRadius: 2 }} />
          )}
          {item.type === 'bar' && (
            <div style={{ width: 14, height: 10, backgroundColor: item.color, borderRadius: 2 }} />
          )}
          {item.type === 'line' && (
            <div className="flex items-center">
              <div style={{ width: 16, height: 2, backgroundColor: item.color }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.color, marginLeft: -11 }} />
            </div>
          )}
          {item.type === 'ref' && (
            <div style={{ width: 16, height: 2, borderBottom: `2px dashed ${item.color}` }} />
          )}
          
          <span className="text-xs font-medium text-gray-700 tracking-wide">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
// Custiom Legend


// Custom Tooltip
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, thresholdKey }) => {
  if (active && payload && payload.length) {
    // Buscamos el valor del threshold en los datos del punto actual
    const thresholdValue = payload.find(p => p.dataKey === thresholdKey)?.value || 0;
    
    // Formatear la fecha (asumiendo ISO string)
    const formattedDate = new Date(label || "").toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' ,
      hour12: false,
    timeZone: 'UTC'
    });

    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-lg p-3 font-ptsans min-w-[160px]">
        <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-bold border-b pb-1">
          {formattedDate}
        </p>
        
        <div className="space-y-1.5">
          {payload.map((entry, index) => {
            const key = entry.dataKey.toString().toLowerCase();
            const isValueMain = entry.dataKey !== thresholdKey;
            const isExceeded = isValueMain && entry.value > thresholdValue;
            let displayValue = "";
            if (key.includes('bytes')) {
              displayValue = formatBytes(entry.value);
            } else if (key.includes('latency')) {
              displayValue = `${entry.value.toFixed(2)} ms`;
            } else {
              displayValue = entry.value.toLocaleString();
            }
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    style={{ width: 8, height: 8, borderRadius: '2px', backgroundColor: entry.color }} 
                  />
                  <span className="text-xs text-gray-600 capitalize">
                    
                    {(() => {
                      if (entry.name == "latency_per_minute") {
                        return "Avg latency/min";
                      }
                      if (entry.name == "total_bytes") {
                        return "Total bytes/min";
                      }
                      return entry.name.replace(/_/g, ' ')
                    })()}:
                  </span>
                </div>
                <span className={`text-[11px] font-bold ${isExceeded ? 'text-red-600' : 'text-gray-900'}`}>
                  {displayValue} {isExceeded && "⚠️"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

/* Sample data
const baselineEntry: Baseline = {
    "latency_mean": 120.5,
    "latency_std": 15.2,
    "bytes_mean": 5500.0,
    "bytes_std": 800.0,
    "events_per_min": 45.0,
    "latency_threshold": 166.1,
    "bytes_threshold": 7900.0
  };

const timeseriesEntry: TimePoint[] = [
    {
      "timestamp": "2023-10-27T10:00:00Z",
      "avg_latency": 118.2,
      "max_latency": 130.0,
      "total_bytes": 5400,
      "max_bytes": 6000,
      "event_count": 42,
      "latency_anomaly_count": 0,
      "bytes_anomaly_count": 0
    },
    {
      "timestamp": "2023-10-27T10:05:00Z",
      "avg_latency": 185.4,
      "max_latency": 210.5,
      "total_bytes": 5800,
      "max_bytes": 6200,
      "event_count": 48,
      "latency_anomaly_count": 1,
      "bytes_anomaly_count": 0
    },
    {
      "timestamp": "2023-10-27T10:10:00Z",
      "avg_latency": 125.1,
      "max_latency": 140.0,
      "total_bytes": 8200,
      "max_bytes": 9000,
      "event_count": 55,
      "latency_anomaly_count": 0,
      "bytes_anomaly_count": 1
    }
  ];
*/

export const TrafficTwinChart: React.FC<TrafficTwinChartProps> = ({ baseline, timeseries }) => {

  // extraction data
  const { Latency, Bytes } = prepareChartData(baseline, timeseries)

  const latencyLegend = {
    area: { label: "Latency Threshold", color: "#d42406" },
    bar: { label: "Avg Latency/Min", color: "#FFB347" },
    line: { label: "Max Latency", color: "#E67E22" },
    reference: { label: "Latency Mean", color: "#7F8C8D" }
  };

  // Configuración para la leyenda de Bytes
  const bytesLegend = {
    area: { label: "Bytes Threshold", color: "#06b6d4" },
    bar: { label: "Total Bytes/Min", color: "#5DADE2" },
    line: { label: "Peak Bytes", color: "#2E86C1" },
    reference: { label: "Bytes Mean", color: "#707B7C" }
  };

  
  return (
  <div className="flex flex-col bg-white rounded-lg shadow font-ptsans min-w-150 px-4 pb-4 pt-6 h-full">
    <div className="flex justify-between font-ptsans text-gray-900 align-baseline mb-5 pl-2">
      <h3 className="font-semibold text-sm tracking-[0.08em] uppercasepx-2">
        Latency Behavior Profile
      </h3>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart
        style={{ maxWidth: '80vw', maxHeight: '70vh', aspectRatio: 1.618 }} syncId="anyId"
        data={Latency}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="timestamp" tick={{ fill: "#8BA3B8", fontSize: 14, fontFamily: "'PT Sans', sans-serif" }} axisLine={{ stroke: "#1E2D3D" }} tickLine={true} padding={{ left: 30, right: 30 }}/>
        <YAxis width="auto" tick={{ fill: "#8BA3B8", fontSize: 13, fontFamily: "'PT Sans', sans-serif" }} axisLine={true} tickLine={true} />
      
        <Legend content={<CustomLegend config={latencyLegend} />} />
        <Tooltip 
          content={
            <CustomTooltip 
              unit="ms" 
              thresholdKey="latency_threshold" 
            />
          }
        />
        <Area type="monotone" dataKey="latency_threshold" fill="#d42406" stroke="#d42406" strokeOpacity={0} fillOpacity={0.2}/>
      
        <Bar dataKey="latency_per_minute" barSize={20} fill="#FFB347" />
        <ReferenceLine y={baseline.latency_mean} label={{ 
          value: `baseline: ${baseline.latency_mean}`, 
          position: 'insideBottomRight',      // Opciones: 'top', 'bottom', 'left', 'right', 'insideTopLeft', etc.
          fill: '#7F8C8D',          // Color del texto
          fontSize: 12 
        }}  stroke="#7F8C8D"/>
        <Line type="monotone" dataKey="max_latency" stroke="#E67E22" activeDot={{ r: 4 }} dot={(props) => (
          <CustomizedDot
            {...props}
            threshold={baseline.latency_threshold}
          />
        )} />
        
      </ComposedChart>
    </ResponsiveContainer>

    <div className="flex justify-between font-ptsans text-gray-900 align-baseline mb-5 pl-2 mt-10">
      <h3 className="font-semibold text-sm tracking-[0.08em] uppercasepx-2">
        Traffic Volume Analysis
      </h3>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart
        style={{ maxWidth: '80vw', maxHeight: '70vh', aspectRatio: 1.618 }} syncId="anyId"
        data={Bytes}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="timestamp" tick={{ fill: "#8BA3B8", fontSize: 14, fontFamily: "'PT Sans', sans-serif" }} axisLine={{ stroke: "#1E2D3D" }} tickLine={true} padding={{ left: 30, right: 30 }}/>
        <YAxis width="auto" tick={{ fill: "#8BA3B8", fontSize: 13, fontFamily: "'PT Sans', sans-serif" }} axisLine={true} tickLine={true} />
      
        <Legend content={<CustomLegend config={bytesLegend} />}/>
        <Tooltip 
          content={
            <CustomTooltip 
              unit="B" 
              thresholdKey="bytes_threshold" 
            />
          } 
        />
        <Area type="monotone" dataKey="bytes_threshold" fill="#06b6d4" stroke="#06b6d4" strokeOpacity={0} fillOpacity={0.2}/>
      
        <Bar dataKey="total_bytes" barSize={20} fill="#5DADE2" />
        <ReferenceLine y={baseline.bytes_mean} label={{ 
          value: `baseline: ${baseline.bytes_mean}`, 
          position: 'insideBottomRight',      // Opciones: 'top', 'bottom', 'left', 'right', 'insideTopLeft', etc.
          fill: '#7F8C8D',          // Color del texto
          fontSize: 12 
        }}  stroke="#7F8C8D"/>
        <Line type="monotone" dataKey="max_bytes" stroke="#2E86C1" activeDot={{ r: 4 }} dot={(props) => (
          <CustomizedDot
            {...props}
            threshold={baseline.bytes_threshold}
          />
        )} />
        
      </ComposedChart>
    </ResponsiveContainer>
    
  </div>
);

};
