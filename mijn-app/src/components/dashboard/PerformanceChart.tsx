"use client";

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
import { TrendingUp, BarChart3 } from "lucide-react";

// ---------------------- TYPES ----------------------
interface PerformancePoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
}

interface PerformanceChartProps {
  data?: PerformancePoint[];
  benchmarkName?: string;
}

// ---------------------- CUSTOM TOOLTIP ----------------------
// Gebruik 'any' voor de props om de Recharts mismatch te voorkomen
const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/5">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
          {label ? format(parseISO(label), "dd MMMM yyyy") : ""}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" 
                  style={{ color: entry.color, backgroundColor: entry.color }} 
                />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">
                  {entry.name}
                </span>
              </div>
              <span className="text-[11px] font-mono font-black text-white">
                {entry.value >= 0 ? '+' : ''}{Number(entry.value).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({
  data = [],
  benchmarkName = "MSCI World",
}: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 rounded-3xl bg-black/20 border border-white/5 flex flex-col items-center justify-center">
        <BarChart3 className="w-10 h-10 text-slate-800 mb-4 opacity-20" />
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting yield data nodes...</p>
      </div>
    );
  }

  // ---------------------- NORMALISATIE (T0 = 0%) ----------------------
  const startPortfolio = data[0].portfolioValue || 1;
  const startBenchmark = data[0].benchmarkValue || 1;

  const normalizedData = data.map(item => ({
    date: item.date,
    Portfolio: ((item.portfolioValue - startPortfolio) / startPortfolio) * 100,
    [benchmarkName]: ((item.benchmarkValue - startBenchmark) / startBenchmark) * 100,
  }));

  const lastP = normalizedData[normalizedData.length - 1].Portfolio;
  const lastB = normalizedData[normalizedData.length - 1][benchmarkName] as number;
  const alpha = lastP - lastB;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-black/20 border border-white/5 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white italic uppercase tracking-[0.1em]">Performance Engine</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Cumulative Yield vs Benchmark</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/[0.03] px-5 py-3 rounded-2xl border border-white/5 text-right min-w-[120px]">
            <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-tighter">Relative Alpha</p>
            <p className={cn("text-xl font-mono font-black italic tracking-tighter", alpha >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {alpha >= 0 ? '+' : ''}{alpha.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      

      {/* Chart */}
      <div className="h-[340px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={normalizedData}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
            <XAxis 
              dataKey="date"
              stroke="#475569"
              fontSize={9}
              fontWeight="900"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => format(parseISO(val), "MMM yy").toUpperCase()}
              dy={15}
            />
            <YAxis
              stroke="#475569"
              fontSize={9}
              fontWeight="900"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeOpacity: 0.1, strokeWidth: 1 }} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              content={({ payload }) => (
                <div className="flex justify-end gap-6 mb-8">
                  {payload?.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            
            <Line
              name={benchmarkName}
              type="monotone"
              dataKey={benchmarkName}
              stroke="#475569"
              strokeWidth={1.5}
              strokeDasharray="6 6"
              dot={false}
              activeDot={false}
            />

            <Area
              name="Strategy Alpha"
              type="monotone"
              dataKey="Portfolio"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#colorPortfolio)"
              dot={false}
              activeDot={{ r: 4, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={2500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-600">
        <span className="uppercase tracking-[0.2em]">Data stream: Normalized T0 origin</span>
        <span className="italic uppercase">Logarithmic variance suppression: OFF</span>
      </div>
    </motion.div>
  );
}