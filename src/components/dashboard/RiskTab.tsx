"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  TrendingDown, 
  Shield, 
  Layers, 
  Percent,
  AlertTriangle,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskTabProps {
  portfolio?: any;
}

const RiskCard = ({ title, value, subtitle, icon: Icon, color = "blue" }: any) => {
  const colorMap: any = {
    blue: "text-blue-500 border-blue-500/20 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    amber: "text-amber-500 border-amber-500/20 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    violet: "text-violet-500 border-violet-500/20 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]",
    rose: "text-rose-500 border-rose-500/20 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
  };

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-black/20 border border-white/5 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-2.5 rounded-xl border transition-colors", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full w-1/2 rounded-full", color.replace('text', 'bg'))} />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic group-hover:text-slate-300 transition-colors">
        {title}
      </p>
      <h3 className="text-3xl font-mono font-black text-white mt-2 italic tracking-tighter">
        {value}
      </h3>
      <p className="text-[9px] text-slate-600 mt-3 font-mono uppercase tracking-widest">{subtitle}</p>
    </motion.div>
  );
};

export default function RiskTab({ portfolio }: RiskTabProps) {
  const metrics = portfolio?.risk_metrics || { var_95: 12450, max_drawdown: 14.2 };
  const volatility = portfolio?.volatility || "18.4";
  const beta = portfolio?.beta || "1.12";

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header with Telemetry Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <Shield className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Risk Telemetry</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              Stress-test node: <span className="text-slate-300 font-bold">{portfolio?.name || "Global Strategy"}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-2 pr-5 rounded-2xl">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Monitoring</span>
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase">Latency: 14ms</span>
        </div>
      </div>

      

      {/* Primary Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RiskCard 
          title="Value at Risk (VaR)" 
          value={`$${metrics.var_95.toLocaleString()}`} 
          subtitle="95% Confidence / 1M" 
          icon={TrendingDown} 
          color="blue" 
        />
        <RiskCard 
          title="Max Drawdown" 
          value={`${metrics.max_drawdown}%`} 
          subtitle="Peak-to-Trough" 
          icon={ArrowDownRight} 
          color="rose" 
        />
        <RiskCard 
          title="Portfolio Beta" 
          value={beta} 
          subtitle="Sensitivity Index" 
          icon={Activity} 
          color="violet" 
        />
        <RiskCard 
          title="Volatility (σ)" 
          value={`${volatility}%`} 
          subtitle="Annualized Realized" 
          icon={Percent} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Concentration Analysis: Instrumented progress bars */}
        <div className="lg:col-span-2 bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Constraint Monitor</h3>
            </div>
            <div className="flex items-center gap-2">
               <Zap className="w-3 h-3 text-amber-500" />
               <span className="text-[9px] font-mono text-slate-500 uppercase">Soft limits active</span>
            </div>
          </div>
          
          <div className="space-y-10">
            {[
              { label: "Equity Concentration", val: 65, color: "bg-blue-500", limit: 70 },
              { label: "Sector Limit (Technology)", val: 42, color: "bg-violet-500", limit: 45 },
              { label: "USD Currency Exposure", val: 82, color: "bg-emerald-500", limit: 90 }
            ].map((item) => (
              <div key={item.label} className="group/bar">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em] mb-4">
                  <span className="text-slate-500 group-hover/bar:text-slate-300 transition-colors">{item.label}</span>
                  <div className="flex gap-3">
                    <span className="text-slate-600">LIMIT {item.limit}%</span>
                    <span className="text-white font-mono">{item.val}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn(
                      "h-full rounded-full relative z-10",
                      item.color,
                      item.val > item.limit * 0.9 ? "animate-pulse shadow-[0_0_15px_#f43f5e]" : ""
                    )}
                  />
                  {/* Limit Marker */}
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-rose-500/50 z-20 shadow-[0_0_8px_#f43f5e]" 
                    style={{ left: `${item.limit}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Risk Ratings */}
        <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col">
          <h3 className="text-sm font-black text-white mb-10 flex items-center gap-3 uppercase tracking-widest italic">
            <Shield className="w-5 h-5 text-emerald-500" />
            Risk Ratings
          </h3>
          <div className="space-y-5 flex-1">
            {[
              { label: "Credit Default Risk", rating: "LOW", color: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" },
              { label: "Liquidity Depth", rating: "STABLE", color: "text-amber-500 border-amber-500/20 bg-amber-500/5" },
              { label: "Systemic Market Risk", rating: "ELEVATED", color: "text-rose-500 border-rose-500/20 bg-rose-500/5" }
            ].map((risk) => (
              <div key={risk.label} className="flex justify-between items-center p-4 rounded-2xl border border-white/5 bg-white/[0.02] group/item hover:bg-white/[0.04] transition-all">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight group-hover/item:text-slate-300">{risk.label}</span>
                <span className={cn("text-[9px] font-black px-3 py-1.5 rounded-lg border italic tracking-widest", risk.color)}>
                  {risk.rating}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-5 bg-blue-600/5 border border-blue-600/10 rounded-2xl relative overflow-hidden group">
            <div className="flex gap-4 relative z-10">
              <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic uppercase tracking-tighter">
                Variance calculations utilize a rolling <span className="text-white">36-month daily window</span>. Tail-risk events are modeled using Monte Carlo simulations with 10k iterations.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 blur-[40px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}