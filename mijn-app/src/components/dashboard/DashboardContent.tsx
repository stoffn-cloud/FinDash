"use client";

import React from "react";
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

// ------------------- TYPES -------------------
export interface AssetClass {
  id: string;
  name: string;
  value: number;        
  percentage: number;   
  expected_return: number;
  ytd_return: number;
  color: string;
  holdings?: any[];
}

interface AssetAllocationTableProps {
  assetClasses: AssetClass[];
  onSelectAsset: (asset: AssetClass) => void;
}

// ------------------- COMPONENT -------------------
export default function AssetAllocationTable({ 
  assetClasses = [], // Default naar lege array om .reduce errors te voorkomen
  onSelectAsset 
}: AssetAllocationTableProps) {
  
  // Veilig totaal berekenen
  const totalValue = assetClasses?.reduce((sum, ac) => sum + (ac.value || 0), 0) || 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/40">
        <div>
          <h3 className="text-lg font-semibold text-white">Portfolio Allocatie</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Verdeling per activaklasse</p>
        </div>
        <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-800/50 px-3 py-1">
          {assetClasses?.length || 0} Categorieën
        </Badge>
      </div>

      {/* Visual Allocation Bar */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/20">
        <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-800 shadow-inner border border-slate-700/30">
          {assetClasses?.map((ac) => (
            <motion.div
              key={ac.id}
              initial={{ width: 0 }}
              animate={{ width: `${ac.percentage || 0}%` }}
              className="h-full border-r border-slate-950/20 last:border-0"
              style={{ backgroundColor: ac.color || '#ccc' }}
              title={`${ac.name}: ${ac.percentage || 0}%`}
            />
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50 hover:bg-transparent bg-slate-900/30">
              <TableHead className="text-slate-400 font-medium pl-6">Activaklasse</TableHead>
              <TableHead className="text-slate-400 text-right font-medium">Allocatie</TableHead>
              <TableHead className="text-slate-400 text-right font-medium">Huidige Waarde</TableHead>
              <TableHead className="text-slate-400 text-right font-medium">Verwacht Rend.</TableHead>
              <TableHead className="text-slate-400 text-right font-medium pr-6">YTD</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetClasses?.map((ac) => (
              <TableRow
                key={ac.id}
                onClick={() => onSelectAsset(ac)}
                className="border-slate-700/50 cursor-pointer hover:bg-blue-600/5 group transition-all"
              >
                <TableCell className="py-5 pl-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1.5 h-6 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                      style={{ backgroundColor: ac.color || '#ccc' }} 
                    />
                    <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                      {ac.name || "Onbekend"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-400 font-mono text-sm">
                  {ac.percentage?.toFixed(1) ?? "0.0"}%
                </TableCell>
                <TableCell className="text-right text-white font-semibold">
                  {formatCurrency(ac.value)}
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium",
                  (ac.expected_return || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {/* FIX REGEL 124: Beveiligd tegen undefined */}
                  {(ac.expected_return || 0) > 0 ? '+' : ''}
                  {ac.expected_return?.toFixed(1) ?? "0.0"}%
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    {(ac.ytd_return || 0) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    )}
                    <span className={cn(
                      "font-bold",
                      (ac.ytd_return || 0) >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {ac.ytd_return?.toFixed(1) ?? "0.0"}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="pr-4">
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Summary */}
      <div className="p-5 border-t border-slate-700/50 bg-slate-900/40 flex justify-between items-center text-sm">
        <span className="text-slate-500 italic text-[11px] font-bold uppercase tracking-widest">
          Portfolio Aggregate Data
        </span>
        <div className="flex gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Totaal Beheerd</span>
            <span className="text-white font-black text-base">{formatCurrency(totalValue)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Wtd. Return</span>
            <span className="text-emerald-400 font-black text-base">
              {/* VEILIG BEREKEND: voorkomt crash bij lege data */}
              {(assetClasses?.reduce((sum, ac) => sum + ((ac.expected_return || 0) * (ac.percentage || 0) / 100), 0) || 0).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}