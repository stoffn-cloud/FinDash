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

// 1. Definieer het type voor een enkele Asset Class
export interface AssetClass {
  id: string;
  name: string;
  allocation_percent: number;
  current_value: number;
  expected_return: number;
  ytd_return: number;
  color: string;
}

// 2. Definieer de Props voor het component
interface AssetAllocationTableProps {
  assetClasses?: AssetClass[];
  onSelectAsset?: (asset: AssetClass) => void;
}

export default function AssetAllocationTable({ 
  assetClasses = [], 
  onSelectAsset 
}: AssetAllocationTableProps) {
  
  // Veiligheidscheck
  if (!assetClasses || assetClasses.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700/50 p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Asset Allocation</h3>
        <p className="text-slate-400">Geen data beschikbaar om weer te geven.</p>
      </div>
    );
  }

  const totalValue = assetClasses.reduce((sum, ac) => sum + (ac.current_value || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Portfolio Overzicht</h3>
        <Badge variant="outline" className="border-slate-600 text-slate-300">
          {assetClasses.length} Categorieën
        </Badge>
      </div>

      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/20">
        <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
          {assetClasses.map((ac) => (
            <motion.div
              key={ac.id}
              initial={{ width: 0 }}
              animate={{ width: `${ac.allocation_percent || 0}%` }}
              className="h-full"
              style={{ backgroundColor: ac.color || '#3B82F6' }}
            />
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 hover:bg-transparent">
            <TableHead className="text-slate-400">Categorie</TableHead>
            <TableHead className="text-slate-400 text-right">Allocatie</TableHead>
            <TableHead className="text-slate-400 text-right">Waarde</TableHead>
            <TableHead className="text-slate-400 text-right">Verwacht Rendement</TableHead>
            <TableHead className="text-slate-400 text-right">YTD</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetClasses.map((ac) => (
            <TableRow
              key={ac.id}
              onClick={() => onSelectAsset && onSelectAsset(ac)}
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

      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex justify-between text-xs sm:text-sm">
        <span className="text-slate-400">Totaal Portfolio</span>
        <div className="flex gap-6">
          <span className="text-white font-bold">{formatCurrency(totalValue)}</span>
          <span className="text-slate-400">
            Wtd. Return: <span className="text-emerald-400">
              {(assetClasses.reduce((sum, ac) => sum + ((ac.expected_return || 0) * (ac.allocation_percent || 0) / 100), 0)).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}