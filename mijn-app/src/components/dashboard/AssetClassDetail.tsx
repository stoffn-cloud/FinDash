"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Target, PieChart as PieChartIcon, 
  Activity, TrendingUp, ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// We importeren AssetClass niet meer strikt als dat errors geeft, 
// maar we behouden de lokale interface voor holdings
interface Holding {
  name: string;
  ticker: string;
  weight: number;
  value: number;
  return_ytd: number;
}

const HOLDING_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", 
  "#06B6D4", "#F97316", "#6366F1", "#84CC16", "#14B8A6"
];

export default function AssetClassDetail({ assetClass, isOpen, onClose }: any) {
  if (!isOpen || !assetClass) return null;

  const holdings = assetClass.holdings || [];
  const current_value = assetClass.current_value || 0;
  const allocation = assetClass.allocation_percent || 0;
  
  // DE OPLOSSING: We coderen de tooltip direct als een 'any' functie 
  // Dit omzeilt alle "Property payload does not exist" errors.
  const renderCustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-800 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/10">
          <p className="text-white font-bold text-[10px] uppercase tracking-wider mb-1">{item.name}</p>
          <p className="text-slate-500 font-mono text-[10px] mb-2">{item.ticker}</p>
          <div className="flex flex-col gap-1">
            <span className="text-emerald-400 font-mono font-bold text-xs">
              {item.weight?.toFixed(1)}% Weight
            </span>
            <span className="text-slate-300 font-mono text-[10px]">
               ${(item.value / 1000).toFixed(0)}K Value
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const sharpeRatio = assetClass.volatility 
    ? ((assetClass.expected_return - 4) / assetClass.volatility).toFixed(2) 
    : "0.00";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="w-full max-w-5xl max-h-full overflow-hidden bg-slate-900/80 border border-slate-800/50 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div 
                className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner"
                style={{ backgroundColor: `${assetClass.color}15`, border: `1px solid ${assetClass.color}30` }}
              >
                <PieChartIcon className="w-8 h-8 shadow-sm" style={{ color: assetClass.color }} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{assetClass.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-400 font-mono text-[10px]">
                    {allocation.toFixed(1)}% ALLOC
                  </Badge>
                  <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">{formatCurrency(current_value)} Total</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-800 text-slate-500">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Exp. Return', val: `${assetClass.expected_return > 0 ? '+' : ''}${assetClass.expected_return?.toFixed(1)}%`, icon: Target, color: 'text-emerald-400' },
                { label: 'Volatility', val: `${assetClass.volatility?.toFixed(1) || "0.0"}%`, icon: Activity, color: 'text-amber-400' },
                { label: 'YTD Perf', val: `${assetClass.ytd_return > 0 ? '+' : ''}${assetClass.ytd_return?.toFixed(1)}%`, icon: TrendingUp, color: 'text-blue-400' },
                { label: 'Sharpe Ratio', val: sharpeRatio, icon: ShieldCheck, color: 'text-violet-400' }
              ].map((m, i) => (
                <div key={i} className="bg-slate-950/40 rounded-3xl p-5 border border-slate-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <m.icon className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{m.label}</span>
                  </div>
                  <p className={cn("text-2xl font-black font-mono tracking-tight", m.color)}>{m.val}</p>
                </div>
              ))}
            </div>

            {/* Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 bg-slate-950/40 rounded-[2rem] border border-slate-800/50 p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 text-center italic">Concentration</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={holdings} 
                        cx="50%" cy="50%" 
                        innerRadius={70} outerRadius={100} 
                        dataKey="weight" 
                        stroke="none" paddingAngle={4}
                      >
                        {holdings.map((_: any, index: number) => (
                          <Cell key={index} fill={HOLDING_COLORS[index % HOLDING_COLORS.length]} />
                        ))}
                      </Pie>
                      {/* We gebruiken hier de nieuwe renderCustomTooltip */}
                      <Tooltip content={renderCustomTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-950/40 rounded-[2rem] border border-slate-800/50 overflow-hidden flex flex-col">
                 <div className="p-5 border-b border-slate-800/50 bg-slate-900/20 italic">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Position Details</h3>
                 </div>
                 <div className="flex-1 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800/50 hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase font-bold text-slate-500">Asset</TableHead>
                          <TableHead className="text-[10px] uppercase font-bold text-slate-500 text-right">Weight</TableHead>
                          <TableHead className="text-[10px] uppercase font-bold text-slate-500 text-right">YTD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {holdings.map((holding: any, index: number) => (
                          <TableRow key={index} className="border-slate-800/50 hover:bg-blue-500/5 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: HOLDING_COLORS[index % HOLDING_COLORS.length] }} />
                                <div>
                                  <div className="text-white font-bold text-sm leading-none">{holding.ticker}</div>
                                  <div className="text-slate-500 text-[10px] mt-1 truncate max-w-[150px]">{holding.name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs text-slate-300">{holding.weight?.toFixed(1)}%</TableCell>
                            <TableCell className={cn(
                              "text-right font-mono font-bold text-xs",
                              holding.return_ytd >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {holding.return_ytd >= 0 ? '+' : ''}{holding.return_ytd?.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}