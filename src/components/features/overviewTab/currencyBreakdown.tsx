"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

// --- VEILIGE FORMATTERS ---
// Voorkomt "toLocaleString of undefined" crashes
const formatCurrency = (val: number | undefined | null) => {
  const safeVal = val ?? 0;
  return `$${safeVal.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`;
};

const formatPercentage = (val: number | undefined | null) => {
  const safeVal = val ?? 0;
  return `${safeVal.toFixed(1)}%`;
};

// --- CONSTANTEN ---
const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵",
  CHF: "🇨🇭", CAD: "🇨🇦", AUD: "🇦🇺", CNY: "🇨🇳",
  HKD: "🇭🇰", SGD: "🇸🇬",
};

const CURRENCY_COLORS: Record<string, string> = {
  USD: "bg-blue-500",
  EUR: "bg-emerald-500",
  GBP: "bg-violet-500",
  JPY: "bg-rose-500",
  CHF: "bg-amber-500",
  CAD: "bg-cyan-500",
  DEFAULT: "bg-slate-600"
};

// --- TYPES ---
interface Currency {
  code?: string;
  currency_code?: string;
  ISO_code?: string;
  percentage?: number;
  allocation_percent?: number;
  value?: number;
}

interface CurrencyBreakdownProps {
  currencies?: Currency[];
}

export default function CurrencyBreakdown({ currencies = [] }: CurrencyBreakdownProps) {
  // 1. Render Loading/Empty state
  if (!currencies || currencies.length === 0) {
    return (
      <div className="rounded-[2rem] bg-slate-900/40 border border-white/5 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Globe className="w-10 h-10 text-slate-800 mb-4 animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Establishing FX Feed...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] bg-slate-900/20 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden h-full"
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full -mr-16 -mt-16" />

      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-1">FX Allocation</h3>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter leading-none">Global Currency Exposure</p>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Globe className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      {/* Stacked Bar (De visuele verdeling) */}
      <div className="h-2 rounded-full overflow-hidden flex mb-10 bg-slate-950 border border-white/5 shadow-inner relative z-10">
        {currencies.map((currency, index) => {
          const code = currency.code || currency.currency_code || currency.ISO_code || "UNK";
          const pct = currency.percentage ?? currency.allocation_percent ?? 0;

          return (
            <motion.div
              key={`bar-${code}-${index}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
              className={cn(
                CURRENCY_COLORS[code] || CURRENCY_COLORS.DEFAULT,
                "h-full border-r border-black/20 last:border-0"
              )}
            />
          );
        })}
      </div>

      {/* Currency List (De legenda) */}
      <div className="space-y-5 relative z-10">
        {currencies.map((currency, index) => {
          const code = currency.code || currency.currency_code || currency.ISO_code || "UNK";
          const pct = currency.percentage ?? currency.allocation_percent ?? 0;
          const val = currency.value ?? 0;

          return (
            <div key={`list-${code}-${index}`} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-lg border border-white/5 group-hover:border-blue-500/30 transition-all">
                  {CURRENCY_FLAGS[code] || "🌐"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-wide">{code}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {formatCurrency(val)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Visual indicator (Dots) */}
                <div className="hidden md:flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1 h-1 rounded-full transition-colors duration-500",
                        i < Math.ceil(pct / 20) 
                          ? (CURRENCY_COLORS[code] || CURRENCY_COLORS.DEFAULT)
                          : "bg-slate-800"
                      )}
                    />
                  ))}
                </div>
                
                <div className="text-right min-w-[60px]">
                  <p className="text-sm font-mono font-bold text-white">
                    {formatPercentage(pct)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="mt-8 pt-5 border-t border-white/5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          FX Parity Node Active
        </span>
      </div>
    </motion.div>
  );
}