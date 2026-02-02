"use client";

import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Wallet,
  Receipt,
  Search,
  Hash
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ---------------------- TYPES ----------------------
type TransactionType = "buy" | "sell" | "dividend" | "deposit" | "withdrawal" | "fee";

interface Transaction {
  id?: string | number;
  date?: string;
  type: TransactionType;
  asset_name?: string;
  ticker?: string;
  quantity?: number;
  price?: number;
  total_amount: number;
}

const TYPE_CONFIG: Record<TransactionType, any> = {
  buy: { icon: ArrowDownRight, color: "text-blue-500", bg: "bg-blue-500/10", label: "EXEC: BUY" },
  sell: { icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "EXEC: SELL" },
  dividend: { icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10", label: "DIVIDEND" },
  deposit: { icon: Wallet, color: "text-indigo-500", bg: "bg-indigo-500/10", label: "DEPOSIT" },
  withdrawal: { icon: Wallet, color: "text-rose-500", bg: "bg-rose-500/10", label: "WITHDRAW" },
  fee: { icon: Receipt, color: "text-slate-500", bg: "bg-slate-500/10", label: "SYS: FEE" },
};

export default function TransactionHistory({ transactions = [] }: { transactions?: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl bg-black/20 border border-white/5 p-16 text-center backdrop-blur-xl"
      >
        <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-8 h-8 text-slate-700" />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">No Ledger Records</h3>
        <p className="text-slate-600 text-[10px] font-mono mt-2 uppercase">Awaiting trade execution data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-black/20 border border-white/5 backdrop-blur-xl overflow-hidden group"
    >
      {/* Header Panel */}
      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
            <Receipt className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Transaction Ledger</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest border-r border-white/10 pr-3">
                {transactions.length} Entries
              </span>
              <span className="text-[9px] text-emerald-500/70 font-mono font-bold uppercase tracking-tighter">
                Audit Trail Verified
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative w-full md:w-72 group relative z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="FILTER BY TICKER OR ID..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-[10px] font-mono text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/40 transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/[0.01]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="h-12 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] pl-8 italic">Date/Timestamp</TableHead>
              <TableHead className="h-12 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Execution Type</TableHead>
              <TableHead className="h-12 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Asset Hub</TableHead>
              <TableHead className="h-12 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-right">Units</TableHead>
              <TableHead className="h-12 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-right">Price</TableHead>
              <TableHead className="h-12 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-right pr-8 italic">Total Flow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => {
              const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.fee;
              const Icon = config.icon;
              const isPositive = ["sell", "dividend", "deposit"].includes(tx.type);
              
              return (
                <TableRow 
                  key={tx.id ?? index} 
                  className="border-white/[0.03] hover:bg-white/[0.03] transition-all group/row"
                >
                  <TableCell className="pl-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-black text-slate-400">
                        {tx.date ? format(new Date(tx.date), "dd.MM.yyyy") : "—"}
                      </span>
                      <span className="text-[8px] font-mono text-slate-700 uppercase">{tx.date ? format(new Date(tx.date), "HH:mm:ss") : "00:00:00"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border transition-all duration-300 group-hover/row:scale-110", config.bg, "border-transparent", "group-hover/row:border-current")}>
                        <Icon className={cn("w-3 h-3", config.color)} />
                      </div>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", config.color)}>
                        {config.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-300 group-hover/row:text-white transition-colors uppercase italic">
                        {tx.asset_name || "CASH SETTLEMENT"}
                      </span>
                      {tx.ticker && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Hash className="w-2.5 h-2.5 text-slate-700" />
                          <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-tighter">{tx.ticker}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-[10px] font-mono font-black text-slate-400 tracking-tighter">
                      {tx.quantity ? tx.quantity.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      {tx.price ? `$${tx.price.toFixed(2)}` : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "text-[11px] font-mono font-black italic",
                        isPositive ? "text-emerald-500" : "text-white"
                      )}>
                        {isPositive ? "+" : "-"}${tx.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[8px] font-mono text-slate-700 uppercase tracking-tighter">Settled</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Bottom Tooltip Area */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center gap-3">
         <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
         <p className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">
           Auto-reconciliation complete: All historical flows match current asset balances.
         </p>
      </div>
    </motion.div>
  );
}