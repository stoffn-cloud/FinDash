"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Components (Zorg dat de paden kloppen met jouw mappenstructuur)
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import SectorChart from "@/components/dashboard/SectorChart";
import MarketsTab from "@/components/dashboard/MarketsTab";
import AssetClassDetail from "@/components/dashboard/AssetClassDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- MOCK DATA (Zou uit je API/Database komen) ---
const DASHBOARD_DATA: any = {
  totalValue: 842500.42,
  performanceYTD: 12.4,
  performanceChange: 2450.20,
  assetClasses: [
    { 
      id: "eq-1", 
      name: "Global Equities", 
      current_value: 520000, 
      allocation_percent: 61.7, 
      expected_return: 8.2,
      ytd_return: 14.5,
      volatility: 15.2,
      color: "#3b82f6",
      holdings: [
        { name: "Apple Inc.", ticker: "AAPL", weight: 4.5, value: 37800, return_ytd: 18.2 },
        { name: "Microsoft", ticker: "MSFT", weight: 4.2, value: 35300, return_ytd: 12.1 },
        { name: "Alphabet C", ticker: "GOOGL", weight: 3.8, value: 31900, return_ytd: 9.4 }
      ]
    },
    { 
      id: "fi-2", 
      name: "Fixed Income", 
      current_value: 210000, 
      allocation_percent: 24.9, 
      expected_return: 4.5,
      ytd_return: 2.1,
      volatility: 5.4,
      color: "#10b981",
      holdings: [
        { name: "US 10Y Treasury", ticker: "US10Y", weight: 10.0, value: 84200, return_ytd: -1.2 }
      ]
    },
    { 
      id: "alt-3", 
      name: "Alternatives", 
      current_value: 112500, 
      allocation_percent: 13.4, 
      expected_return: 6.8,
      ytd_return: 8.4,
      volatility: 12.1,
      color: "#8b5cf6",
      holdings: [
        { name: "Gold Trust", ticker: "GLD", weight: 5.0, value: 42100, return_ytd: 11.5 }
      ]
    }
  ],
  performanceHistory: [
    { date: "2023-01-01", portfolioValue: 0, benchmarkValue: 0 },
    { date: "2023-04-01", portfolioValue: 4.2, benchmarkValue: 3.8 },
    { date: "2023-08-01", portfolioValue: 8.5, benchmarkValue: 7.2 },
    { date: "2024-01-01", portfolioValue: 12.4, benchmarkValue: 10.1 }
  ]
};

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (asset: any) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10 space-y-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-500">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Terminal</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Executive <span className="text-blue-500">Overview</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Position
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/40 border-slate-800 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden ring-1 ring-white/5">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">+1.2% Today</Badge>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Portfolio Value</p>
            <h2 className="text-4xl font-black text-white tracking-tighter font-mono">
              ${DASHBOARD_DATA.totalValue.toLocaleString()}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 shadow-2xl backdrop-blur-md rounded-3xl ring-1 ring-white/5">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Performance YTD</p>
            <h2 className="text-4xl font-black text-emerald-400 tracking-tighter font-mono">
              +{DASHBOARD_DATA.performanceYTD}%
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 shadow-2xl backdrop-blur-md rounded-3xl ring-1 ring-white/5">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <PieChartIcon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-slate-500 text-[10px] font-mono">Current Allocation</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Top Sector</p>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Tech <span className="text-xs text-slate-500 not-italic font-mono font-normal">28%</span>
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 bg-slate-900/40 border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-800/50">
            <CardTitle className="text-white text-xl font-black uppercase italic tracking-tight">Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <PerformanceChart data={DASHBOARD_DATA.performanceHistory} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-slate-900/40 border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-800/50">
            <CardTitle className="text-white text-xl font-black uppercase italic tracking-tight">Sector Exposure</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <SectorChart />
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation Section (De plek van de error fix) */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] italic">Asset Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DASHBOARD_DATA.assetClasses.map((asset: any) => (
            <Card 
              key={asset.id} 
              onClick={() => handleOpenDetail(asset)}
              className="group bg-slate-900/40 border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer rounded-3xl shadow-lg ring-1 ring-white/5"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${asset.color}20`, border: `1px solid ${asset.color}40` }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter uppercase">
                    {asset.allocation_percent}% Weight
                  </span>
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                  {asset.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-mono font-bold text-slate-300">
                    ${(asset.current_value / 1000).toFixed(0)}K
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Markets & Macro Section */}
      <div className="pt-10 border-t border-slate-800/50">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] italic mb-8">Macro Pulse</h3>
        <MarketsTab />
      </div>

      {/* Modal Detail View */}
      <AssetClassDetail 
        assetClass={selectedAsset} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}