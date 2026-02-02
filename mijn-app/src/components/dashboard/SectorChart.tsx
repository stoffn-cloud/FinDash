"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// --- TYPES ---
interface Sector {
  name: string;
  percentage: number;
}

interface SectorChartProps {
  sectors: Sector[];
}

// --- COLORS (High-Contrast Quant Palette) ---
const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Violet
  "#F59E0B", // Amber
  "#06B6D4", // Cyan
  "#F43F5E", // Rose
];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/5">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
          Sector Node
        </p>
        <p className="text-white text-xs font-bold uppercase mb-2">{data.name}</p>
        <div className="flex items-center gap-2 border-t border-white/5 pt-2">
          <span className="text-blue-400 font-mono font-black text-sm">
            {data.percentage.toFixed(1)}%
          </span>
          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Weighting</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SectorChart({ sectors }: SectorChartProps) {
  if (!sectors || sectors.length === 0) {
    return (
      <div className="rounded-3xl bg-black/20 border border-white/5 p-8 flex flex-col items-center justify-center h-[320px]">
        <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 animate-spin-slow mb-4" />
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No allocation data detected</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-black/20 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Sector Exposure</h3>
          <div className="h-0.5 w-8 bg-blue-500/40 rounded-full mt-1 group-hover:w-16 transition-all duration-500" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
           <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-tighter">Live Analysis</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-10">
        {/* Chart Container */}
        <div className="w-56 h-56 relative shrink-0">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Hubs</span>
            <span className="text-3xl font-mono font-black text-white italic tracking-tighter leading-none">
              {sectors.length}
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectors}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={92}
                paddingAngle={6}
                dataKey="percentage"
                stroke="none"
                animationDuration={1500}
              >
                {sectors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-crosshair outline-none"
                    style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}44)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Panel */}
        <div className="flex-1 w-full space-y-2 max-h-[220px] overflow-y-auto pr-4 custom-scrollbar">
          {sectors.map((sector, index) => (
            <motion.div 
              key={`${sector.name}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2.5 px-4 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all group/item"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_12px_currentColor]" 
                  style={{ color: COLORS[index % COLORS.length], backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight group-hover/item:text-slate-200 transition-colors">
                  {sector.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full bg-slate-700 w-full opacity-20" />
                </div>
                <span className="text-[11px] font-mono font-black text-white italic">
                  {sector.percentage.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      
      
      {/* Footer Meta */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">Data Origin: Portfolio Aggregate</span>
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">Diversification Index: Optimized</span>
      </div>
    </motion.div>
  );
}