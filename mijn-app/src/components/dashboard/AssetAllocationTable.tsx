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
// Importeer het juiste type voor autocomplete en veiligheid
import { AssetClass } from "@/types/schemas";

// Helper formatters
const formatCurrency = (val: number) => {
  return (Number(val) || 0).toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 // Houdt de tabel clean
  });
};

const formatPercentage = (val: number) => {
  const num = Number(val) || 0;
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
};

interface AssetAllocationTableProps {
  assetClasses: AssetClass[]; 
  onAssetClick: (asset: AssetClass) => void; 
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/20 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white uppercase tracking-tighter italic">Portfolio Mix</h3>
        <Badge variant="outline" className="border-slate-800 text-slate-400 bg-slate-900/50">
          {assetClasses.length} Asset Classes
        </Badge>
      </div>

      {/* --- VISUELE ALLOCATIE BAR --- */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/20">
        <div className="h-2 rounded-full overflow-hidden flex bg-slate-800/50 shadow-inner">
          {assetClasses.map((ac, idx) => (
            <motion.div
              key={ac.id || idx}
              initial={{ width: 0 }}
              // AANPASSING: Gebruik allocation_percent van de engine
              animate={{ width: `${ac.allocation_percent || 0}%` }}
              className="h-full border-r border-black/20 last:border-0"
              style={{ backgroundColor: ac.color || '#3B82F6' }}
            />
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Categorie</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Allocatie</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Waarde</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Beta</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetClasses.map((ac, idx) => {
            // AANPASSING: Mapping naar de nieuwe datastructuur
            const currentAlloc = ac.allocation_percent || 0;
            const currentValue = ac.current_value || 0;

            return (
              <TableRow
                key={ac.id || idx}
                onClick={() => onAssetClick && onAssetClick(ac)}
                className="border-white/5 cursor-pointer hover:bg-white/[0.03] group transition-colors"
              >
                <TableCell className="font-bold text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ac.color || '#475569' }} />
                    {ac.name}
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-400 font-mono text-xs">
                  {currentAlloc.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-white font-mono font-medium">
                  {formatCurrency(currentValue)}
                </TableCell>
                
                {/* PROJECTIE/BETA KOLOM */}
                <TableCell className="text-right font-mono font-bold text-xs text-blue-400">
                  {/* Hier kun je later dynamische risico-data per klasse tonen */}
                  0.85
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 font-mono text-xs font-bold">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">
                      ACTIVE
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </motion.div>
  );
}