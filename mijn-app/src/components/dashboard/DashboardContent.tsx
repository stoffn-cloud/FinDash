import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, Activity, BarChart3, ShieldAlert } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

// Components
import PortfolioMetricCard from "@/components/dashboard/PortfolioMetricCard";
import SectorChart from "@/components/dashboard/SectorChart";
import CurrencyBreakdown from "@/components/dashboard/CurrencyBreakdown";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import AssetAllocationTable from "@/components/dashboard/AssetAllocationTable";
import GeographicBreakdown from "@/components/dashboard/GeographicBreakdown";

// ------------------------
// TypeScript interfaces
// ------------------------
interface RiskMetrics {
  beta?: number;
  maxDrawdown?: number;
  volatility?: number;
  [key: string]: any;
}

interface Sector {
  name: string;
  value: number;
}

interface Currency {
  code: string;
  percentage: number;
  value: number;
}

interface AssetClass {
  name: string;
  holdings?: any[];
}

interface Portfolio {
  totalValue?: number;
  dailyChangePercent?: number;
  ytdReturn?: number;
  riskMetrics?: RiskMetrics;
  performanceHistory?: any[];
  sectorAllocation?: Sector[];
  currencyAllocation?: Currency[];
}

interface DashboardContentProps {
  portfolio?: Portfolio;
  assetClasses?: AssetClass[];
  setSelectedAssetClass?: (assetClass: AssetClass) => void;
}

// ------------------------
// Component
// ------------------------
export default function DashboardContent({
  portfolio,
  assetClasses = [],
  setSelectedAssetClass,
}: DashboardContentProps) {
  if (!portfolio) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Row Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Totaal Vermogen"
          value={formatCurrency(portfolio.totalValue)}
          icon={Wallet}
          trend={portfolio.dailyChangePercent && portfolio.dailyChangePercent >= 0 ? "up" : "down"}
          trendValue={portfolio.dailyChangePercent}
          subtitle="Huidige liquidatiewaarde"
          className=""
          delay={0}
        />

        <PortfolioMetricCard
          title="YTD Rendement"
          value={formatPercentage(portfolio.ytdReturn, true)}
          icon={TrendingUp}
          trend={portfolio.ytdReturn && portfolio.ytdReturn >= 0 ? "up" : "down"}
          trendValue={portfolio.ytdReturn}
          subtitle="Rendement sinds 1 jan"
          className=""
          delay={0.1}
        />

        <PortfolioMetricCard
          title="Beta (β)"
          value={portfolio.riskMetrics?.beta?.toFixed(2) || "1.00"}
          icon={Activity}
          trend={portfolio.riskMetrics?.beta && portfolio.riskMetrics.beta > 1.2 ? "down" : "up"}
          trendValue={portfolio.riskMetrics?.beta}
          subtitle="Marktgevoeligheid"
          className=""
          delay={0.2}
        />

        <PortfolioMetricCard
          title="Max Drawdown"
          value={formatPercentage(portfolio.riskMetrics?.maxDrawdown, false, 1)}
          icon={ShieldAlert}
          trend="down"
          trendValue={portfolio.riskMetrics?.maxDrawdown}
          subtitle="Grootste daling piek-dal"
          className=""
          delay={0.3}
        />
      </div>

      {/* Main Performance Chart */}
      <PerformanceChart
        data={portfolio.performanceHistory || []}
        benchmarkName="MSCI World Index"
      />

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {/* FIX: fallback naar lege array voorkomt never[] error */}
          <AssetAllocationTable
            assetClasses={assetClasses || []}
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

      {/* Diversificatie Analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart sectors={portfolio.sectorAllocation || []} />
        <CurrencyBreakdown currencies={portfolio.currencyAllocation || []} />
      </div>

      {/* Wereldkaart */}
      <GeographicBreakdown assetClasses={assetClasses || []} />
    </div>
  );
}
