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
  portfolio?: any; 
  assetClasses?: any[];
  onSelectAsset?: (assetClass: any) => void;
}

export default function DashboardContent({
  portfolio,
  assetClasses = [],
  onSelectAsset,
}: DashboardContentProps) {
  
  // 1. VOORKOM CRASH: Als de engine nog rekent of data mist
  if (!portfolio || !portfolio.summary) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
            Synchronizing Engine Metrics...
          </p>
        </div>
      </div>
    );
  }

  // 2. VEILIGE DATA EXTRACTIE (Voorkomt NaN in de UI)
  const summary = portfolio.summary;
  const metrics = portfolio.riskMetrics || {};
  
  const totalValue = Number(summary.totalValue) || 0;
  const dailyChangePct = Number(summary.performance?.d) || 0;
  const ytdReturn = Number(summary.performance?.ytd) || 0;
  const beta = Number(metrics.beta) || 1.0;
  const maxDrawdown = Number(metrics.maxDrawdown) || 0;
  const volatility = Number(metrics.volatility) || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Statussen */}
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Live Market Feed Active • Node-01 Online • Data verified
        </span>
      </div>

      {/* Top Row Metrics - De "Big Four" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PortfolioMetricCard
          title="Totaal Vermogen"
          value={formatCurrency(totalValue)}
          icon={Wallet}
          trend={dailyChangePct >= 0 ? "up" : "down"}
          trendValue={dailyChangePct}
          subtitle="Net Liquidation Value"
          delay={0}
        />

        <PortfolioMetricCard
          title="YTD Rendement"
          value={formatPercentage(ytdReturn, true)}
          icon={TrendingUp}
          trend={ytdReturn >= 0 ? "up" : "down"}
          trendValue={ytdReturn}
          subtitle="Year-to-Date Growth"
          delay={0.1}
        />

        <PortfolioMetricCard
          title="Beta (β)"
          value={beta.toFixed(2)}
          icon={Activity}
          trend={beta > 1.2 ? "down" : "up"}
          trendValue={beta}
          subtitle="Market Sensitivity Index"
          delay={0.2}
        />

        <PortfolioMetricCard
          title="Max Drawdown"
          value={formatPercentage(maxDrawdown, false, 1)}
          icon={ShieldAlert}
          trend="down"
          trendValue={maxDrawdown}
          subtitle="Peak-to-Trough Variance"
          delay={0.3}
        />
      </div>

      {/* Main Performance Chart */}
      <div className="rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl overflow-hidden shadow-2xl">
        <PerformanceChart
          data={portfolio.performanceHistory || []}
          benchmarkName="MSCI World Index"
        />
      </div>

      {/* Asset Allocation & Risk Gauges */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {/* We geven een unieke key mee aan de tabel component zelf om re-renders te optimaliseren */}
          <AssetAllocationTable
            key={`table-${totalValue}`}
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
                  value={beta}
                  maxValue={2}
                  description="Leveraged market exposure monitor."
                />
                <RiskGauge
                  label="Annual Volatility"
                  value={volatility}
                  maxValue={50}
                  unit="%"
                  description="Standard deviation of returns."
                />
             </div>
          </div>
        </div>
      </div>

      {/* Diversificatie Analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectorChart sectors={portfolio.sectorAllocation || []} />
        <div className="bg-black/20 border border-white/5 rounded-3xl p-1">
          <CurrencyBreakdown currencies={portfolio.currencyAllocation || []} />
        </div>
      </div>

      {/* Wereldkaart en Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden min-h-[400px]">
           <GeographicBreakdown assetClasses={assetClasses || []} />
        </div>
        <div className="bg-black/20 border border-white/5 rounded-3xl overflow-hidden">
           <TerminalActivityFeed />
        </div>
      </div>
    </div>
  );
}