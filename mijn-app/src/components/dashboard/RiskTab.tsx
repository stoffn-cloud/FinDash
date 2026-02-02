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
  ShieldAlert,
  ArrowDownRight
} from "lucide-react";

interface RiskTabProps {
  portfolio?: any;
}

// Interne helper component voor de statistieken kaarten
const RiskCard = ({ title, value, subtitle, icon: Icon, color = "blue" }: any) => {
  // Mapping voor dynamische Tailwind classes om purgen te voorkomen
  const colorMap: any = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-500",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-500",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl rounded-2xl p-5 hover:border-slate-700/50 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg border ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-mono font-black text-white mt-1">{value}</h3>
      <p className="text-[10px] text-slate-500 mt-2 font-medium">{subtitle}</p>
    </motion.div>
  );
};

export default function RiskTab({ portfolio }: RiskTabProps) {
  // Val terug op mock data als de prop (nog) leeg is om lege gaten te voorkomen
  const metrics = portfolio?.risk_metrics || {
    var_95: 0,
    expected_shortfall: 0,
    max_drawdown: 0
  };

  const volatility = portfolio?.volatility || "0.0";
  const beta = portfolio?.beta || "1.00";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header sectie met status indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Risk Engine</h2>
          <p className="text-slate-500 text-sm font-medium">Stress testing & Tail-risk exposure for <span className="text-slate-300">{portfolio?.name || "Active Portfolio"}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Engine: Operational</span>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid: Gevoed door portfolio prop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskCard 
          title="Value at Risk (VaR)" 
          value={`$${metrics.var_95.toLocaleString()}`} 
          subtitle="95% Confidence / 1M Horizon" 
          icon={TrendingDown} 
          color="blue" 
        />
        <RiskCard 
          title="Max Drawdown" 
          value={`${metrics.max_drawdown}%`} 
          subtitle="Historical Peak-to-Trough" 
          icon={ArrowDownRight} 
          color="rose" 
        />
        <RiskCard 
          title="Portfolio Beta" 
          value={beta} 
          subtitle={`vs. ${portfolio?.benchmark_index || 'S&P 500'}`} 
          icon={Activity} 
          color="violet" 
        />
        <RiskCard 
          title="Volatility (σ)" 
          value={`${volatility}%`} 
          subtitle="Annualized Standard Dev." 
          icon={Percent} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concentration Analysis */}
        <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800/40 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Exposure Limits
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">INTERNAL COMPLIANCE</span>
          </div>
          
          <div className="space-y-8">
            {[
              { label: "Equity Concentration", val: 65, color: "bg-blue-500" },
              { label: "Sector Limit (Tech)", val: 42, color: "bg-violet-500" },
              { label: "Currency Risk (USD)", val: 85, color: "bg-emerald-500" }
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white">{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${item.color} rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Risk Assessment */}
        <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Risk Ratings
          </h3>
          <div className="space-y-6">
            {[
              { label: "Credit Risk", rating: "LOW", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
              { label: "Liquidity Risk", rating: "MED", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
              { label: "Market Risk", rating: "HIGH", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" }
            ].map((risk) => (
              <div key={risk.label} className="flex justify-between items-center p-3 rounded-xl border border-slate-800/50 bg-slate-800/20">
                <span className="text-xs font-bold text-slate-400 uppercase">{risk.label}</span>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${risk.color}`}>
                  {risk.rating}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                Risk parameters are calculated based on a rolling 36-month window using daily price returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}