"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";

interface RiskGaugeProps {
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  description?: string;
}

export default function RiskGauge({
  label,
  value,
  maxValue = 2,
  unit = "",
  description,
}: RiskGaugeProps) {
  const safeValue = isNaN(value) ? 0 : value;
  const percentage = Math.min((safeValue / maxValue) * 100, 100);

  const getRiskAnalysis = () => {
    if (percentage < 33) return { color: "text-emerald-500", bar: "bg-emerald-500", label: "Defensive", icon: ShieldCheck };
    if (percentage < 66) return { color: "text-amber-500", bar: "bg-amber-500", label: "Moderate", icon: Activity };
    return { color: "text-rose-500", bar: "bg-rose-500", label: "Aggressive", icon: AlertTriangle };
  };

  const analysis = getRiskAnalysis();
  const segments = Array.from({ length: 20 }); // De 20 stapjes in de meter

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
            {label}
          </span>
          <div className="flex items-center gap-2">
            <analysis.icon className={cn("w-3 h-3", analysis.color)} />
            <span className={cn("text-[10px] font-black uppercase tracking-widest", analysis.color)}>
              {analysis.label} Exposure
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className={cn("text-3xl font-mono font-black italic tracking-tighter", analysis.color)}>
            {safeValue.toFixed(2)}{unit}
          </span>
        </div>
      </div>

      

      {/* Segmented Gauge Meter */}
      <div className="relative space-y-2">
        <div className="flex gap-1 h-3">
          {segments.map((_, i) => {
            const segmentStep = 100 / segments.length;
            const isActive = percentage >= (i + 1) * segmentStep;
            
            return (
              <div 
                key={i}
                className={cn(
                  "flex-1 rounded-[2px] transition-all duration-500",
                  isActive 
                    ? cn(analysis.bar, "shadow-[0_0_10px_currentColor]", "opacity-100") 
                    : "bg-white/5 opacity-30"
                )}
                style={{ color: isActive ? 'inherit' : 'transparent' }}
              />
            );
          })}
        </div>
        
        {/* De 'Needle' Marker */}
        <motion.div 
          initial={{ left: 0 }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="absolute top-0 w-0.5 h-5 bg-white shadow-[0_0_10px_#fff] z-20 -mt-1"
        />
      </div>

      {/* Scale Nodes */}
      <div className="flex justify-between mt-4 px-1 border-t border-white/5 pt-3">
        <span className="text-[9px] font-black text-slate-600 font-mono italic">0.00 MIN</span>
        <span className="text-[9px] font-black text-slate-600 font-mono italic">{(maxValue / 2).toFixed(1)} MID</span>
        <span className="text-[9px] font-black text-slate-600 font-mono italic">{maxValue.toFixed(1)} MAX</span>
      </div>

      {description && (
        <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
          <p className="text-[9px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight italic">
            {description}
          </p>
        </div>
      )}

      {/* Bottom Glow Effect */}
      <div className={cn(
        "absolute -bottom-10 -left-10 w-32 h-32 blur-[60px] opacity-10 transition-colors duration-1000",
        analysis.bar
      )} />
    </motion.div>
  );
}