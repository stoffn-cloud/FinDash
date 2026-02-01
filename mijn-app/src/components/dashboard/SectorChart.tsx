import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sector } from "@/types/dashboard";

interface SectorChartProps {
  sectors: Sector[];
}

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Violet
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
];

// ---------------------- CUSTOM TOOLTIP ----------------------
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as Sector; // type assertion
    return (
      <div className="bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">
          {data.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-mono font-bold">
            {data.percentage.toFixed(1)}%
          </span>
          <span className="text-slate-500 text-[10px]">van totaal</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SectorChart({ sectors }: SectorChartProps) {
  return (
    <Card className="bg-slate-900/40 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-base">Sector Allocatie</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center">
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="percentage"
              >
                {sectors.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 space-y-2">
          {sectors.map((sector, index) => (
            <div key={index} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors">
                  {sector.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 group-hover:text-white">
                {sector.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </motion.div>
  );
}
