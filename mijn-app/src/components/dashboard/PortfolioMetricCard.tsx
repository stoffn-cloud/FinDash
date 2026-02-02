"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// Helper voor interne formatting als de prop een nummer is
const formatTrend = (val: number) => {
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
};

interface PortfolioMetricCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string | number;
  className?: string;
  delay?: number;
}

export default function PortfolioMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  trendValue,
  className,
  delay = 0,
}: PortfolioMetricCardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -3 }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-black/20",
        "border border-white/5 backdrop-blur-xl p-7",
        "hover:border-blue-500/40 hover:bg-black/40 transition-all duration-500 group",
        className
      )}
    >
      {/* Terminal Decor: Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Background Glow */}
      <div className={cn(
        "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[70px] transition-colors duration-1000 opacity-20 group-hover:opacity-40",
        isPositive ? "bg-emerald-500" : isNegative ? "bg-rose-500" : "bg-blue-500"
      )} />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase italic group-hover:text-slate-300 transition-colors">
              {title}
            </p>
            <div className="h-0.5 w-6 bg-blue-500/40 rounded-full group-hover:w-12 transition-all duration-500" />
          </div>

          {Icon && (
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-500">
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-3xl font-mono font-black text-white tracking-tighter italic">
            {value ?? "N/A"}
          </h3>

          <div className="flex items-center gap-3">
            {trendValue !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border",
                  isPositive && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                  isNegative && "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
                  !isPositive && !isNegative && "bg-white/5 text-slate-400 border-white/10"
                )}
              >
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                <span>
                  {typeof trendValue === 'number' ? formatTrend(trendValue) : trendValue}
                </span>
              </div>
            )}

            {subtitle && (
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest font-mono">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Scanning Line Effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}