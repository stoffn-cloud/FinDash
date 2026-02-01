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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as Sector;
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg">
        <p className="text-white text-xs font-medium">{data.name}</p>
        <p className="text-blue-400 font-mono text-xs">{data.percentage}%</p>
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
      </CardContent>
      <style>{`
        .recharts-pie-sector:focus {
          outline: none;
        }
      `}</style>
    </Card>
  );
}
