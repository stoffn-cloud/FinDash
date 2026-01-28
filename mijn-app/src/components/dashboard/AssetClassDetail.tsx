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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const HOLDING_COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", 
  "#06B6D4", "#F97316", "#6366F1", "#84CC16", "#14B8A6"
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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

export default function AssetClassDetail({ assetClass, onClose }) {
  if (!assetClass) return null;

  const holdings = assetClass.holdings || [];
  
  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value?.toFixed(0) || 0}`;
  };

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
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl"
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
                  {assetClass.allocation_percent?.toFixed(1)}% of portfolio · {formatCurrency(assetClass.current_value)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Target className="w-4 h-4" />
                  Expected Return
                </div>
                <p className={cn(
                  "text-2xl font-bold",
                  assetClass.expected_return >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {assetClass.expected_return >= 0 ? '+' : ''}{assetClass.expected_return?.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Annualized</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Activity className="w-4 h-4" />
                  Volatility (σ)
                </div>
                <p className="text-2xl font-bold text-amber-400">
                  {assetClass.volatility?.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Historical</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  {assetClass.ytd_return >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                  YTD Return
                </div>
                <p className={cn(
                  "text-2xl font-bold",
                  assetClass.ytd_return >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {assetClass.ytd_return >= 0 ? '+' : ''}{assetClass.ytd_return?.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Year to date</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  Sharpe Ratio
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {((assetClass.expected_return - 4) / (assetClass.volatility || 1)).toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Risk-adjusted</p>
              </div>
            </div>

            {/* Composition */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">Composition</h3>
                <p className="text-sm text-slate-400 mt-1">{holdings.length} holdings in this asset class</p>
              </div>

              {holdings.length > 0 ? (
                <div className="flex flex-col md:flex-row">
                  {/* Pie Chart */}
                  <div className="w-full md:w-64 h-64 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={holdings}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="weight"
                          stroke="none"
                        >
                          {holdings.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={HOLDING_COLORS[index % HOLDING_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Holdings Table */}
                  <div className="flex-1 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700/50 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-medium">Holding</TableHead>
                          <TableHead className="text-slate-400 font-medium text-right">Weight</TableHead>
                          <TableHead className="text-slate-400 font-medium text-right">Value</TableHead>
                          <TableHead className="text-slate-400 font-medium text-right">YTD</TableHead>
                          <TableHead className="text-slate-400 font-medium text-right">Vol.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {holdings.map((holding, index) => (
                          <TableRow key={holding.ticker || index} className="border-slate-700/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: HOLDING_COLORS[index % HOLDING_COLORS.length] }}
                                />
                                <div>
                                  <p className="font-medium text-white">{holding.name}</p>
                                  <p className="text-xs text-slate-500">{holding.ticker}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-slate-300">
                              {holding.weight?.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right text-white font-medium">
                              {formatCurrency(holding.value)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={cn(
                                "font-medium",
                                holding.return_ytd >= 0 ? "text-emerald-400" : "text-rose-400"
                              )}>
                                {holding.return_ytd >= 0 ? '+' : ''}{holding.return_ytd?.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-amber-400">
                              {holding.volatility?.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No holdings data available for this asset class
                </div>
              )}
            </div>

            {/* Risk Analysis */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Risk Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Return/Risk Ratio</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min((assetClass.expected_return / assetClass.volatility) * 50, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Higher is better. Current: {(assetClass.expected_return / assetClass.volatility).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Max Drawdown Estimate</p>
                  <p className="text-xl font-bold text-rose-400">
                    -{(assetClass.volatility * 2.5).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Based on 2.5σ move</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Value at Risk (95%)</p>
                  <p className="text-xl font-bold text-amber-400">
                    -{(assetClass.volatility * 1.65 / Math.sqrt(252) * Math.sqrt(20)).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">20-day horizon</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}