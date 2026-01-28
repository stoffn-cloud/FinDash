import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CURRENCY_FLAGS = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CNY: "🇨🇳",
  HKD: "🇭🇰",
  SGD: "🇸🇬",
};

const CURRENCY_COLORS = {
  USD: "bg-blue-500",
  EUR: "bg-emerald-500",
  GBP: "bg-violet-500",
  JPY: "bg-rose-500",
  CHF: "bg-amber-500",
  CAD: "bg-cyan-500",
  AUD: "bg-orange-500",
  CNY: "bg-pink-500",
  HKD: "bg-indigo-500",
  SGD: "bg-teal-500",
};

export default function CurrencyBreakdown({ currencies }) {
  if (!currencies || currencies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Currency Exposure</h3>
        <p className="text-slate-400">No currency data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Currency Exposure</h3>
      
      {/* Stacked bar */}
      <div className="h-4 rounded-full overflow-hidden flex mb-6">
        {currencies.map((currency, index) => (
          <motion.div
            key={currency.code}
            initial={{ width: 0 }}
            animate={{ width: `${currency.percentage}%` }}
            transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
            className={cn(
              CURRENCY_COLORS[currency.code] || "bg-slate-500",
              "h-full"
            )}
          />
        ))}
      </div>
      
      {/* Currency list */}
      <div className="space-y-3">
        {currencies.map((currency) => (
          <div key={currency.code} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{CURRENCY_FLAGS[currency.code] || "🌐"}</span>
              <div>
                <p className="text-sm font-medium text-white">{currency.code}</p>
                <p className="text-xs text-slate-500">
                  ${(currency.value / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currency.percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className={cn(
                    CURRENCY_COLORS[currency.code] || "bg-slate-500",
                    "h-full rounded-full"
                  )}
                />
              </div>
              <span className="text-sm font-semibold text-white w-14 text-right">
                {currency.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}