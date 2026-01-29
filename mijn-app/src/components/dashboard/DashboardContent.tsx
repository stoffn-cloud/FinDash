import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, Activity, BarChart3 } from "lucide-react";

// UI Components & Charts
import PortfolioMetricCard from "@/components/dashboard/PortfolioMetricCard";
import SectorChart from "@/components/dashboard/SectorChart";
import CurrencyBreakdown from "@/components/dashboard/CurrencyBreakdown";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import AssetAllocationTable from "@/components/dashboard/AssetAllocationTable";
import GeographicBreakdown from "@/components/dashboard/GeographicBreakdown";

export default function DashboardContent({ portfolio, assetClasses, setSelectedAssetClass }) {
  // Helper voor mooie bedragen
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      {/* 1. Key Metrics - Nu gekoppeld aan mockData velden */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Totaal Vermogen"
          value={formatCurrency(portfolio.totalValue)}
          icon={Wallet}
          trend={portfolio.dailyChangePercent >= 0 ? "up" : "down"}
          trendValue={`${portfolio.dailyChangePercent >= 0 ? '+' : ''}${portfolio.dailyChangePercent?.toFixed(2)}% vandaag`}
          delay={0}
        />
        <PortfolioMetricCard
          title="YTD Rendement"
          value={`${portfolio.ytdReturn >= 0 ? '+' : ''}${portfolio.ytdReturn?.toFixed(2) || 0}%`}
          icon={TrendingUp}
          trend={portfolio.ytdReturn >= 0 ? "up" : "down"}
          subtitle="Year to date"
          delay={0.1}
        />
        <PortfolioMetricCard
          title="Portfolio Beta"
          value={portfolio.riskMetrics?.beta?.toFixed(2) || "1.00"}
          icon={Activity}
          subtitle="vs Benchmark"
          delay={0.2}
        />
        <PortfolioMetricCard
          title="Volatiliteit (σ)"
          value={`${portfolio.riskMetrics?.volatility?.toFixed(2) || "0"}%`}
          icon={BarChart3}
          subtitle="Op jaarbasis"
          delay={0.3}
        />
      </div>

      {/* 2. De Tabel met Asset Classes */}
      <AssetAllocationTable 
        assetClasses={assetClasses} 
        onSelectAsset={setSelectedAssetClass}
      />

      {/* 3. Geografische Spreiding */}
      <GeographicBreakdown assetClasses={assetClasses} />

      {/* 4. Risico Analyse (Gauges) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Risico Analyse</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <RiskGauge 
            label="Portfolio Beta" 
            value={portfolio.riskMetrics?.beta || 0} 
            maxValue={2}
            description="Gevoeligheid t.o.v. de markt. β=1 beweegt gelijk met de index."
          />
          <RiskGauge 
            label="Volatiliteit" 
            value={portfolio.riskMetrics?.volatility || 0} 
            maxValue={40}
            unit="%"
            description="De beweeglijkheid van je portfolio. Een lagere score is stabieler."
          />
        </div>
      </motion.div>

      {/* 5. Charts Sectie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart sectors={portfolio.sectorAllocation} />
        <CurrencyBreakdown currencies={portfolio.currencyAllocation} />
      </div>

      {/* 6. Performance Historie (De grote grafiek) */}
      <PerformanceChart 
        data={portfolio.performanceHistory} 
        benchmarkName="Global Benchmark"
      />
    </div>
  );
}