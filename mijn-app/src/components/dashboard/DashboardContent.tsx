"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, Activity, ShieldAlert } from "lucide-react";

// Components - Zorg dat deze paden exact kloppen
import PortfolioMetricCard from "@/components/dashboard/PortfolioMetricCard";
import SectorChart from "@/components/dashboard/SectorChart";
import CurrencyBreakdown from "@/components/dashboard/CurrencyBreakdown";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import AssetAllocationTable from "@/components/dashboard/AssetAllocationTable";
import GeographicBreakdown from "@/components/dashboard/GeographicBreakdown";

// ------------------------
// Types (Gecorrigeerd voor consistentie)
// ------------------------
interface DashboardContentProps {
  portfolio: any; // Voor nu any, of gebruik je gedefinieerde Portfolio type
  assetClasses: any[];
  onSelectAsset: (asset: any) => void; // Match met Dashboard.tsx
}

export default function DashboardContent({
  portfolio,
  assetClasses = [],
  onSelectAsset, // Naam aangepast voor consistentie
}: DashboardContentProps) {
  
  if (!portfolio) return null;

  // Formatter voor grote bedragen
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "€0";
    if (value >= 1000000) return `€${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(1)}K`;
    return `€${value.toFixed(0)}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-12"
    >
      {/* Top Row: Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Totaal Vermogen"
          value={formatCurrency(portfolio.totalValue)}
          icon={Wallet}
          trend={portfolio.dailyChangePercent >= 0 ? "up" : "down"}
          trendValue={`${portfolio.dailyChangePercent >= 0 ? '+' : ''}${portfolio.dailyChangePercent?.toFixed(2)}%`}
          subtitle="Live Terminal Value"
          delay={0}
        />

        <PortfolioMetricCard
          title="YTD Rendement"
          value={`${portfolio.ytdReturn >= 0 ? '+' : ''}${portfolio.ytdReturn?.toFixed(2)}%`}
          icon={TrendingUp}
          trend={portfolio.ytdReturn >= 0 ? "up" : "down"}
          trendValue="vs. Benchmark"
          subtitle="Year-to-Date"
          delay={0.1}
        />

        <PortfolioMetricCard
          title="Portfolio Beta"
          value={portfolio.riskMetrics?.beta?.toFixed(2) || "1.00"}
          icon={Activity}
          trend={portfolio.riskMetrics?.beta > 1.1 ? "down" : "up"}
          trendValue={portfolio.riskMetrics?.beta > 1.1 ? "High Risk" : "Stable"}
          subtitle="Marktgevoeligheid"
          delay={0.2}
        />

        <PortfolioMetricCard
          title="Max Drawdown"
          value={`${portfolio.riskMetrics?.maxDrawdown?.toFixed(1) || "0"}%`}
          icon={ShieldAlert}
          trend="down"
          trendValue="Risk Exposure"
          subtitle="Historisch dieptepunt"
          delay={0.3}
        />
      </div>

      {/* Main Performance Area */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-[2rem] p-1 shadow-2xl overflow-hidden">
        <PerformanceChart
          data={portfolio.performanceHistory || []}
          benchmarkName="S&P 500 Benchmark"
        />
      </div>

      {/* Mid Section: Table & Risk Gauges */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <AssetAllocationTable
            assetClasses={assetClasses}
            onSelectAsset={onSelectAsset}
          />
        </div>
        <div className="xl:col-span-4 space-y-6">
          <RiskGauge
            label="Systematisch Risico (Beta)"
            value={portfolio.riskMetrics?.beta || 0}
            maxValue={2}
            description="Focus op marktcorrelatie."
          />
          <RiskGauge
            label="Volatiliteit (Sigma)"
            value={portfolio.riskMetrics?.volatility || 0}
            maxValue={40}
            unit="%"
            description="Spreiding van dagelijkse fluctuaties."
          />
        </div>
      </div>

      {/* Bottom Section: Diversification Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart sectors={portfolio.sectorAllocation || []} />
        <CurrencyBreakdown currencies={portfolio.currencyAllocation || []} />
      </div>

      {/* Map Section */}
      <div className="bg-slate-900/20 rounded-[2.5rem] border border-slate-800/40 p-2">
        <GeographicBreakdown assetClasses={assetClasses} />
      </div>
    </motion.div>
  );
}