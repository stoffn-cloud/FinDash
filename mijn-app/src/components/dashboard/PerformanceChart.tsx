"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function PerformanceChart({ data }: any) {
  // We definiëren de tooltip DIRECT in de component als een anonieme functie
  // Dit omzeilt de strikte interface-controles van externe componenten
  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-slate-800 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl ring-1 ring-white/10">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            {label ? format(parseISO(label), "dd MMM yyyy", { locale: nl }) : ""}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-10">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[11px] font-bold text-slate-300">
                    {entry.name === "portfolioValue" ? "Portfolio" : "Benchmark"}
                  </span>
                </div>
                <span className={cn(
                  "text-xs font-mono font-black",
                  entry.value >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
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

  return (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.4} />
          <XAxis 
            dataKey="date" 
            hide={false} 
            axisLine={false} 
            tickLine={false}
            tick={{fill: '#475569', fontSize: 10}}
            tickFormatter={(str) => format(parseISO(str), "MMM", { locale: nl })}
          />
          <YAxis 
            hide={false} 
            axisLine={false} 
            tickLine={false}
            tick={{fill: '#475569', fontSize: 10}}
            tickFormatter={(val) => `${val}%`}
          />
          
          {/* HIER GEBEURT HET: We geven de functie direct mee */}
          <Tooltip content={renderTooltip} cursor={{ stroke: '#334155', strokeDasharray: '4 4' }} />
          
          <ReferenceLine y={0} stroke="#334155" />
          <Area
            type="monotone"
            dataKey="benchmarkValue"
            stroke="#64748b"
            strokeDasharray="5 5"
            fill="transparent"
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorPortfolio)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}