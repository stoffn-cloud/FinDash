import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// We importeren het type dat de engine daadwerkelijk uitspuugt
import { EnrichedAssetSector } from "@/types";

interface SectorChartProps {
  sectors: EnrichedAssetSector[];
}

// We gebruiken de kleuren die we in de engine hebben gedefinieerd voor consistentie,
// of vallen terug op deze array als de engine geen kleur meegeeft.
const FALLBACK_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EnrichedAssetSector;
    return (
      <div className="bg-slate-900/95 border border-slate-700/50 p-2 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-1">{data.name}</p>
        <p className="text-blue-400 font-mono text-xs font-bold">
          {data.allocation_percent?.toFixed(1)}%
        </p>
        <p className="text-slate-500 text-[9px] mt-1 italic">
          {data.holding_count} posities
        </p>
      </div>
    );
  }
  return null;
};

export default function SectorChart({ sectors = [] }: SectorChartProps) {
  // Filter sectoren zonder waarde om rommel in de chart te voorkomen
  const activeSectors = sectors.filter(s => (s.allocation_percent ?? 0) > 0);

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-white text-[11px] font-black uppercase tracking-[0.2em] italic opacity-80">
          Sector Distributie
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex items-center gap-4">
        {/* De Pie Chart */}
        <div className="w-[140px] h-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeSectors}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                // FIX: Gebruik allocation_percent ipv percentage
                dataKey="allocation_percent"
                stroke="none"
              >
                {activeSectors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    // Gebruik de kleur uit de engine (als die er is)
                    fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* De Legenda */}
        <div className="flex-1 space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {activeSectors.map((sector, index) => (
            <div key={index} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: sector.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length] }}
                />
                <span className="text-[10px] text-slate-500 group-hover:text-slate-200 transition-colors truncate">
                  {sector.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-blue-400 transition-colors">
                {sector.allocation_percent?.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}