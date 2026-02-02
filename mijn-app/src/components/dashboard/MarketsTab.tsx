"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Landmark, 
  ArrowRightLeft, 
  TrendingUp,
  Globe,
  Scale,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, TooltipProps } from "recharts";

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }: any) => {
  // Check of de tooltip actief is en data bevat
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md ring-1 ring-white/5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          {data.maturity} Maturity
        </p>
        <p className="text-blue-400 text-lg font-mono font-bold">
          {payload[0].value.toFixed(3)}%
        </p>
      </div>
    );
  }
  return null;
};

// --- DATA (Constanten blijven gelijk aan jouw voorbeeld) ---
const CENTRAL_BANK_RATES = [
  { bank: "Federal Reserve", flag: "🇺🇸", rate: 4.50, previousRate: 4.75, nextDecision: "Jan 29, 2026" },
  { bank: "ECB", flag: "🇪🇺", rate: 3.15, previousRate: 3.40, nextDecision: "Mar 6, 2026" },
  { bank: "Bank of England", flag: "🇬🇧", rate: 4.25, previousRate: 4.50, nextDecision: "Feb 6, 2026" },
  { bank: "Bank of Japan", flag: "🇯🇵", rate: 0.50, previousRate: 0.25, nextDecision: "Mar 14, 2026" },
];

const EXCHANGE_RATES = [
  { pair: "EUR/USD", rate: 1.0842, change: 0.35 },
  { pair: "GBP/USD", rate: 1.2715, change: -0.18 },
  { pair: "USD/JPY", rate: 148.52, change: 0.72 },
  { pair: "USD/CHF", rate: 0.8825, change: -0.25 },
];

const YIELD_CURVE = [
  { maturity: "1M", yield: 4.35 }, { maturity: "2Y", yield: 4.12 },
  { maturity: "5Y", yield: 4.05 }, { maturity: "10Y", yield: 4.18 },
  { maturity: "30Y", yield: 4.38 },
];

export default function MarketsTab() {
  const isDecisionDay = true; // Hardcoded voor demo context 29 jan 2026

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20">
            <Globe className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Global Macro Monitor</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Real-time Monetary & FX Node</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase">Live Markets</span>
        </div>
      </motion.div>

      {/* 1. Central Bank Rates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CENTRAL_BANK_RATES.map((item) => (
          <motion.div key={item.bank} whileHover={{ scale: 1.02 }} className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{item.flag}</span>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</p>
                <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase">Dovish Shift</p>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{item.bank}</p>
            <p className="text-3xl font-mono font-black text-white italic tracking-tighter">{item.rate.toFixed(2)}%</p>
            
            <div className={cn(
              "mt-6 py-2 px-3 rounded-xl text-[9px] font-black text-center uppercase tracking-widest border transition-all",
              item.bank === "Federal Reserve" ? "bg-rose-500/20 text-rose-500 border-rose-500/30 animate-pulse" : "bg-white/5 text-slate-400 border-white/5"
            )}>
              {item.bank === "Federal Reserve" ? "FOMC Decision Today" : `Next: ${item.nextDecision}`}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Yield Curve Visualization */}
        
        <div className="lg:col-span-2 bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">US Treasury Yield Curve</h3>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <span className="text-[9px] font-black text-slate-500 uppercase">Current</span>
               </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={YIELD_CURVE}>
                <defs>
                  <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="maturity" stroke="#475569" fontSize={10} fontStyle="italic" tickLine={false} axisLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                <YAxis domain={[3.8, 4.6]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="yield" stroke="#3B82F6" strokeWidth={4} fill="url(#yieldColor)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. FX Multi-Node List */}
        <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-10">
            <ArrowRightLeft className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">FX Matrix</h3>
          </div>
          <div className="space-y-8">
            {EXCHANGE_RATES.map((item) => (
              <div key={item.pair} className="flex justify-between items-center group cursor-crosshair">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-400 group-hover:text-white transition-colors tracking-tighter uppercase">{item.pair}</span>
                  <span className="text-[8px] font-mono text-slate-600 uppercase">Spot Rate</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-bold text-white tracking-tighter">{item.rate.toFixed(4)}</p>
                  <p className={cn("text-[10px] font-black font-mono", item.change >= 0 ? "text-emerald-500" : "text-rose-500")}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
             <div className="flex items-center gap-3">
               <Scale className="w-4 h-4 text-slate-500" />
               <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-tight">
                 PPP Valuation: <span className="text-emerald-500">JPY Undervalued (-35%)</span>
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}