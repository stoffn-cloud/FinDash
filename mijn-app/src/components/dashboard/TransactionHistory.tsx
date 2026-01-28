import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  TrendingUp,
  Wallet,
  Receipt
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

const TYPE_CONFIG = {
  buy: { icon: ArrowDownRight, color: "text-blue-400", bg: "bg-blue-500/10", label: "Buy" },
  sell: { icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Sell" },
  dividend: { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", label: "Dividend" },
  deposit: { icon: Wallet, color: "text-green-400", bg: "bg-green-500/10", label: "Deposit" },
  withdrawal: { icon: Wallet, color: "text-rose-400", bg: "bg-rose-500/10", label: "Withdrawal" },
  fee: { icon: Receipt, color: "text-slate-400", bg: "bg-slate-500/10", label: "Fee" },
};

export default function TransactionHistory() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-date", 50),
  });

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2 
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
        <p className="text-slate-400">Your transaction history will appear here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <Receipt className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Transaction History</h3>
            <p className="text-sm text-slate-400">{transactions.length} transactions</p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 hover:bg-transparent">
            <TableHead className="text-slate-400 font-medium">Date</TableHead>
            <TableHead className="text-slate-400 font-medium">Type</TableHead>
            <TableHead className="text-slate-400 font-medium">Asset</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Quantity</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Price</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => {
            const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.fee;
            const Icon = config.icon;
            
            return (
              <TableRow 
                key={tx.id || index} 
                className="border-slate-700/50 hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="text-slate-300">
                  {tx.date ? format(new Date(tx.date), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", config.bg)}>
                      <Icon className={cn("w-3.5 h-3.5", config.color)} />
                    </div>
                    <Badge variant="outline" className={cn("border-slate-600", config.color)}>
                      {config.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{tx.asset_name || "—"}</p>
                    {tx.ticker && (
                      <p className="text-xs text-slate-500">{tx.ticker}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {tx.quantity ? tx.quantity.toLocaleString() : "—"}
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {tx.price ? formatCurrency(tx.price) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-semibold",
                    ["sell", "dividend", "deposit"].includes(tx.type) ? "text-emerald-400" : "text-white"
                  )}>
                    {["sell", "dividend", "deposit"].includes(tx.type) ? "+" : ""}
                    {formatCurrency(tx.total_amount)}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </motion.div>
  );
}