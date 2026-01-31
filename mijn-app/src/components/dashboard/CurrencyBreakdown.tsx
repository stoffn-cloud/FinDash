import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

// Flags en kleuren
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
  DEFAULT: "bg-slate-500"
};

// TypeScript types
interface Currency {
  code: string;        // USD, EUR, etc.
  percentage: number;  // percentage van portfolio
  value: number;       // absolute waarde in portfolio
}

interface CurrencyBreakdownProps {
  currencies?: Currency[];
}

export default function CurrencyBreakdown({ currencies = [] }: CurrencyBreakdownProps) {
  // Lege state fallback
  if (!currencies || currencies.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Valuta Blootstelling</h3>
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <Globe className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-sm italic">Geen valuta data beschikbaar</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Valuta Blootstelling</h3>
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">FX Exposure</span>
      </div>

      {/* Stacked Bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-8 bg-slate-800">
        {currencies.map((currency, index) => (
          <motion.div
            key={currency.code}
            initial={{ width: 0 }}
            animate={{ width: `${currency.percentage}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
            className={cn(
              CURRENCY_COLORS[currency.code] || CURRENCY_COLORS.DEFAULT,
              "h-full border-r border-slate-900/20 last:border-0"
            )}
            title={`${currency.code}: ${currency.percentage}%`}
          />
        ))}
      </div>

      {/* Gedetailleerde lijst */}
      <div className="space-y-4">
        {currencies.map((currency) => (
          <div key={currency.code} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg border border-slate-700/50 group-hover:border-slate-500 transition-colors">
                {CURRENCY_FLAGS[currency.code] || "🌐"}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">{currency.code}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">
                  {formatCurrency(currency.value)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Individuele voortgangsbalkjes */}
              <div className="hidden sm:block w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currency.percentage}%` }}
                  className={cn(
                    CURRENCY_COLORS[currency.code] || CURRENCY_COLORS.DEFAULT,
                    "h-full"
                  )}
                />
              </div>
              <span className="text-sm font-mono font-medium text-slate-300 w-12 text-right">
                {formatPercentage(currency.percentage, false, 1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
