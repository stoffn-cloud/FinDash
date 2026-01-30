import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  PieChart as PieChartIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { cn } from "@/lib/utils";
import { AssetClass } from "./AssetAllocationTable"; // Importeer de interface die we eerder maakten

// 1. Definieer de interface voor een Holding
interface Holding {
  name: string;
  ticker: string;
  weight: number;
  value: number;
  return_ytd: number;
}

// 2. Breid de AssetClass uit met holdings (als dat nog niet gebeurd was)
interface ExtendedAssetClass extends AssetClass {
  holdings?: Holding[];
  volatility?: number;
}

interface AssetClassDetailProps {
  assetClass: ExtendedAssetClass | null;
  onClose: () => void;
}

const HOLDING_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", 
  "#06B6D4", "#F97316", "#6366F1", "#84CC16", "#14B8A6"
];

// 3. Fix de 'any' error door TooltipProps te gebruiken van recharts
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as Holding;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-slate-400 text-sm">{data.ticker}</p>
        <p className="text-blue-400 text-sm mt-1">
          {data.weight?.toFixed(1)}% · ${(data.value / 1000).toFixed(0)}K
        </p>
      </div>
    );
  }
  return null;
};

export default function AssetClassDetail({ assetClass, onClose }: AssetClassDetailProps) {
  if (!assetClass) return null;

  const holdings = assetClass.holdings || [];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const sharpeRatio = assetClass.volatility 
    ? ((assetClass.expected_return - 4) / assetClass.volatility).toFixed(2) 
    : "0.00";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-6 flex items-start justify-between z-10">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${assetClass.color}20` }}
              >
                <PieChartIcon className="w-6 h-6" style={{ color: assetClass.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{assetClass.name}</h2>
                <p className="text-slate-400 mt-1">
                  {assetClass.allocation_percent?.toFixed(1)}% van portfolio · {formatCurrency(assetClass.current_value)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-sm flex items-center gap-2 mb-2"><Target className="w-4 h-4" /> Return</p>
                <p className={cn("text-2xl font-bold", assetClass.expected_return >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {assetClass.expected_return > 0 ? '+' : ''}{assetClass.expected_return?.toFixed(1)}%
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-sm flex items-center gap-2 mb-2"><Activity className="w-4 h-4" /> Volatiliteit</p>
                <p className="text-2xl font-bold text-amber-400">{assetClass.volatility?.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-2">YTD Return</p>
                <p className={cn("text-2xl font-bold", assetClass.ytd_return >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {assetClass.ytd_return > 0 ? '+' : ''}{assetClass.ytd_return?.toFixed(1)}%
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-2">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-blue-400">{sharpeRatio}</p>
              </div>
            </div>

            {/* Holdings & Pie Chart */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Samenstelling</h3>
                <Badge variant="secondary">{holdings.length} Holdings</Badge>
              </div>

              {holdings.length > 0 ? (
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-64 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={holdings} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="weight" stroke="none">
                          {holdings.map((_, index) => (
                            <Cell key={index} fill={HOLDING_COLORS[index % HOLDING_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700/50 hover:bg-transparent">
                          <TableHead className="text-slate-400">Naam</TableHead>
                          <TableHead className="text-slate-400 text-right">Gewicht</TableHead>
                          <TableHead className="text-slate-400 text-right">Waarde</TableHead>
                          <TableHead className="text-slate-400 text-right">YTD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {holdings.map((holding, index) => (
                          <TableRow key={index} className="border-slate-700/50">
                            <TableCell className="font-medium text-white">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: HOLDING_COLORS[index % HOLDING_COLORS.length] }} />
                                <div>{holding.name} <span className="text-slate-500 text-xs ml-1">{holding.ticker}</span></div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-slate-300">{holding.weight?.toFixed(1)}%</TableCell>
                            <TableCell className="text-right text-white">{formatCurrency(holding.value)}</TableCell>
                            <TableCell className={cn("text-right font-medium", holding.return_ytd >= 0 ? "text-emerald-400" : "text-rose-400")}>
                              {holding.return_ytd?.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 italic">Geen holdings data voor deze categorie.</div>
              )}
            </div>

            {/* Risk Section */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Risico Analyse</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Max Drawdown (Est.)</p>
                  <p className="text-xl font-bold text-rose-400">-{((assetClass.volatility || 0) * 2.5).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Value at Risk (95%)</p>
                  <p className="text-xl font-bold text-amber-400">-{((assetClass.volatility || 0) * 0.5).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Sharpe Score</p>
                  <p className="text-xl font-bold text-blue-400">{sharpeRatio}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}