"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  DollarSign,
  Activity,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PerformanceChart from "./performanceChart";
import SectorChart from "./sectorChart";
import AssetAllocationTable from "./assetAllocationTable";
import RiskTab from "../riskTab/riskTab";
import { cn } from "@/lib/utils";

// CORRECTE IMPORTS
import { usePortfolioStore } from "@/store/enrichedData/useSnapshotPortfolioStore";
import { Portfolio, EnrichedHolding, EnrichedAssetClass } from "@/types"; 

interface DashboardContentProps {
  portfolio: Portfolio;
  onAssetClick: (ac: EnrichedAssetClass) => void; 
  showOnly?: string; 
}

export default function DashboardContent({ portfolio, onAssetClick, showOnly = "overview" }: DashboardContentProps) {
  const isInitialised = usePortfolioStore((state) => state.isInitialised);
  const currentView = showOnly?.toLowerCase().trim();

  const metrics = useMemo(() => {
    if (!portfolio || !portfolio.stats) return [];

    const { stats } = portfolio;

    return [
      {
        label: "Totaal Vermogen",
        value: new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD', 
          notation: 'compact' 
        }).format(stats.total_value || 0), // Gebruik snake_case van de engine
        change: `+${stats.total_assets || 0} Assets`, 
        trend: "up",
        icon: DollarSign,
      },
      {
        label: "Markten",
        value: stats.unique_markets?.toString() || "0",
        change: "Global",
        trend: "up",
        icon: ArrowUpRight,
      },
      {
        label: "Sectoren",
        value: stats.unique_sectors?.toString() || "0",
        change: "GICS",
        trend: "up",
        icon: Activity,
      },
      {
        label: "Trackers vs Stocks",
        value: `${stats.tracker_count || 0} / ${stats.stock_count || 0}`,
        change: "Mix",
        trend: stats.stock_count > stats.tracker_count ? "up" : "down",
        icon: ShieldAlert,
      }
    ];
  }, [portfolio]);

  // Loading state (indien de parent nog niet klaar is)
  if (!isInitialised || !portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Processing Engine Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        {currentView === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, i) => (
                <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-sm group hover:border-blue-500/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <metric.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <Badge variant="outline" className={cn(
                        "font-mono text-[9px] px-1.5 py-0",
                        metric.trend === "up" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-rose-400 border-rose-500/20 bg-rose-500/5"
                      )}>
                        {metric.change}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</p>
                    <h3 className="text-xl font-bold text-white tracking-tight">{metric.value}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 2. Ticker Bar - Statisch voor sfeer */}
            <div className="flex justify-center border-y border-white/5 py-3 bg-white/[0.01]">
              <div className="inline-flex items-center gap-12 overflow-hidden">
                {["EQUITIES", "FIXED INCOME", "COMMODITIES", "CASH"].map((item) => (
                  <span key={item} className="text-[10px] font-black tracking-[0.2em] text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Geef de verrijkte holdings door voor de chart */}
                <PerformanceChart data={portfolio.holdings || []} />
              </div>

              <div className="flex flex-col gap-6">
                {/* De Tabel voor Asset Classes gebruikt nu de geaggregeerde allocatie data */}
                <AssetAllocationTable 
                  assetClasses={portfolio.assetAllocation || []} 
                  onAssetClick={onAssetClick} 
                />
                
                <div className="bg-slate-900/20 rounded-3xl border border-white/5 p-4">
                  <SectorChart sectors={portfolio.sectorAllocation || []} />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "risk" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RiskTab portfolio={portfolio} />
          </div>
        )}
      </div>
    </div>
  );
}