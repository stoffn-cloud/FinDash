import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

// ---------------------- TYPES ----------------------
interface Sector {
  name: string;
  percentage: number;
}

interface SectorChartProps {
  sectors: Sector[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {}

// ---------------------- COLORS ----------------------
const COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#8B5CF6", // violet
  "#F59E0B", // amber
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#6366F1", // indigo
];

// ---------------------- CUSTOM TOOLTIP ----------------------
// We gebruiken : any om de strikte (en vaak incomplete) Recharts types te omzeilen
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-white font-medium mb-1">{data.name}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Waarde:</span>
          <span className="text-blue-400 font-mono">
            €{data.value.toLocaleString("nl-NL")}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// ---------------------- COMPONENT ----------------------
export default function SectorChart({ sectors }: SectorChartProps) {
  if (!sectors || sectors.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 flex items-center justify-center h-[300px]">
        <p className="text-slate-500 italic text-sm font-medium">Geen sector data beschikbaar</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em]">Sector Allocatie</h3>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="w-48 h-48 relative shrink-0">
          {/* Het "Gat" in het midden vullen met informatie */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Sectoren</span>
            <span className="text-xl font-mono font-bold text-white">{sectors.length}</span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="percentage"
                stroke="none"
              >
                {sectors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:brightness-125 transition-all cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {sectors.map((sector, index) => (
            <div 
              key={sector.name} 
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-800/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors tracking-tight">
                  {sector.name}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-white">
                {sector.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />
    </motion.div>
  );
}
