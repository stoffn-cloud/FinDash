import { motion } from "framer-motion";
import { 
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps
} from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// ---------------------- TYPES ----------------------
interface PerformancePoint {
  date: string; // ISO date string
  portfolioValue: number;
  benchmarkValue: number;
}

interface NormalizedPoint {
  date: string;
  Portfolio: number;
  [key: string]: number | string;
}

interface CustomTooltipPayload {
  name: string;
  value: number;
  color: string;
}

// ---------------------- CUSTOM TOOLTIP ----------------------
// We gebruiken : any om de Recharts 'payload' error te omzeilen
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md border-l-4 border-l-blue-500">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-sm text-slate-300">Portfolio Waarde:</span>
            <span className="text-sm font-mono font-bold text-white">
              ${payload[0].value.toLocaleString()}
            </span>
          </div>
          {/* Optioneel: als je een tweede lijn hebt (bijv. benchmark) */}
          {payload[1] && (
            <div className="flex items-center justify-between gap-8">
              <span className="text-sm text-slate-500 italic">Benchmark:</span>
              <span className="text-sm font-mono font-bold text-slate-400">
                ${payload[1].value.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// ---------------------- PERFORMANCE CHART ----------------------
interface PerformanceChartProps {
  data?: PerformancePoint[];
  benchmarkName?: string;
}

export default function PerformanceChart({
  data = [],
  benchmarkName = "Benchmark",
}: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-center">
        <p className="text-slate-500 italic">Geen rendementsdata beschikbaar</p>
      </div>
    );
  }

  // ---------------------- NORMALISATIE ----------------------
  const startPortfolio = data[0].portfolioValue || 1;
  const startBenchmark = data[0].benchmarkValue || 1;

  const normalizedData: NormalizedPoint[] = data.map(item => ({
    date: item.date,
    Portfolio: ((item.portfolioValue - startPortfolio) / startPortfolio) * 100,
    [benchmarkName]: ((item.benchmarkValue - startBenchmark) / startBenchmark) * 100,
  }));

  const lastPortfolio = normalizedData[normalizedData.length - 1].Portfolio || 0;
  const lastBenchmark = normalizedData[normalizedData.length - 1][benchmarkName] as number || 0;
  const alpha = lastPortfolio - lastBenchmark;

  // ---------------------- RENDER ----------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Performance vs Markt</h3>
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">Cumulatief Rendement (%)</p>
        </div>
        <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Alpha</p>
          <p className={cn("text-lg font-mono font-bold", alpha >= 0 ? "text-emerald-400" : "text-rose-400")}>
            {alpha >= 0 ? '↑' : '↓'} {Math.abs(alpha).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={normalizedData}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date"
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => format(parseISO(val), "MMM")}
              interval="preserveStartEnd"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
            
            {/* Benchmark lijn */}
            <Line
              name={benchmarkName}
              type="monotone"
              dataKey={benchmarkName}
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />

            {/* Portfolio area + lijn */}
            <Area
              name="Jouw Portfolio"
              type="monotone"
              dataKey="Portfolio"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#colorPortfolio)"
              dot={false}
              activeDot={{ r: 6, fill: "#3B82F6", stroke: "#0f172a", strokeWidth: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
