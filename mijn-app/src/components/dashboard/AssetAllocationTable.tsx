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

export default function AssetAllocationTable({ assetClasses, onSelectAsset }) {
  if (!assetClasses || assetClasses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
        <p className="text-slate-400">No asset classes configured</p>
      </motion.div>
    );
  }

  const totalValue = assetClasses.reduce((sum, ac) => sum + (ac.current_value || 0), 0);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value?.toFixed(0) || 0}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Asset Allocation Summary</h3>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {assetClasses.length} Classes
          </Badge>
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
          {assetClasses.map((ac, index) => (
            <motion.div
              key={ac.id || ac.name}
              initial={{ width: 0 }}
              animate={{ width: `${ac.allocation_percent}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: ac.color || '#3B82F6' }}
            />
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 hover:bg-transparent">
            <TableHead className="text-slate-400 font-medium">Asset Class</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Allocation</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Value</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Expected Return</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">Volatility (σ)</TableHead>
            <TableHead className="text-slate-400 font-medium text-right">YTD</TableHead>
            <TableHead className="text-slate-400 font-medium w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetClasses.map((ac, index) => (
            <TableRow
              key={ac.id || ac.name}
              onClick={() => onSelectAsset(ac)}
              className="border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors group"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ac.color || '#3B82F6' }}
                  />
                  <span className="font-medium text-white">{ac.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-slate-300">{ac.allocation_percent?.toFixed(1)}%</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-white font-medium">{formatCurrency(ac.current_value)}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className={cn(
                  "font-medium",
                  ac.expected_return >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {ac.expected_return >= 0 ? '+' : ''}{ac.expected_return?.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-amber-400">{ac.volatility?.toFixed(1)}%</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {ac.ytd_return >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-400" />
                  )}
                  <span className={cn(
                    "font-medium",
                    ac.ytd_return >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {ac.ytd_return >= 0 ? '+' : ''}{ac.ytd_return?.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Portfolio Totals */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Portfolio Total</span>
          <div className="flex items-center gap-8">
            <span className="text-white font-semibold">{formatCurrency(totalValue)}</span>
            <span className="text-slate-400">
              Wtd. Exp. Return: <span className="text-emerald-400 font-medium">
                {(assetClasses.reduce((sum, ac) => sum + (ac.expected_return * ac.allocation_percent / 100), 0)).toFixed(1)}%
              </span>
            </span>
            <span className="text-slate-400">
              Wtd. Vol: <span className="text-amber-400 font-medium">
                {Math.sqrt(assetClasses.reduce((sum, ac) => sum + Math.pow(ac.volatility * ac.allocation_percent / 100, 2), 0)).toFixed(1)}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}