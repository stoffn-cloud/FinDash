"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { PortfolioHistoryPoint } from "@/types";

interface PerformanceChartProps {
  data: PortfolioHistoryPoint[]; 
}

const formatValueCompact = (val: number) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    notation: 'compact',
    maximumFractionDigits: 1 
  }).format(val);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border-l-blue-500 border-l-4">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
          {new Date(label).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-slate-300 text-xs font-semibold">Portfolio Value</span>
          </div>
          <span className="text-white font-mono text-sm font-black">
            {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2 
            }).format(Number(payload[0]?.value) || 0)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data = [] }: PerformanceChartProps) {
  // 1. Fix voor Hydration & Container sizing error (width -1)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Kleine timeout om te zorgen dat de DOM en CSS volledig klaar zijn
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Sorteer op datum om zeker te zijn dat de lijn van links naar rechts loopt
    return [...data].sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  // We tonen pas iets als we gemonteerd zijn EN data hebben
  // Als we maar 1 datapunt hebben, tonen we een melding (Recharts kan geen lijn trekken met 1 punt)
  if (!isMounted || chartData.length < 2) {
    return (
      <div className="w-full h-[500px] min-h-[500px] flex flex-col items-center justify-center bg-slate-900/10 rounded-[2rem] border border-white/5">
        <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin mb-4" />
        <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.3em] text-center px-10 leading-relaxed">
          {chartData.length === 1 
            ? "Need more than one date point to draw chart..." 
            : "Synchronizing Historical Data..."}
          <br/>
          <span className="text-[8px] opacity-50">Range: {chartData[0]?.date || 'None'} to 2025-12-31</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] min-h-[500px] p-2 select-none relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#1e293b" 
            strokeOpacity={0.2} 
          />
          
          <XAxis
            dataKey="date"
            stroke="#475569"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            dy={10}
            minTickGap={40}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }}
          />
          
          <YAxis
            stroke="#475569"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatValueCompact(value)}
            orientation="right"
            domain={['auto', 'auto']}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
            isAnimationActive={false}
          />
          
          <Area
            type="monotone"
            dataKey="total_value"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1000}
            connectNulls={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}