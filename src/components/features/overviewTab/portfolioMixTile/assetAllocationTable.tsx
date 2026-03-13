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
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnrichedAssetClass } from "@/types";

interface AssetAllocationTableProps {
  assetClasses: EnrichedAssetClass[]; 
  onAssetClick?: (ac: EnrichedAssetClass) => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(val || 0);
};

export default function AssetAllocationTable({ 
  assetClasses = [], 
  onAssetClick 
}: AssetAllocationTableProps) {
  
  if (!assetClasses || assetClasses.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-8 text-center backdrop-blur-md">
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Awaiting Engine Feed...
        </p>
      </div>
    );
  }

  // Sorteren op allocatie percentage (grootste eerst)
  const sortedClasses = [...assetClasses].sort((a, b) => b.allocation_percent - a.allocation_percent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slate-900/20 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.15em]">Portfolio Mix</h3>
        </div>
        <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400 font-mono">
          {assetClasses.length} CLASSES
        </Badge>
      </div>

      {/* --- DYNAMISCHE ALLOCATIE BAR --- */}
      <div className="h-1.5 flex bg-slate-800/30">
        {sortedClasses.map((ac, idx) => (
          <motion.div
            key={ac.id || idx}
            initial={{ flexGrow: 0 }}
            animate={{ flexGrow: ac.allocation_percent }}
            className="h-full border-r border-black/20 last:border-0"
            style={{ backgroundColor: ac.color || '#3B82F6' }}
            title={`${ac.name}: ${ac.allocation_percent.toFixed(1)}%`}
          />
        ))}
      </div>

      <Table>
        <TableHeader className="bg-white/[0.01]">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="h-10 text-[9px] font-black uppercase text-slate-500 tracking-widest pl-6">
              Class
            </TableHead>
            <TableHead className="h-10 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">
              Allocation
            </TableHead>
            <TableHead className="h-10 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right pr-6">
              Value
            </TableHead>
            <TableHead className="w-10 pr-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClasses.map((ac, idx) => (
            <TableRow
              key={ac.id || idx}
              onClick={() => onAssetClick?.(ac)}
              className="border-white/5 cursor-pointer hover:bg-white/[0.03] group transition-all"
            >
              <TableCell className="pl-6 py-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                      style={{ backgroundColor: ac.color || '#475569' }} 
                    />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                      {ac.name}
                    </span>
                  </div>
                  {/* Toont aantal assets in deze class uit de verrijkte data */}
                  <span className="text-[9px] text-slate-600 font-medium ml-3.5 uppercase tracking-tighter">
                    {ac.assets?.length || 0} Positions
                  </span>
                </div>
              </TableCell>
              
              <TableCell className="text-right py-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                    {ac.allocation_percent.toFixed(1)}%
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-6 py-4">
                <span className="text-xs font-mono font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  {formatCurrency(ac.current_value)}
                </span>
              </TableCell>

              <TableCell className="pr-4 py-4 text-right">
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}