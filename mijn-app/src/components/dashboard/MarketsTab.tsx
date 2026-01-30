import React from "react";
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
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, TooltipProps } from "recharts";

// --- TYPES ---
interface CentralBankRate {
  bank: string;
  country: string;
  flag: string;
  rate: number;
  previousRate: number;
  lastChange: string;
  nextDecision: string;
}

interface FXRate {
  pair: string;
  rate: number;
  change: number;
  flag: string;
}

interface PPP {
  country: string;
  flag: string;
  ppp: number;
  marketRate: number;
  valuation: number;
}

interface YieldData {
  maturity: string;
  yield: number;
}

// --- DATA ---
const CENTRAL_BANK_RATES: CentralBankRate[] = [
  { bank: "Federal Reserve", country: "USA", flag: "🇺🇸", rate: 4.50, previousRate: 4.75, lastChange: "Dec 2025", nextDecision: "Jan 29, 2026" },
  { bank: "European Central Bank", country: "EUR", flag: "🇪🇺", rate: 3.15, previousRate: 3.40, lastChange: "Jan 2026", nextDecision: "Mar 6, 2026" },
  { bank: "Bank of England", country: "UK", flag: "🇬🇧", rate: 4.25, previousRate: 4.50, lastChange: "Nov 2025", nextDecision: "Feb 6, 2026" },
  { bank: "Bank of Japan", country: "Japan", flag: "🇯🇵", rate: 0.50, previousRate: 0.25, lastChange: "Dec 2025", nextDecision: "Mar 14, 2026" },
];

const EXCHANGE_RATES: FXRate[] = [
  { pair: "EUR/USD", rate: 1.0842, change: 0.35, flag: "🇪🇺" },
  { pair: "GBP/USD", rate: 1.2715, change: -0.18, flag: "🇬🇧" },
  { pair: "USD/JPY", rate: 148.52, change: 0.72, flag: "🇯🇵" },
  { pair: "USD/CHF", rate: 0.8825, change: -0.25, flag: "🇨🇭" },
];

const PPP_DATA: PPP[] = [
  { country: "Switzerland", flag: "🇨🇭", ppp: 1.21, marketRate: 0.8825, valuation: -27.1 },
  { country: "Eurozone", flag: "🇪🇺", ppp: 0.88, marketRate: 0.92, valuation: 4.5 },
  { country: "Japan", flag: "🇯🇵", ppp: 96.5, marketRate: 148.52, valuation: -35.0 },
  { country: "United Kingdom", flag: "🇬🇧", ppp: 0.71, marketRate: 0.79, valuation: 11.3 },
];

const YIELD_CURVE: YieldData[] = [
  { maturity: "1M", yield: 4.35 },
  { maturity: "2Y", yield: 4.12 },
  { maturity: "10Y", yield: 4.18 },
  { maturity: "30Y", yield: 4.38 },
];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }: TooltipProps<YieldData, string>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as YieldData;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white text-xs font-bold">{data.maturity}</p>
        <p className="text-blue-400 text-sm font-mono">{data.yield.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

// --- COMPONENT ---
export default function MarketsTab() {
  const today = new Date("2026-01-29");

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Marktoverzicht</h2>
            <p className="text-sm text-slate-400">Macro-indicatoren & Valuta waarderingen</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300 py-1 px-3">
          Status: Live Markten
        </Badge>
      </motion.div>

      {/* 1. Central Bank Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CENTRAL_BANK_RATES.map((item) => {
          const change = item.rate - item.previousRate;
          const decisionDate = new Date(item.nextDecision);
          const isToday = decisionDate.toDateString() === today.toDateString();

          return (
            <motion.div key={item.bank} whileHover={{ y: -2 }}
              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{item.flag}</span>
                <Badge className={cn(
                  "text-[10px] font-bold",
                  change > 0 ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                )}>
                  {Math.abs(change * 100).toFixed(0)} bps
                </Badge>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.bank}</p>
              <p className="text-2xl font-mono font-bold text-white mt-1">{item.rate.toFixed(2)}%</p>

              <div className={cn(
                "mt-4 text-[10px] py-1 px-2 rounded-md font-bold text-center",
                isToday ? "bg-rose-500 text-white animate-pulse" : "bg-slate-800 text-slate-400"
              )}>
                {isToday ? "BESLUIT VANDAAG" : `VOLGENDE: ${item.nextDecision}`}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. PPP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-5 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Koopkrachtpariteit (PPP)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PPP_DATA.map((item) => (
              <div key={item.country} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.flag}</span>
                  <span className="text-xs font-bold text-slate-300">{item.country}</span>
                </div>
                <div className="text-right">
                  <p className={cn("text-xs font-bold", item.valuation > 0 ? "text-rose-400" : "text-emerald-400")}>
                    {item.valuation > 0 ? "Overvalued" : "Undervalued"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">{item.valuation.toFixed(1)}% vs USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. FX Rates */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ArrowRightLeft className="w-5 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">FX Pairs</h3>
          </div>
          <div className="space-y-4">
            {EXCHANGE_RATES.map((item) => (
              <div key={item.pair} className="flex justify-between items-center group">
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{item.pair}</span>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-white">{item.rate.toFixed(4)}</p>
                  <p className={cn("text-[10px] font-bold", item.change >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Yield Curve */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">US Treasury Yield Curve</h3>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={YIELD_CURVE}>
              <defs>
                <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="maturity" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[3.5, 5]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="yield" stroke="#3B82F6" strokeWidth={3} fill="url(#yieldColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
