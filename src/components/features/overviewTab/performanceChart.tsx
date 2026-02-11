import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
// Gebruik je centrale types
import { EnrichedAsset } from "@/types";

interface PerformanceChartProps {
  // We accepteren voor nu de enrichedAssets, maar we filteren ze 
  // of we gebruiken een lege array als de engine nog geen history heeft.
  data: any[]; 
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/50 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span className="text-slate-300 text-xs font-medium">Portfolio</span>
            </div>
            <span className="text-white font-mono text-xs font-bold">
              {payload[1]?.value?.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="text-slate-400 text-xs font-medium">Benchmark</span>
            </div>
            <span className="text-slate-400 font-mono text-xs">
              {payload[0]?.value?.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data = [] }: PerformanceChartProps) {
  // Voorlopige check: als de data geen datumpunten zijn, tonen we een lege staat
  // Dit voorkomt dat Recharts crasht op de 'enrichedAssets' array.
  const hasHistory = data.length > 0 && data[0].date;

  if (!hasHistory) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center border border-white/5 rounded-3xl bg-slate-900/20 backdrop-blur-sm">
        <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          Historical Feed Pending...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.05}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.03} />
          <XAxis
            dataKey="date"
            stroke="#475569"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              try {
                const date = new Date(value);
                return date.toLocaleDateString('nl-NL', { month: 'short' });
              } catch { return value; }
            }}
          />
          <YAxis
            stroke="#475569"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <ReferenceLine y={0} stroke="#475569" strokeWidth={1} strokeOpacity={0.5} />
          
          <Area
            type="monotone"
            dataKey="benchmarkValue"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorBenchmark)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPortfolio)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}