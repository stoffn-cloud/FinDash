"use client";

import React from "react";
import { 
  TrendingDown, Info, Calendar, Globe, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { cn } from "@/lib/utils";

// 1. Data
const yieldCurveData = [
  { period: "1M", yield: 5.38 },
  { period: "3M", yield: 5.42 },
  { period: "6M", yield: 5.35 },
  { period: "1Y", yield: 5.02 },
  { period: "2Y", yield: 4.65 },
  { period: "5Y", yield: 4.28 },
  { period: "10Y", yield: 4.22 },
  { period: "20Y", yield: 4.45 },
  { period: "30Y", yield: 4.38 },
];

const Activity = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default function MarketsTab() {
  
  // 2. De "Any" Tooltip omweg
  const renderYieldTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/90 border border-slate-700 backdrop-blur-md rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/10">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">
            Maturity: {data.period}
          </p>
          <p className="text-blue-400 text-sm font-mono font-bold">
            {data.yield.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Market Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Fed Funds Rate", value: "5.50%", change: "Unchanged", status: "Neutral", icon: Zap },
          { label: "ECB Rate", value: "4.50%", change: "-25bps", status: "Bullish", icon: Globe },
          { label: "US CPI (YoY)", value: "3.20%", change: "-0.1%", status: "Bullish", icon: TrendingDown },
          { label: "Fear & Greed", value: "64", change: "+2", status: "Greed", icon: Activity }
        ].map((item, i) => (
          <Card key={i} className="bg-slate-900/40 backdrop-blur-sm border-slate-800/60">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <item.icon className="w-4 h-4 text-blue-400" />
                </div>
                <Badge variant="outline" className="text-[9px] font-bold uppercase bg-slate-950/40 border-slate-700 text-slate-400">
                  {item.status}
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono tracking-tighter">{item.value}</span>
                <span className={cn("text-[10px] font-bold", item.change.startsWith('-') ? "text-emerald-400" : "text-slate-400")}>
                  {item.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yield Curve Chart */}
        <Card className="lg:col-span-2 bg-slate-900/40 backdrop-blur-sm border-slate-800/60 shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-6">
            <div>
              <CardTitle className="text-white text-lg font-black tracking-tight flex items-center gap-2 italic uppercase">
                US Treasury Yield Curve
                <Info className="w-3 h-3 text-slate-600" />
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs font-medium italic">Term structure of interest rates</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] pt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="period" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} domain={[4, 6]} tickFormatter={(val) => `${val}%`} />
                
                {/* TOOLTIP FIX APPLIED HERE */}
                <Tooltip content={renderYieldTooltip} cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} />
                
                <Area type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Economic Calendar */}
        <Card className="bg-slate-900/40 backdrop-blur-sm border-slate-800/60 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-800/50 pb-6">
            <CardTitle className="text-white text-lg font-black tracking-tight uppercase italic">Economic Calendar</CardTitle>
            <CardDescription className="text-xs font-medium text-slate-500 italic">Volatility triggers - Next 48H</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { event: "Initial Jobless Claims", time: "14:30", impact: "High", country: "US" },
                { event: "Retail Sales MoM", time: "14:30", impact: "High", country: "US" },
                { event: "Industrial Production", time: "15:15", impact: "Medium", country: "US" },
                { event: "Michigan Consumer Sentiment", time: "16:00", impact: "Medium", country: "US" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/30 border border-slate-800/50 hover:bg-slate-800/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-[9px] font-black text-slate-500">
                      {item.country}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-200">{item.event}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                        <Calendar className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-mono font-bold uppercase">{item.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={cn("text-[8px] px-2 py-0.5 font-black uppercase tracking-tighter", item.impact === "High" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20")}>
                    {item.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}