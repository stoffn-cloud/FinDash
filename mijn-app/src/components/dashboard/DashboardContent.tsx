"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, Activity, ShieldAlert, Zap } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

// Components
import PortfolioMetricCard from "@/components/dashboard/PortfolioMetricCard";
import SectorChart from "@/components/dashboard/SectorChart";
import CurrencyBreakdown from "@/components/dashboard/CurrencyBreakdown";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import AssetAllocationTable from "@/components/dashboard/AssetAllocationTable";
import GeographicBreakdown from "@/components/dashboard/GeographicBreakdown";
import TerminalActivityFeed from "@/components/dashboard/TerminalActivityFeed";

interface DashboardContentProps {
  portfolio?: any; // De processed portfolio van je engine
  assetClasses?: any[];
  onSelectAsset?: (assetClass: any) => void;
}

export default function DashboardContent({
  portfolio,
  assetClasses = [],
  onSelectAsset,
}: DashboardContentProps) {
  if (!portfolio) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Statussen */}
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Live Market Feed Active • 0.1ms Latency • Node-01 Online
        </span>
      </div>

      {/* Top Row Metrics - De "Big Four" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Totaal Vermogen"
          value={formatCurrency(portfolio.totalValue)}
          icon={Wallet}
          trend={portfolio.dailyChangePercent >= 0 ? "up" : "down"}
          trendValue={portfolio.dailyChangePercent}
          subtitle="Net Liquidation Value"
          delay={0}
        />

        <PortfolioMetricCard
          title="YTD Rendement"
          value={formatPercentage(portfolio.ytdReturn, true)}
          icon={TrendingUp}
          trend={portfolio.ytdReturn >= 0 ? "up" : "down"}
          trendValue={portfolio.ytdReturn}
          subtitle="Year-to-Date Growth"
          delay={0.1}
        />

        <PortfolioMetricCard
          title="Beta (β)"
          value={portfolio.riskMetrics?.beta?.toFixed(2) || "1.00"}
          icon={Activity}
          trend={portfolio.riskMetrics?.beta > 1.2 ? "down" : "up"}
          trendValue={portfolio.riskMetrics?.beta}
          subtitle="Market Sensitivity Index"
          delay={0.2}
        />

        <PortfolioMetricCard
          title="Max Drawdown"
          value={formatPercentage(portfolio.riskMetrics?.maxDrawdown, false, 1)}
          icon={ShieldAlert}
          trend="down"
          trendValue={portfolio.riskMetrics?.maxDrawdown}
          subtitle="Peak-to-Trough Variance"
          delay={0.3}
        />
      </div>

      {/* Main Performance Chart - De hartslag van je portfolio */}
      <div className="rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl overflow-hidden shadow-2xl">
        <PerformanceChart
          data={portfolio.performanceHistory || []}
          benchmarkName="MSCI World Index"
        />
      </div>

      {/* Asset Allocation & Risk Gauges */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <AssetAllocationTable
            assetClasses={assetClasses || []}
            onSelectAsset={onSelectAsset}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 italic">Risk Velocity</h3>
             <div className="space-y-10">
                <RiskGauge
                  label="Portfolio Beta"
                  value={portfolio.riskMetrics?.beta || 0}
                  maxValue={2}
                  description="Leveraged market exposure monitor."
                />
                <RiskGauge
                  label="Annual Volatility"
                  value={portfolio.riskMetrics?.volatility || 0}
                  maxValue={50}
                  unit="%"
                  description="Standard deviation of returns."
                />
             </div>
          </div>
        </div>
      </div>

      {/* Diversificatie Analyse - Sectoren & Valuta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectorChart sectors={portfolio.sectorAllocation || []} />
        <CurrencyBreakdown currencies={portfolio.currencyAllocation || []} />
      </div>

      

      {/* Wereldkaart en Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden">
           <GeographicBreakdown assetClasses={assetClasses || []} />
        </div>
        <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden">
           <TerminalActivityFeed />
        </div>
      </div>
    </div>
  );
}