import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ---------------------- TYPES ----------------------
interface RiskGaugeProps {
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  description?: string;
}

// ---------------------- COMPONENT ----------------------
export default function RiskGauge({
  label,
  value,
  maxValue = 2,
  unit = "",
  description,
}: RiskGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const getRiskColor = () => {
    if (percentage < 33)
      return {
        bar: "bg-emerald-500",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/20",
        label: "Laag",
      };
    if (percentage < 66)
      return {
        bar: "bg-amber-500",
        text: "text-amber-400",
        glow: "shadow-amber-500/20",
        label: "Gemiddeld",
      };
    return {
      bar: "bg-rose-500",
      text: "text-rose-400",
      glow: "shadow-rose-500/20",
      label: "Hoog",
    };
  };

  const colors = getRiskColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            {label}
          </span>
          <p className={cn("text-[10px] font-bold mt-0.5 uppercase", colors.text)}>
            {colors.label} Risico
          </p>
        </div>
        <div className="text-right">
          <span className={cn("text-2xl font-mono font-bold", colors.text)}>
            {value.toFixed(2)}
            {unit}
          </span>
        </div>
      </div>

      {/* De Gauge Bar */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        {/* Sectie verdeling (Subtiele strepjes) */}
        <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
          <div className="w-px h-full bg-slate-400" />
          <div className="w-px h-full bg-slate-400" />
          <div className="w-px h-full bg-slate-400" />
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className={cn("h-full rounded-full relative z-10", colors.bar, colors.glow)}
        />
      </div>

      {/* Schaalverdeling getallen */}
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[9px] font-bold text-slate-600 font-mono">0.00</span>
        <span className="text-[9px] font-bold text-slate-600 font-mono">
          {(maxValue / 2).toFixed(1)}
        </span>
        <span className="text-[9px] font-bold text-slate-600 font-mono">{maxValue.toFixed(1)}</span>
      </div>

      {description && (
        <div className="mt-4 p-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <p className="text-[10px] text-slate-400 leading-relaxed italic">{description}</p>
        </div>
      )}
    </motion.div>
  );
}
