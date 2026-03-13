"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrichedAssetSector } from "@/types";

interface SectorChartProps {
  sectors: EnrichedAssetSector[];
}

const FALLBACK_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EnrichedAssetSector;
    return (
      <div className="glass-panel p-2 rounded-lg border-slate-700/50 shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
          {data.name}
        </p>
        <div className="flex flex-col gap-0.5">
           <span className="text-blue-400 font-mono text-xs font-bold">
             {data.allocation_percent.toFixed(2)}%
           </span>
           <span className="text-slate-500 text-[9px] font-mono">
             {new Intl.NumberFormat('en-US', { 
               style: 'currency', 
               currency: 'USD', 
               notation: 'compact' 
             }).format(data.current_value)}
           </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SectorChart({ sectors = [] }: SectorChartProps) {
  const sortedSectors = useMemo(() => 
    [...sectors].sort((a, b) => b.allocation_percent - a.allocation_percent)
  , [sectors]);

  // Als er geen data is, tonen we een subtiele placeholder ipv een lege Recharts crash
  if (sortedSectors.length === 0) {
    return (
      <div className="h-[160px] flex items-center justify-center border border-dashed border-white/10 rounded-xl">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">No Sector Data</span>
      </div>
    );
  }

  return (
    <Card className="bg-transparent border-none shadow-none w-full">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          Sector Exposure
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex items-center gap-6">
        {/* FIX: Geforceerde breedte en hoogte voor de container om de -1 error te voorkomen */}
        <div className="w-[140px] h-[140px] min-w-[140px] min-h-[140px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedSectors}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={65}
                paddingAngle={4}
                dataKey="allocation_percent"
                nameKey="name"
                stroke="none"
                // Voeg een kleine animation duration toe zodat de browser tijd heeft om de grid te tekenen
                animationDuration={800}
              >
                {sortedSectors.map((entry: EnrichedAssetSector, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none shadow-xl"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="flex-1 space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
          {sortedSectors.map((sector: EnrichedAssetSector, index: number) => (
            <div key={sector.id || sector.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: sector.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length] }}
                />
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                  {sector.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300">
                {sector.allocation_percent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}