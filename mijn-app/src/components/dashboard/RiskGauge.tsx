import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RiskGauge({ label, value, maxValue = 2, unit = "", description }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Determine risk level color
  const getRiskColor = () => {
    if (percentage < 33) return { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/20" };
    if (percentage < 66) return { bar: "bg-amber-500", text: "text-amber-400", glow: "shadow-amber-500/20" };
    return { bar: "bg-rose-500", text: "text-rose-400", glow: "shadow-rose-500/20" };
  };
  
  const colors = getRiskColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        <span className={cn("text-2xl font-bold", colors.text)}>
          {value.toFixed(2)}{unit}
        </span>
      </div>
      
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors.bar, "shadow-lg", colors.glow)}
        />
      </div>
      
      {/* Scale markers */}
      <div className="flex justify-between mt-2 text-xs text-slate-600">
        <span>0</span>
        <span>{maxValue / 2}</span>
        <span>{maxValue}</span>
      </div>
      
      {description && (
        <p className="text-xs text-slate-500 mt-3">{description}</p>
      )}
    </motion.div>
  );
}