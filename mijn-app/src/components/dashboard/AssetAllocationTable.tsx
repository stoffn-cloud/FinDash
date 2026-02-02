"use client";

import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssetClass } from "@/types/dashboard";

interface AssetAllocationTableProps {
  assetClasses?: AssetClass[];
  onAssetClick?: (asset: AssetClass) => void;
}

export default function AssetAllocationTable({ 
  assetClasses = [], 
  onAssetClick
}: AssetAllocationTableProps) {
  
  if (!assetClasses || assetClasses.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700/50 p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2 italic">Portfolio Mix</h3>
        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Awaiting Engine Feed...</p>
      </div>
    );
  }

  const totalValue = assetClasses.reduce((sum, ac) => sum + (Number(ac.value) || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/20 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white uppercase tracking-tighter italic">Portfolio Mix</h3>
        <Badge variant="outline" className="border-slate-800 text-slate-400 bg-slate-900/50">
          {assetClasses.length} Sectoren
        </Badge>
      </div>

      {/* Visuele balk met Fix voor Keys */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/20">
        <div className="h-2 rounded-full overflow-hidden flex bg-slate-800/50 shadow-inner">
          {assetClasses.map((ac, idx) => {
            // FIX: Maak een gegarandeerde string key
            const barKey = ac.name ? `bar-${ac.name}` : `bar-idx-${idx}`;
            return (
              <motion.div
                key={barKey}
                initial={{ width: 0 }}
                animate={{ width: `${ac.allocationPct || 0}%` }}
                className="h-full border-r border-black/20 last:border-0"
                style={{ backgroundColor: ac.color || '#3B82F6' }}
              />
            );
          })}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Categorie</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Allocatie</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Waarde</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Projectie</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">YTD</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetClasses.map((ac, index) => (
            <TableRow
              key={index}
              onClick={() => onAssetClick && onAssetClick(ac)}
              className="border-slate-700/50 cursor-pointer hover:bg-slate-800/50 group"
            >
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ac.color }} />
                  {ac.name}
                </div>
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {ac.allocation_percent?.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right text-white font-medium">
                {formatCurrency(ac.current_value)}
              </TableCell>
              <TableCell className={cn(
                "text-right font-medium",
                ac.expected_return >= 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {ac.expected_return > 0 ? '+' : ''}{ac.expected_return?.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {ac.ytd_return >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-400" />
                  )}
                  <span className={ac.ytd_return >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {ac.ytd_return?.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-between items-center text-[11px]">
        <span className="text-slate-500 font-bold uppercase tracking-tighter">Terminal Total</span>
        <div className="flex gap-8 items-center">
          <span className="text-white font-mono font-black text-sm">{formatCurrency(totalValue)}</span>
          <div className="flex flex-col items-end leading-none">
            <span className="text-slate-500 text-[9px] uppercase font-black mb-1">Avg Proj.</span>
            <span className="text-blue-400 font-mono font-bold text-sm">
              {formatPercentage(assetClasses.reduce((sum, ac) => sum + ((Number(ac.projectedReturn) || 0) * (Number(ac.allocationPct) || 0) / 100), 0))}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
