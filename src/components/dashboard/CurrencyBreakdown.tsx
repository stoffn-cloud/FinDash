"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

// Inline formatters voor consistentie met de rest van de terminal
const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatPercentage = (val: number) => `${val.toFixed(1)}%`;

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

interface Currency {
  code: string;
  percentage: number;
  value: number;
}

interface CurrencyBreakdownProps {
  currencies?: Currency[];
}

export default function CurrencyBreakdown({ currencies = [] }: CurrencyBreakdownProps) {
  if (!currencies || currencies.length === 0) {
    return (
      <div className="rounded-3xl bg-black/20 border border-white/5 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Globe className="w-10 h-10 text-slate-800 mb-4 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
          No FX exposure data detected
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-black/20 border border-white/5 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full -mr-16 -mt-16" />

      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic">FX Allocation</h3>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter leading-none">Global Currency Exposure Index</p>
        </div>
        <Globe className="w-4 h-4 text-blue-500/50" />
      </div>

      {/* Main Stacked Bar - Terminal Style */}
      <div className="h-4 rounded-full overflow-hidden flex mb-12 bg-slate-900 border border-white/5 shadow-inner">
        {currencies.map((currency, index) => (
          <motion.div
            key={currency.code}
            initial={{ width: 0 }}
            animate={{ width: `${currency.percentage}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
            className={cn(
              CURRENCY_COLORS[currency.code] || CURRENCY_COLORS.DEFAULT,
              "h-full border-r border-black/30 last:border-0 relative group"
            )}
          >
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Detailed Node List */}
      <div className="space-y-6">
        {currencies.map((currency) => (
          <div key={currency.code} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-xl border border-white/5 group-hover:border-white/20 transition-all group-hover:scale-105">
                {CURRENCY_FLAGS[currency.code] || "🌐"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white font-mono tracking-widest">{currency.code}</span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                  {formatCurrency(currency.value)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Dynamic Progress Indicator */}
              <div className="hidden sm:flex items-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1 h-3 rounded-full transition-colors",
                      i < (currency.percentage / 10) 
                        ? (CURRENCY_COLORS[currency.code] || CURRENCY_COLORS.DEFAULT)
                        : "bg-slate-800"
                    )}
                  />
                ))}
              </div>
              
              <div className="text-right">
                <p className="text-sm font-black font-mono text-white tracking-tighter">
                  {formatPercentage(currency.percentage)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FX Risk Note */}
      <div className="mt-10 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Real-time FX parity node active
        </div>
      </div>
    </motion.div>
  );
}