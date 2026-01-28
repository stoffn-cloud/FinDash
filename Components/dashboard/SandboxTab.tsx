import { useState } from "react";
import { motion } from "framer-motion";
import { Castle, Plus, Trash2, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ASSET_CLASS_OPTIONS = [
  { id: "equities", name: "Equities", color: "#3B82F6" },
  { id: "fixed_income", name: "Fixed Income", color: "#10B981" },
  { id: "alternatives", name: "Alternatives", color: "#8B5CF6" },
  { id: "real_estate", name: "Real Estate", color: "#F59E0B" },
  { id: "commodities", name: "Commodities", color: "#EF4444" },
  { id: "cash", name: "Cash", color: "#6B7280" },
];

const SECURITIES_BY_CLASS = {
  equities: [
    { ticker: "VTI", name: "Vanguard Total Stock Market ETF", region: "US" },
    { ticker: "VEA", name: "Vanguard FTSE Developed Markets ETF", region: "Intl" },
    { ticker: "VWO", name: "Vanguard FTSE Emerging Markets ETF", region: "EM" },
    { ticker: "AAPL", name: "Apple Inc.", region: "US" },
    { ticker: "MSFT", name: "Microsoft Corp.", region: "US" },
    { ticker: "GOOGL", name: "Alphabet Inc.", region: "US" },
    { ticker: "NVDA", name: "NVIDIA Corp.", region: "US" },
    { ticker: "AMZN", name: "Amazon.com Inc.", region: "US" },
  ],
  fixed_income: [
    { ticker: "BND", name: "Vanguard Total Bond Market ETF", region: "US" },
    { ticker: "BNDX", name: "Vanguard Total Intl Bond ETF", region: "Intl" },
    { ticker: "TLT", name: "iShares 20+ Year Treasury Bond ETF", region: "US" },
    { ticker: "LQD", name: "iShares Investment Grade Corporate Bond ETF", region: "US" },
    { ticker: "HYG", name: "iShares High Yield Corporate Bond ETF", region: "US" },
    { ticker: "TIP", name: "iShares TIPS Bond ETF", region: "US" },
  ],
  alternatives: [
    { ticker: "GLD", name: "SPDR Gold Shares", region: "Global" },
    { ticker: "BITO", name: "ProShares Bitcoin Strategy ETF", region: "Global" },
    { ticker: "ARKK", name: "ARK Innovation ETF", region: "US" },
    { ticker: "QAI", name: "IQ Hedge Multi-Strategy Tracker ETF", region: "Global" },
  ],
  real_estate: [
    { ticker: "VNQ", name: "Vanguard Real Estate ETF", region: "US" },
    { ticker: "VNQI", name: "Vanguard Global ex-US Real Estate ETF", region: "Intl" },
    { ticker: "O", name: "Realty Income Corp.", region: "US" },
    { ticker: "AMT", name: "American Tower Corp.", region: "US" },
  ],
  commodities: [
    { ticker: "DBC", name: "Invesco DB Commodity Index Tracking Fund", region: "Global" },
    { ticker: "USO", name: "United States Oil Fund", region: "Global" },
    { ticker: "SLV", name: "iShares Silver Trust", region: "Global" },
    { ticker: "PDBC", name: "Invesco Optimum Yield Diversified Commodity", region: "Global" },
  ],
  cash: [
    { ticker: "SHV", name: "iShares Short Treasury Bond ETF", region: "US" },
    { ticker: "BIL", name: "SPDR Bloomberg 1-3 Month T-Bill ETF", region: "US" },
    { ticker: "SGOV", name: "iShares 0-3 Month Treasury Bond ETF", region: "US" },
  ],
};

const AllocationSlider = ({ label, value, onChange, color, onRemove }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-medium text-white">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-20 h-8 text-center bg-slate-900 border-slate-600 text-white"
          />
          <span className="text-slate-400">%</span>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={100}
        step={1}
        className="w-full"
      />
    </div>
  );
};

const SecuritySelector = ({ assetClassId, securities, onSecuritiesChange }) => {
  const availableSecurities = SECURITIES_BY_CLASS[assetClassId] || [];
  const totalWeight = securities.reduce((sum, s) => sum + s.weight, 0);

  const addSecurity = (security) => {
    if (!securities.find(s => s.ticker === security.ticker)) {
      onSecuritiesChange([...securities, { ...security, weight: 0 }]);
    }
  };

  const removeSecurity = (ticker) => {
    onSecuritiesChange(securities.filter(s => s.ticker !== ticker));
  };

  const updateWeight = (ticker, weight) => {
    onSecuritiesChange(securities.map(s => 
      s.ticker === ticker ? { ...s, weight } : s
    ));
  };

  return (
    <div className="mt-4 pl-4 border-l-2 border-slate-700/50 space-y-3">
      {securities.map((security) => (
        <div key={security.ticker} className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{security.ticker}</Badge>
              <span className="text-sm text-slate-300">{security.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSecurity(security.ticker)}
              className="h-6 w-6 text-slate-500 hover:text-rose-400"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[security.weight]}
              onValueChange={([v]) => updateWeight(security.ticker, v)}
              max={100}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              min="0"
              max="100"
              value={security.weight}
              onChange={(e) => updateWeight(security.ticker, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 h-7 text-center text-sm bg-slate-800 border-slate-600 text-white"
            />
            <span className="text-xs text-slate-500">%</span>
          </div>
        </div>
      ))}

      {/* Add Security Dropdown */}
      <div className="flex flex-wrap gap-2 pt-2">
        {availableSecurities
          .filter(s => !securities.find(sec => sec.ticker === s.ticker))
          .slice(0, 5)
          .map((security) => (
            <Button
              key={security.ticker}
              variant="outline"
              size="sm"
              onClick={() => addSecurity(security)}
              className="text-xs bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300"
            >
              <Plus className="w-3 h-3 mr-1" />
              {security.ticker}
            </Button>
          ))}
      </div>

      {totalWeight !== 100 && securities.length > 0 && (
        <p className={cn(
          "text-xs",
          totalWeight > 100 ? "text-rose-400" : "text-amber-400"
        )}>
          Security weights sum to {totalWeight}% (should be 100%)
        </p>
      )}
    </div>
  );
};

export default function SandboxTab({ portfolio }) {
  const [totalInvestment, setTotalInvestment] = useState(portfolio?.total_value || 1000000);
  const [currency, setCurrency] = useState("USD");
  const [allocations, setAllocations] = useState([
    { id: "equities", percent: 60, securities: [] },
    { id: "fixed_income", percent: 30, securities: [] },
    { id: "cash", percent: 10, securities: [] },
  ]);
  const [expandedClass, setExpandedClass] = useState(null);

  // Estimated metrics based on allocation
  const estimatedReturn = allocations.reduce((sum, a) => {
    const returns = { equities: 8.5, fixed_income: 4.2, alternatives: 6.5, real_estate: 7.0, commodities: 5.0, cash: 4.5 };
    return sum + (a.percent / 100) * (returns[a.id] || 5);
  }, 0);

  const estimatedBeta = allocations.reduce((sum, a) => {
    const betas = { equities: 1.0, fixed_income: 0.2, alternatives: 0.7, real_estate: 0.6, commodities: 0.4, cash: 0 };
    return sum + (a.percent / 100) * (betas[a.id] || 0.5);
  }, 0);

  const estimatedVolatility = allocations.reduce((sum, a) => {
    const vols = { equities: 18, fixed_income: 5, alternatives: 15, real_estate: 12, commodities: 20, cash: 1 };
    return sum + (a.percent / 100) * (vols[a.id] || 10);
  }, 0);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const totalAllocation = allocations.reduce((sum, a) => sum + a.percent, 0);

  const updateAllocation = (id, percent) => {
    setAllocations(allocations.map(a => 
      a.id === id ? { ...a, percent } : a
    ));
  };

  const removeAllocation = (id) => {
    setAllocations(allocations.filter(a => a.id !== id));
    if (expandedClass === id) setExpandedClass(null);
  };

  const addAssetClass = (assetClass) => {
    if (!allocations.find(a => a.id === assetClass.id)) {
      setAllocations([...allocations, { id: assetClass.id, percent: 0, securities: [] }]);
    }
  };

  const updateSecurities = (assetClassId, securities) => {
    setAllocations(allocations.map(a =>
      a.id === assetClassId ? { ...a, securities } : a
    ));
  };

  const getAssetClassInfo = (id) => ASSET_CLASS_OPTIONS.find(ac => ac.id === id);

  const pieData = allocations
    .filter(a => a.percent > 0)
    .map(a => ({
      name: getAssetClassInfo(a.id)?.name,
      value: a.percent,
      color: getAssetClassInfo(a.id)?.color,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <Castle className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Portfolio Sandbox</h2>
            <p className="text-sm text-slate-400">Build and experiment with custom portfolio allocations</p>
          </div>
        </div>
      </div>

      {/* Investment Amount & Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-2">Investment Amount</p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={totalInvestment}
              onChange={(e) => setTotalInvestment(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-xl font-bold bg-slate-800 border-slate-600 text-white flex-1"
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                <SelectItem value="CHF">🇨🇭 CHF</SelectItem>
                <SelectItem value="JPY">🇯🇵 JPY</SelectItem>
                <SelectItem value="CAD">🇨🇦 CAD</SelectItem>
                <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Historical Expected Return</p>
          <p className="text-2xl font-bold text-emerald-400">+{estimatedReturn.toFixed(2)}%</p>
          <p className="text-xs text-slate-500">Annualized</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Portfolio Beta</p>
          <p className="text-2xl font-bold text-white">{estimatedBeta.toFixed(2)}</p>
          <p className="text-xs text-slate-500">vs Market</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Volatility (σ)</p>
          <p className="text-2xl font-bold text-white">{estimatedVolatility.toFixed(2)}%</p>
          <p className="text-xs text-slate-500">Annualized</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Asset Allocation</h3>
              <Badge className={cn(
                "text-sm",
                totalAllocation === 100 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : totalAllocation > 100 
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-amber-500/20 text-amber-400"
              )}>
                {totalAllocation}% allocated
              </Badge>
            </div>

            <div className="space-y-4">
              {allocations.map((allocation) => {
                const assetClass = getAssetClassInfo(allocation.id);
                return (
                  <div key={allocation.id}>
                    <div 
                      onClick={() => setExpandedClass(expandedClass === allocation.id ? null : allocation.id)}
                      className="cursor-pointer"
                    >
                      <AllocationSlider
                        label={assetClass?.name}
                        value={allocation.percent}
                        onChange={(v) => updateAllocation(allocation.id, v)}
                        color={assetClass?.color}
                        onRemove={allocations.length > 1 ? () => removeAllocation(allocation.id) : null}
                      />
                    </div>
                    {expandedClass === allocation.id && (
                      <SecuritySelector
                        assetClassId={allocation.id}
                        securities={allocation.securities}
                        onSecuritiesChange={(s) => updateSecurities(allocation.id, s)}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Asset Class */}
            {allocations.length < ASSET_CLASS_OPTIONS.length && (
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 mb-3">Add asset class:</p>
                <div className="flex flex-wrap gap-2">
                  {ASSET_CLASS_OPTIONS
                    .filter(ac => !allocations.find(a => a.id === ac.id))
                    .map((assetClass) => (
                      <Button
                        key={assetClass.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addAssetClass(assetClass)}
                        className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {assetClass.name}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          {/* Pie Chart */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Allocation Overview</h3>
            {pieData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                              <p className="text-white text-sm">{payload[0].name}</p>
                              <p className="text-slate-300 text-sm">{payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No allocations yet</p>
            )}

            {/* Legend */}
            <div className="space-y-2 mt-4">
              {allocations.filter(a => a.percent > 0).map((allocation) => {
                const assetClass = getAssetClassInfo(allocation.id);
                return (
                  <div key={allocation.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: assetClass?.color }} />
                      <span className="text-sm text-slate-400">{assetClass?.name}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{allocation.percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Portfolio Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Asset Classes</span>
                <span className="text-white font-medium">{allocations.filter(a => a.percent > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Securities</span>
                <span className="text-white font-medium">
                  {allocations.reduce((sum, a) => sum + a.securities.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Equity Exposure</span>
                <span className="text-white font-medium">
                  {allocations.find(a => a.id === "equities")?.percent || 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fixed Income</span>
                <span className="text-white font-medium">
                  {allocations.find(a => a.id === "fixed_income")?.percent || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}