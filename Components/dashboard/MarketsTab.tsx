import { motion } from "framer-motion";
import { 
  Landmark, 
  ArrowRightLeft, 
  TrendingUp,
  Globe,
  Scale
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Central Bank Rates Data
const CENTRAL_BANK_RATES = [
  { bank: "Federal Reserve", country: "USA", flag: "🇺🇸", rate: 4.50, previousRate: 4.75, lastChange: "Dec 2025", nextDecision: "Jan 29, 2026" },
  { bank: "European Central Bank", country: "EUR", flag: "🇪🇺", rate: 3.15, previousRate: 3.40, lastChange: "Jan 2026", nextDecision: "Mar 6, 2026" },
  { bank: "Bank of England", country: "UK", flag: "🇬🇧", rate: 4.25, previousRate: 4.50, lastChange: "Nov 2025", nextDecision: "Feb 6, 2026" },
  { bank: "Bank of Japan", country: "Japan", flag: "🇯🇵", rate: 0.50, previousRate: 0.25, lastChange: "Dec 2025", nextDecision: "Mar 14, 2026" },
  { bank: "Swiss National Bank", country: "Switzerland", flag: "🇨🇭", rate: 1.25, previousRate: 1.50, lastChange: "Dec 2025", nextDecision: "Mar 20, 2026" },
  { bank: "Bank of Canada", country: "Canada", flag: "🇨🇦", rate: 3.75, previousRate: 4.00, lastChange: "Jan 2026", nextDecision: "Mar 12, 2026" },
  { bank: "Reserve Bank of Australia", country: "Australia", flag: "🇦🇺", rate: 4.10, previousRate: 4.35, lastChange: "Dec 2025", nextDecision: "Feb 18, 2026" },
];

// Exchange Rates (vs USD)
const EXCHANGE_RATES = [
  { pair: "EUR/USD", rate: 1.0842, change: 0.35, flag: "🇪🇺" },
  { pair: "GBP/USD", rate: 1.2715, change: -0.18, flag: "🇬🇧" },
  { pair: "USD/JPY", rate: 148.52, change: 0.72, flag: "🇯🇵" },
  { pair: "USD/CHF", rate: 0.8825, change: -0.25, flag: "🇨🇭" },
  { pair: "AUD/USD", rate: 0.6542, change: 0.48, flag: "🇦🇺" },
  { pair: "USD/CAD", rate: 1.3485, change: 0.12, flag: "🇨🇦" },
  { pair: "NZD/USD", rate: 0.6125, change: 0.32, flag: "🇳🇿" },
  { pair: "USD/CNY", rate: 7.2450, change: -0.08, flag: "🇨🇳" },
];

// Purchasing Power Parity (OECD Data)
const PPP_DATA = [
  { country: "Switzerland", flag: "🇨🇭", ppp: 1.21, marketRate: 0.8825, valuation: -27.1 },
  { country: "Norway", flag: "🇳🇴", ppp: 10.85, marketRate: 10.52, valuation: -3.0 },
  { country: "Eurozone", flag: "🇪🇺", ppp: 0.88, marketRate: 0.92, valuation: 4.5 },
  { country: "United Kingdom", flag: "🇬🇧", ppp: 0.71, marketRate: 0.79, valuation: 11.3 },
  { country: "Japan", flag: "🇯🇵", ppp: 96.5, marketRate: 148.52, valuation: -35.0 },
  { country: "Australia", flag: "🇦🇺", ppp: 1.48, marketRate: 1.53, valuation: 3.4 },
  { country: "Canada", flag: "🇨🇦", ppp: 1.24, marketRate: 1.35, valuation: 8.9 },
  { country: "South Korea", flag: "🇰🇷", ppp: 875, marketRate: 1385, valuation: -36.8 },
];

// US Treasury Yield Curve
const YIELD_CURVE = [
  { maturity: "1M", yield: 4.35 },
  { maturity: "3M", yield: 4.42 },
  { maturity: "6M", yield: 4.38 },
  { maturity: "1Y", yield: 4.25 },
  { maturity: "2Y", yield: 4.12 },
  { maturity: "5Y", yield: 4.05 },
  { maturity: "10Y", yield: 4.18 },
  { maturity: "20Y", yield: 4.45 },
  { maturity: "30Y", yield: 4.38 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white font-medium">{label}</p>
        <p className="text-blue-400 text-sm">{payload[0].value.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

export default function MarketsTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
          <Globe className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Market Overview</h2>
          <p className="text-sm text-slate-400">Key macro-economic indicators and market data</p>
        </div>
      </motion.div>

      {/* Central Bank Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Central Bank Policy Rates</h3>
              <p className="text-sm text-slate-400">Current interest rates by major central banks</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CENTRAL_BANK_RATES.map((item) => {
              const change = item.rate - item.previousRate;
              return (
                <div
                  key={item.bank}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{item.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.bank}</p>
                      <p className="text-xs text-slate-500">{item.country}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{item.rate.toFixed(2)}%</p>
                      <p className="text-xs text-slate-500">Last: {item.lastChange}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        (new Date(item.nextDecision) - new Date()) <= 7 * 24 * 60 * 60 * 1000 
                          ? "text-rose-400 font-medium" 
                          : "text-blue-400"
                      )}>Next: {item.nextDecision}</p>
                    </div>
                    <Badge className={cn(
                      "text-xs",
                      change > 0 ? "bg-rose-500/20 text-rose-400" : 
                      change < 0 ? "bg-emerald-500/20 text-emerald-400" : 
                      "bg-slate-500/20 text-slate-400"
                    )}>
                      {change > 0 ? "+" : ""}{(change * 100).toFixed(0)} bps
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* PPP Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <Scale className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Purchasing Power Parity</h3>
              <p className="text-sm text-slate-400">OECD PPP rates vs USD and currency valuation</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PPP_DATA.map((item) => (
              <div
                key={item.country}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{item.flag}</span>
                  <span className="text-sm font-medium text-white truncate">{item.country}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">PPP Rate</span>
                    <span className="text-white font-medium">{item.ppp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Market Rate</span>
                    <span className="text-slate-300">{item.marketRate}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-700/50">
                    <span className="text-slate-500">Valuation</span>
                    <span className={cn(
                      "font-semibold",
                      item.valuation > 0 ? "text-rose-400" : "text-emerald-400"
                    )}>
                      {item.valuation > 0 ? "+" : ""}{item.valuation.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Negative valuation = currency undervalued vs USD according to PPP
          </p>
        </div>
      </motion.div>
      
      {/* Exchange Rates and Yield Curve Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exchange Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <ArrowRightLeft className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Exchange Rates</h3>
                <p className="text-sm text-slate-400">Major currency pairs</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {EXCHANGE_RATES.map((item) => (
              <div
                key={item.pair}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.flag}</span>
                  <span className="font-medium text-white">{item.pair}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold">{item.rate.toFixed(4)}</span>
                  <span className={cn(
                    "text-sm font-medium w-16 text-right",
                    item.change >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Yield Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">US Treasury Yield Curve</h3>
                <p className="text-sm text-slate-400">Term structure of interest rates</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={YIELD_CURVE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="maturity" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[3.5, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#yieldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Rates */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700/50">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">2Y Treasury</p>
                <p className="text-lg font-bold text-white">4.12%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">10Y Treasury</p>
                <p className="text-lg font-bold text-white">4.18%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">2Y/10Y Spread</p>
                <p className="text-lg font-bold text-emerald-400">+6 bps</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}