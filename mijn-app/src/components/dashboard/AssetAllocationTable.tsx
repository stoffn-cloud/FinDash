"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronRight 
} from "lucide-react";

// UI Components
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 1. Types
export interface AssetClass {
  name: string;
  allocation_percent: number;
  current_value: number;
  expected_return: number;
  ytd_return: number;
  color: string;
}

interface AssetAllocationTableProps {
  assetClasses?: AssetClass[];
  onSelectAsset?: (asset: AssetClass) => void;
}

// Helper voor valuta
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
};

export default function AssetAllocationTable({ 
  assetClasses = [], 
  onSelectAsset 
}: AssetAllocationTableProps) {
  
  const totalValue = assetClasses.reduce((sum, ac) => sum + (ac.current_value || 0), 0);

  // Veiligheidscheck voor lege data
  if (!assetClasses || assetClasses.length === 0) {
    return (
      <div className="p-6">
        <Skeleton className="h-[300px] w-full bg-slate-800/20 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800/50 hover:bg-transparent">
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold h-14">Categorie</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-right">Allocatie</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-right">Waarde</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-right">Target</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-right">YTD</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetClasses.map((ac, index) => (
              <TableRow
                key={index}
                onClick={() => onSelectAsset && onSelectAsset(ac)}
                className="border-slate-800/50 cursor-pointer hover:bg-blue-500/5 group transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                      style={{ backgroundColor: ac.color }} 
                    />
                    <span className="font-bold text-white text-sm tracking-tight">{ac.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-400 font-mono text-xs">
                  {ac.allocation_percent?.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-white font-semibold font-mono">
                  {formatCurrency(ac.current_value)}
                </TableCell>
                <TableCell className={cn(
                  "text-right font-bold font-mono text-xs",
                  ac.expected_return >= 0 ? "text-emerald-500/80" : "text-rose-500/80"
                )}>
                  {ac.expected_return > 0 ? '+' : ''}{ac.expected_return?.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {ac.ytd_return >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={cn(
                      "font-bold font-mono text-xs",
                      ac.ytd_return >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {ac.ytd_return?.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Summary Bar */}
      <div className="p-5 border-t border-slate-800/50 bg-slate-950/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Portfolio Exposure</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase text-slate-600 font-bold tracking-tighter">Gross Value</span>
            <span className="text-white font-mono font-black text-lg">{formatCurrency(totalValue)}</span>
          </div>
          <div className="flex flex-col items-end border-l border-slate-800 pl-8">
            <span className="text-[9px] uppercase text-slate-600 font-bold tracking-tighter">Wtd. Return</span>
            <span className="text-emerald-400 font-mono font-black text-lg">
              {(assetClasses.reduce((sum, ac) => sum + ((ac.expected_return || 0) * (ac.allocation_percent || 0) / 100), 0)).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}