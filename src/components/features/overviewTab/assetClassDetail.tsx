"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Target,
  PieChart as PieChartIcon,
  Activity,
  PlusCircle
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import PortfolioEditor from "../shared/portfolioEditor"; // Zorg dat dit pad klopt

// --- HELPERS ---
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(val || 0);
};

const formatPercentage = (val: number) => {
  const num = Number(val) || 0;
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

interface AssetClassDetailProps {
  assetClass: any;
  onClose: () => void;
  portfolio?: any; // Optioneel voor de editor
}

const HOLDING_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl ring-1 ring-white/5">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Asset Distribution</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.payload.fill || entry.color }} />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{entry.name}</span>
            </div>
            <span className="text-[10px] font-mono font-black text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AssetClassDetail({ assetClass, onClose, portfolio }: AssetClassDetailProps) {
  if (!assetClass) return null;

  // CHECK: Is dit een nieuwe asset (Editor modus) of een bestaande (Detail modus)?
  const isEditorMode = assetClass.id === 'new';

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
          <div className="bg-slate-900/50 border-b border-white/5 p-8 flex items-start justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
                {isEditorMode ? (
                  <PlusCircle className="w-7 h-7 text-blue-400" />
                ) : (
                  <PieChartIcon className="w-7 h-7 text-blue-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    {isEditorMode ? "Asset Editor" : (assetClass.name || "Details")}
                  </h2>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/20 uppercase text-[10px] font-black">
                    {isEditorMode ? "Configuration" : "Active Node"}
                  </Badge>
                </div>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-tight">
                  {isEditorMode ? "Manual Asset Injection Service" : "Real-time Node Analytics"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-500 hover:text-white hover:bg-white/5 rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Dynamic Body: Editor or Details */}
          <div className="p-8 overflow-y-auto">
            {isEditorMode ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                {/* Hier wordt de PortfolioEditor getoond binnen in de modal */}
                <PortfolioEditor portfolio={portfolio} />
              </div>
            ) : (
              <div className="space-y-8">
                {/* --- BESTAANDE DETAIL WEERGAVE --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Exp. Return", val: formatPercentage(assetClass.expected_return || 0), icon: Target, color: "text-blue-400" },
                    { label: "Volatility", val: formatPercentage(assetClass.volatility || 0), icon: Activity, color: "text-amber-400" },
                    { label: "YTD Perf", val: formatPercentage(assetClass.performance?.ytd || 0), icon: null, color: (assetClass.performance?.ytd || 0) >= 0 ? "text-emerald-400" : "text-rose-400" },
                    { label: "Sharpe Ratio", val: (( (assetClass.expected_return || 0) - 4) / (assetClass.volatility || 1)).toFixed(2), icon: null, color: "text-indigo-400" }
                  ].map((metric, i) => (
                    <div key={i} className="bg-black/20 rounded-2xl p-5 border border-white/5">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                        {metric.icon && <metric.icon className="w-3 h-3" />} {metric.label}
                      </p>
                      <p className={cn("text-2xl font-black font-mono tracking-tighter", metric.color)}>{metric.val}</p>
                    </div>
                  ))}
                </div>

                {/* Tabel en Grafiek sectie (verstopt als er geen holdings zijn) */}
                {(assetClass.assets || []).length > 0 && (
                   <div className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                      {/* ... Je tabel code hier ... */}
                      <p className="p-4 text-center text-[10px] text-slate-600 font-mono uppercase">Node Constitution data active</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}