import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, Activity, BarChart3, ShieldAlert } from "lucide-react";

// UI Components & Charts
import PortfolioMetricCard from "@/components/dashboard/PortfolioMetricCard";
import SectorChart from "@/components/dashboard/SectorChart";
import CurrencyBreakdown from "@/components/dashboard/CurrencyBreakdown";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import AssetAllocationTable from "@/components/dashboard/AssetAllocationTable";
import GeographicBreakdown from "@/components/dashboard/GeographicBreakdown";

export default function DashboardContent({ portfolio, assetClasses, setSelectedAssetClass }) {
  
  // Guard clause: als portfolio nog niet geladen is
  if (!portfolio) return null;

  // Helper voor mooie bedragen (K voor duizend, M voor miljoen)
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Top Row: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Totaal Vermogen"
          value={formatCurrency(portfolio.totalValue)}
          icon={Wallet}
          trend={portfolio.dailyChangePercent >= 0 ? "up" : "down"}
          trendValue={`${portfolio.dailyChangePercent >= 0 ? '+' : ''}${portfolio.dailyChangePercent?.toFixed(2)}%`}
          subtitle="Huidige liquidatiewaarde"
          delay={0}
        />
        <PortfolioMetricCard
          title="YTD Rendement"
          value={`${portfolio.ytdReturn >= 0 ? '+' : ''}${portfolio.ytdReturn?.toFixed(2) || 0}%`}
          icon={TrendingUp}
          trend={portfolio.ytdReturn >= 0 ? "up" : "down"}
          subtitle="Rendement sinds 1 jan"
          delay={0.1}
        />
        <PortfolioMetricCard
          title="Beta (β)"
          value={portfolio.riskMetrics?.beta?.toFixed(2) || "1.00"}
          icon={Activity}
          subtitle="Marktgevoeligheid"
          trend={portfolio.riskMetrics?.beta > 1.2 ? "down" : "up"} // Hogere beta = lager 'veiligheid' sentiment
          delay={0.2}
        />
        <PortfolioMetricCard
          title="Max Drawdown"
          value={`${portfolio.riskMetrics?.maxDrawdown?.toFixed(1) || "0"}%`}
          icon={ShieldAlert}
          subtitle="Grootste daling piek-dal"
          delay={0.3}
        />
      </div>

      {/* 2. Main Performance Chart (Full Width) */}
      <PerformanceChart 
        data={portfolio.performanceHistory} 
        benchmarkName="MSCI World Index"
      />

      {/* 3. Asset Allocation & Management */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AssetAllocationTable 
            assetClasses={assetClasses} 
            onSelectAsset={setSelectedAssetClass}
          />
        </div>
        <div className="space-y-6">
          <RiskGauge 
            label="Portfolio Beta" 
            value={portfolio.riskMetrics?.beta || 0} 
            maxValue={2}
            description="β > 1: Beweeglijker dan de markt. β < 1: Defensiever dan de markt."
          />
          <RiskGauge 
            label="Jaarlijkse Volatiliteit" 
            value={portfolio.riskMetrics?.volatility || 0} 
            maxValue={50}
            unit="%"
            description="De spreiding van rendementen. Hoe lager, hoe stabieler de groei."
          />
        </div>
      </div>

      {/* 4. Diversificatie Analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart sectors={portfolio.sectorAllocation} />
        <CurrencyBreakdown currencies={portfolio.currencyAllocation} />
      </div>

      {/* 5. Wereldkaart / Geografisch (Brede Sectie) */}
      <GeographicBreakdown assetClasses={assetClasses} />
      
    </div>
  );
}