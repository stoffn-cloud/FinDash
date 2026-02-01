"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const SECTOR_DATA = [
  { name: "Information Technology", value: 28.5, color: "#3b82f6" },
  { name: "Financials", value: 15.2, color: "#10b981" },
  { name: "Healthcare", value: 12.8, color: "#8b5cf6" },
  { name: "Consumer Discretionary", value: 10.5, color: "#f59e0b" },
  { name: "Communication Services", value: 8.4, color: "#ec4899" },
  { name: "Industrials", value: 7.2, color: "#06b6d4" },
];

export default function SectorChart() {
  
  // De "No-Nonsense" Tooltip Bypass
  const renderSectorTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-800 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
            Sector Allocation
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-white font-bold text-sm">{data.name}</span>
          </div>
          <p className="text-blue-400 font-mono font-black text-xs mt-1">
            {data.value.toFixed(1)}% of Portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SECTOR_DATA}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {SECTOR_DATA.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={renderSectorTooltip} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total</span>
          <span className="text-white text-2xl font-black italic">100%</span>
        </div>
      </div>

      {/* Custom Legend - Korter en cleaner dan de Recharts default */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 w-full px-4">
        {SECTOR_DATA.map((item, i) => (
          <div key={i} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                {item.name}
              </span>
            </div>
            <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-blue-400">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}