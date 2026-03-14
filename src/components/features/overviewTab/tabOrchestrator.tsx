"use client";

import { useMemo } from "react";
import {
  DollarSign, ArrowUpRight, Activity, ShieldAlert, Loader2
} from "lucide-react";
import { motion } from "framer-motion";

// Components
import PerformanceChart from "./historicalPerformanceTile/performanceChart";
import SectorChart from "./sectorChart";
import AssetAllocationTable from "./portfolioMixTile/assetAllocationTable";
import CurrencyBreakdown from "./currencyBreakdown";
import RiskTab from "../riskTab/riskTab";
import { PortfolioValueTile } from "./upperTiles/portfolioValueTile";

// Types
import { Portfolio, EnrichedHolding, EnrichedAssetClass } from "@/types";
import { usePortfolioStore } from "@/store/enrichedData/useSnapshotPortfolioStore";

interface TabOrchestratorProps {
  portfolio: Portfolio;
  onAssetClick: (item: EnrichedHolding | EnrichedAssetClass) => void;
  showOnly?: string;
}

export default function TabOrchestrator({
  portfolio,
  onAssetClick,
  showOnly = "overview"
}: TabOrchestratorProps) {
  const isInitialised = usePortfolioStore((state) => state.isInitialised);
  const currentView = showOnly.toLowerCase().trim();

  const metrics = useMemo(() => {
    if (!portfolio) return [];
    const { stats, totalValue, holdings = [] } = portfolio;

    return [
      {
        label: "Portfolio Total",
        value: new Intl.NumberFormat('en-US', {
          style: 'currency', currency: 'USD', notation: 'compact'
        }).format(totalValue || 0),
        change: `${holdings.length} ${holdings.length === 1 ? 'Asset' : 'Assets'}`,
        icon: DollarSign,
        color: "text-emerald-400"
      },
      {
        label: "Global Reach",
        value: `${stats?.unique_markets || 0}`,
        change: "Markets",
        icon: ArrowUpRight,
        color: "text-blue-400"
      },
      {
        label: "Diversification",
        value: `${stats?.unique_sectors || 0}`,
        change: "Sectors",
        icon: Activity,
        color: "text-purple-400"
      },
      {
        label: "Portfolio Mix",
        value: `${(stats?.stock_count || 0)}:${(stats?.tracker_count || 0)}`,
        change: "Stocks:ETFs",
        icon: ShieldAlert,
        color: "text-amber-400"
      }
    ];
  }, [portfolio]);

  if (!isInitialised || !portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-mono text-xs tracking-widest uppercase animate-pulse">
          Executing Orchestrator...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {currentView === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Dashboard KPI Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <PortfolioValueTile
                key={i}
                label={metric.label}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Linkerkant: Performance Grafiek */}
            <div className="lg:col-span-8">
              <div className="min-h-[500px] w-full overflow-hidden bg-slate-900/20 rounded-[2.5rem] border border-white/5 p-1">
                {/* FIX: Gebruik portfolio.history in plaats van portfolio.holdings */}
                <PerformanceChart data={portfolio.history || []} />
              </div>
            </div>

            {/* Rechterkant: Allocatie en Sectoren */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <AssetAllocationTable
                assetClasses={portfolio.assetAllocation || []}
                onAssetClick={onAssetClick}
              />

              <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 p-8 min-h-[300px] w-full flex flex-col justify-center overflow-hidden">
                <SectorChart sectors={portfolio.sectorAllocation || []} />
              </div>

              {/* FIX: Gebruik currencyExposure conform de nieuwe Portfolio interface */}
              <CurrencyBreakdown
                currencies={portfolio.currencyExposure || []}
              />
            </div>
          </div>
        </motion.div>
      )}

      {currentView === "risk" && (
        <div className="w-full animate-in fade-in duration-500">
          <RiskTab portfolio={portfolio} />
        </div>
      )}
    </div>
  );
}