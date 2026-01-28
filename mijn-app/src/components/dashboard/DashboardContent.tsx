import { motion } from "framer-motion";
import { Target } from "lucide-react";

import PortfolioMetricCard from "@/components/dashboard/PortfolioMetricCard";
import SectorChart from "@/components/dashboard/SectorChart";
import CurrencyBreakdown from "@/components/dashboard/CurrencyBreakdown";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import AssetAllocationTable from "@/components/dashboard/AssetAllocationTable";
import GeographicBreakdown from "@/components/dashboard/GeographicBreakdown";
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  BarChart3 
} from "lucide-react";

export default function DashboardContent({ portfolio, assetClasses, setSelectedAssetClass }) {
  const formatCurrency = (value) => {
    if (!value) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Total Value"
          value={formatCurrency(portfolio.total_value)}
          icon={Wallet}
          trend={portfolio.daily_change_percent >= 0 ? "up" : "down"}
          trendValue={`${portfolio.daily_change_percent?.toFixed(2)}% today`}
          delay={0}
        />
        <PortfolioMetricCard
          title="YTD Return"
          value={`${portfolio.ytd_return >= 0 ? '+' : ''}${portfolio.ytd_return?.toFixed(2) || 0}%`}
          icon={TrendingUp}
          trend={portfolio.ytd_return >= 0 ? "up" : "down"}
          subtitle="Year to date"
          delay={0.1}
        />
        <PortfolioMetricCard
          title="Portfolio Beta"
          value={portfolio.beta?.toFixed(2) || "—"}
          icon={Activity}
          subtitle="vs market index"
          delay={0.2}
        />
        <PortfolioMetricCard
          title="Volatility (σ)"
          value={`${portfolio.volatility?.toFixed(2) || "—"}%`}
          icon={BarChart3}
          subtitle="Annualized"
          delay={0.3}
        />
      </div>

      {/* Asset Allocation Table */}
      <AssetAllocationTable 
        assetClasses={assetClasses} 
        onSelectAsset={setSelectedAssetClass}
      />

      {/* Geographic Exposure */}
      <GeographicBreakdown assetClasses={assetClasses} />

      {/* Risk Metrics Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Risk Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RiskGauge 
            label="Beta" 
            value={portfolio.beta || 0} 
            maxValue={2}
            description="Beta measures portfolio sensitivity to market movements. β=1 means it moves with the market."
          />
          <RiskGauge 
            label="Volatility" 
            value={portfolio.volatility || 0} 
            maxValue={40}
            unit="%"
            description="Annualized standard deviation of returns. Higher values indicate more price variability."
          />
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart sectors={portfolio.sectors} />
        <CurrencyBreakdown currencies={portfolio.currencies} />
      </div>

      {/* Performance Chart */}
      <PerformanceChart 
        data={portfolio.performance_history} 
        benchmarkName={portfolio.benchmark_index || "S&P 500"}
      />
    </div>
  );
}