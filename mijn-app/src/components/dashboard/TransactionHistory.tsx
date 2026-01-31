import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Wallet,
  Receipt,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

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

// Configuratie voor de verschillende transactietypes
interface TypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  label: string;
}

const TYPE_CONFIG: Record<TransactionType, TypeConfig> = {
  buy: { icon: ArrowDownRight, color: "text-blue-400", bg: "bg-blue-500/10", label: "Aankoop" },
  sell: { icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Verkoop" },
  dividend: { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", label: "Dividend" },
  deposit: { icon: Wallet, color: "text-green-400", bg: "bg-green-500/10", label: "Storting" },
  withdrawal: { icon: Wallet, color: "text-rose-400", bg: "bg-rose-500/10", label: "Opname" },
  fee: { icon: Receipt, color: "text-slate-400", bg: "bg-slate-500/10", label: "Kosten" },
};

// ---------------------- COMPONENT ----------------------
interface TransactionHistoryProps {
  transactions?: Transaction[];
}

export default function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-slate-900/40 border border-slate-800 p-12 text-center"
      >
        <Receipt className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white">Geen transacties gevonden</h3>
        <p className="text-slate-500 text-sm">Zodra je trades doet, verschijnen ze hier.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm overflow-hidden"
    >
      {/* Header met zoek-input mock */}
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Receipt className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transactiehistorie</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tight">
              Totaal: {transactions.length} records
            </p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Zoek op ticker of naam..." 
            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-950/30">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase">Datum</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase">Type</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase">Asset</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase text-right">Aantal</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase text-right">Prijs</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase text-right">Totaal</TableHead>
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
                  className="border-slate-800 hover:bg-slate-800/30 transition-colors group"
                >
                  <TableCell className="text-xs font-mono text-slate-400">
                    {tx.date ? format(new Date(tx.date), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-lg", config.bg)}>
                        <Icon className={cn("w-3.5 h-3.5", config.color)} />
                      </div>
                      <span className={cn("text-[10px] font-bold uppercase tracking-tighter", config.color)}>
                        {config.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                        {tx.asset_name || "Cash Overboeking"}
                      </span>
                      {tx.ticker && (
                        <span className="text-[10px] font-mono text-slate-600 uppercase">{tx.ticker}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-slate-300">
                    {tx.quantity?.toLocaleString() ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-slate-300">
                    {tx.price ? formatCurrency(tx.price) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "text-xs font-mono font-bold",
                      isPositive ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {isPositive ? "+" : "-"}
                      {formatCurrency(tx.total_amount)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
