import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortfolioMetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  className,
  delay = 0 
}) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }} // Subtiele lift bij hover
      className={cn(
        "relative overflow-hidden rounded-2xl bg-slate-900/40",
        "border border-slate-800 backdrop-blur-md p-6",
        "hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 group",
        className
      )}
    >
      {/* Achtergrond Glow Effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-colors" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.1em] uppercase">
              {title}
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-mono font-bold text-white tracking-tighter">
              {value || "---"}
            </h3>
            
            <div className="flex items-center gap-2">
              {trendValue && (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border",
                  isPositive && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  isNegative && "bg-rose-500/10 text-rose-400 border-rose-500/20",
                  !isPositive && !isNegative && "bg-slate-800 text-slate-400 border-slate-700"
                )}>
                  {isPositive && <TrendingUp className="w-3 h-3" />}
                  {isNegative && <TrendingDown className="w-3 h-3" />}
                  {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                  <span>{isPositive && "+"}{trendValue}</span>
                </div>
              )}
              {subtitle && (
                <span className="text-[11px] text-slate-500 font-medium">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
            <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
          </div>
        )}
      </div>
    </motion.div>
  );
}