import { motion } from "framer-motion";
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
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50",
        "border border-slate-700/50 backdrop-blur-xl p-6",
        "hover:border-slate-600/50 transition-all duration-300",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-semibold text-white tracking-tight">
              {value}
            </h3>
            {trendValue && (
              <span className={cn(
                "text-sm font-medium",
                isPositive && "text-emerald-400",
                isNegative && "text-rose-400",
                !isPositive && !isNegative && "text-slate-400"
              )}>
                {isPositive && "+"}{trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
}