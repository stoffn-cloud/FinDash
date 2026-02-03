import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  DollarSign,
  Activity,
  ShieldAlert,
  Search,
  RefreshCw,
  Plus,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PerformanceChart from "./PerformanceChart";
import SectorChart from "./SectorChart";
import AssetAllocationTable from "./AssetAllocationTable";
import RiskTab from "./RiskTab";
import MarketsTab from "./MarketsTab";
import CalendarTab from "./CalendarTab";
import PortfolioEditor from "./PortfolioEditor";
import { cn } from "@/lib/utils";
import type { Portfolio, AssetClass } from "@/types/dashboard";

interface DashboardContentProps {
  portfolio: Portfolio;
  onAssetClick: (asset: AssetClass) => void;
  showOnly?: string; 
}

export default function DashboardContent({ portfolio, onAssetClick, showOnly = "overview" }: DashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // We normaliseren de state naar kleine letters voor de checks
  const currentView = showOnly?.toLowerCase().trim();

  const metrics = useMemo(() => [
    {
      label: "Totaal Vermogen",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(portfolio.totalValue || 0),
      change: `+${portfolio.dailyChangePercent || 0}%`,
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "YTD Rendement",
      value: `+${portfolio.ytdReturn || 0}%`,
      change: "+8.45%",
      trend: "up",
      icon: ArrowUpRight,
    },
    {
      label: "Beta (β)",
      value: portfolio.riskMetrics?.beta?.toString() || "0.00",
      change: "+0.05",
      trend: "up",
      icon: Activity,
    },
    {
      label: "Max Drawdown",
      value: `${portfolio.riskMetrics?.maxDrawdown || 0}%`,
      change: "-12.4%",
      trend: "down",
      icon: ShieldAlert,
    }
  ], [portfolio]);

  return (
    <div className="space-y-6">

      {/* --- SECTIE 1: DYNAMISCHE CONTENT --- */}
      <div className="space-y-8">

        {/* --- VIEW: DASHBOARD OVERVIEW --- */}
        {currentView === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                        {metric.trend === "up" ? "↑" : "↓"} {metric.change}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</p>
                    <h3 className="text-xl font-bold text-white tracking-tight">{metric.value}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center border-y border-white/5 py-3 bg-white/[0.01]">
              <div className="inline-flex items-center gap-12">
                {["APPELS", "PEREN", "BANANEN", "CITROENEN"].map((item) => (
                  <span key={item} className="text-[10px] font-black tracking-[0.2em] text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PerformanceChart data={portfolio.performanceHistory || []} />
              </div>
              <div className="bg-slate-900/20 rounded-3xl border border-white/5">
                <SectorChart sectors={portfolio.sectorAllocation || []} />
              </div>
              <div className="lg:col-span-3">
                <AssetAllocationTable assetClasses={portfolio.assetClasses || []} onAssetClick={onAssetClick} />
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: ASSETS --- */}
        {currentView === "assets" && (
          <div className="animate-in fade-in duration-500">
            <AssetAllocationTable assetClasses={portfolio.assetClasses || []} onAssetClick={onAssetClick} />
          </div>
        )}

        {/* --- VIEW: RISK --- */}
        {currentView === "risk" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RiskTab portfolio={portfolio} />
          </div>
      )}

        {/* --- VIEW: CALENDAR --- */}
        {currentView === "calendar" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <CalendarTab assetClasses={portfolio.assetClasses || []} />
          </div>
        )}

        {/* --- VIEW: MARKETS --- */}
        {currentView === "markets" && (
          <div className="animate-in fade-in duration-500">
             <MarketsTab />
          </div>
        )}

        {/* --- VIEW: EDITOR / LAYERS --- */}
        {(currentView === "editor" || currentView === "layers") && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PortfolioEditor portfolio={portfolio} />
          </div>
        )}
      </div>
    </div>
  );
}