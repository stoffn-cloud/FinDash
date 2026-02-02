"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Activity, 
  Target,
  PieChart as PieChartIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

// Inline formatters voor consistentie
const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatPercentage = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;

interface AssetClassDetailProps {
  assetClass: any | null; // De 'any' komt hier uit de engine (processedPortfolio.assetClasses)
  onClose: () => void;
}

const HOLDING_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", 
  "#06B6D4", "#F97316", "#6366F1", "#84CC16", "#14B8A6"
];

// ---------------------- CUSTOM TOOLTIP ----------------------
const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/5">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                {entry.name}
              </span>
            </div>
            <span className="text-[10px] font-mono font-black text-white">
              {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AssetClassDetail({ assetClass, onClose }: AssetClassDetailProps) {
  if (!assetClass) return null;

  // In de nieuwe engine zitten de holdings in 'assets'
  const holdings = assetClass.assets || [];
  
  // Sharpe Ratio berekening op basis van de nieuwe engine velden
  const sharpeRatio = assetClass.volatility 
    ? ((assetClass.projectedReturn - 4) / assetClass.volatility).toFixed(2) 
    : "0.00";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-slate-900 border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-slate-900/50 border-b border-white/5 p-8 flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                style={{ backgroundColor: `${assetClass.color}15`, border: `1px solid ${assetClass.color}30` }}
              >
                <PieChartIcon className="w-7 h-7" style={{ color: assetClass.color }} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{assetClass.name}</h2>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/20 uppercase text-[10px] font-black">Active Node</Badge>
                </div>
                <p className="text-slate-500 font-mono text-sm">
                  {assetClass.allocationPct?.toFixed(1)}% OF TOTAL · {formatCurrency(assetClass.value)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-500 hover:text-white hover:bg-white/5 rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Exp. Return", val: formatPercentage(assetClass.projectedReturn), icon: Target, color: "text-blue-400" },
                { label: "Volatility", val: formatPercentage(assetClass.volatility || 0), icon: Activity, color: "text-amber-400" },
                { label: "YTD Performance", val: formatPercentage(assetClass.performance?.ytd || 0), icon: null, color: (assetClass.performance?.ytd || 0) >= 0 ? "text-emerald-400" : "text-rose-400" },
                { label: "Sharpe Ratio", val: sharpeRatio, icon: null, color: "text-indigo-400" }
              ].map((metric, i) => (
                <div key={i} className="bg-black/20 rounded-2xl p-5 border border-white/5">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    {metric.icon && <metric.icon className="w-3 h-3" />} {metric.label}
                  </p>
                  <p className={cn("text-2xl font-black font-mono tracking-tighter", metric.color)}>
                    {metric.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Holdings & Pie Chart */}
            <div className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-sm font-black text-white uppercase italic">Constituent Assets</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{holdings.length} TICKERS</span>
              </div>

              {holdings.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-72 h-72 p-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={holdings} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60} 
                          outerRadius={90} 
                          dataKey="value" 
                          stroke="none"
                          paddingAngle={2}
                        >
                          {holdings.map((_: any, index: number) => (
                            <Cell key={index} fill={HOLDING_COLORS[index % HOLDING_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 w-full border-l border-white/5">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/5 hover:bg-transparent uppercase">
                          <TableHead className="text-[10px] font-black text-slate-500 pl-6">Ticker</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-500 text-right">Weight</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-500 text-right">Value</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-500 text-right pr-6">24H</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {holdings.map((holding: any, index: number) => (
                          <TableRow key={index} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: HOLDING_COLORS[index % HOLDING_COLORS.length] }} />
                                <span className="font-mono font-bold text-white uppercase">{holding.symbol}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-slate-400 font-mono text-xs">
                              {((holding.value / assetClass.value) * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right text-white font-mono font-medium">{formatCurrency(holding.value)}</TableCell>
                            <TableCell className={cn(
                              "text-right font-mono font-bold text-xs pr-6", 
                              (holding.returns?.d || 0) >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {formatPercentage(holding.returns?.d || 0)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="p-20 text-center text-slate-600 font-mono text-sm italic">No constituent data available.</div>
              )}
            </div>

            {/* Risk Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-rose-500/5 rounded-3xl border border-rose-500/10 p-6">
                <h3 className="text-xs font-black text-rose-400 uppercase mb-4 tracking-widest">Stress Test (Estimated)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-xs">Max Drawdown</span>
                    <span className="text-rose-400 font-mono font-black">-{formatPercentage((assetClass.volatility || 0) * 2.2)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-rose-500/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500/40 w-[65%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    Gebaseerd op historische volatiliteit en een 2.2x sigma event.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-500/5 rounded-3xl border border-blue-500/10 p-6">
                <h3 className="text-xs font-black text-blue-400 uppercase mb-4 tracking-widest">Efficiency</h3>
                <div className="flex items-center justify-between h-full pb-4">
                  <div className="text-center">
                    <p className="text-slate-500 text-[9px] uppercase font-black mb-1">Risk Adjusted</p>
                    <p className="text-2xl font-black text-white font-mono">{sharpeRatio}</p>
                  </div>
                  <div className="w-px h-10 bg-white/5" />
                  <div className="text-center">
                    <p className="text-slate-500 text-[9px] uppercase font-black mb-1">VaR (95%)</p>
                    <p className="text-xl font-black text-white font-mono">-{formatPercentage((assetClass.volatility || 0) * 0.4)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}