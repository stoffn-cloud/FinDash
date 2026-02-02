"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShieldAlert, History, Grid3X3, 
  Globe, Calendar, Castle, Calculator, RefreshCw, Target, PlusCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Logic Imports
import { processPortfolioData } from "../logic/portfolioEngine";

// Dashboard Secties
import DashboardContent from "@/components/dashboard/DashboardContent";
import RiskTab from "@/components/dashboard/RiskTab";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import CorrelationsTab from "@/components/dashboard/CorrelationsTab";
import MarketsTab from "@/components/dashboard/MarketsTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import SandboxTab from "@/components/dashboard/SandboxTab";
import CalculationsTab from "@/components/dashboard/CalculationsTab";
import AssetClassDetail from "@/components/dashboard/AssetClassDetail";
import FutExTab from "@/components/dashboard/FutExTab"; 
import PortfolioEditor from "../components/dashboard/PortfolioEditor";

export type FutExInputs = Record<string, number>;

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<any>(null);

  // 1. LOKALE PORTEFEUILLE STATE
  const [myAssets, setMyAssets] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fin_dash_assets");
      return saved ? JSON.parse(saved) : [
        { symbol: "AAPL", amount: 10, assetClass: "Equity" },
        { symbol: "BTC-USD", amount: 0.5, assetClass: "Crypto" }
      ];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("fin_dash_assets", JSON.stringify(myAssets));
  }, [myAssets]);

  const [futExInputs, setFutExInputs] = useState<FutExInputs>({
    Equity: 7.5, FixedIncome: 3.0, Crypto: 15.0, Commodities: 4.0, Cash: 2.0
  });

  // 2. LIVE DATA FETCHING
  const { data: livePriceData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["livePrices", myAssets.map(a => a.symbol)],
    queryFn: async () => {
      if (myAssets.length === 0) return [];
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols: myAssets.map(a => a.symbol) }),
      });
      return response.json();
    },
    enabled: myAssets.length > 0,
    refetchInterval: 60000,
  });

  // 3. ENGINE CALCULATIONS
  const processedPortfolio = useMemo(() => {
    if (!livePriceData || livePriceData.error) return null;

    const rawPortfolio = {
      name: "Main Terminal",
      assets: myAssets.map(asset => {
        const live = livePriceData.find((l: any) => l.symbol === asset.symbol);
        return {
          ...asset,
          value: (live?.price || 0) * asset.amount,
          historicalPrices: {
            lastClose: live?.lastClose,
            monthAgo: live?.monthAgo,
            yearAgo: live?.yearAgo
          }
        };
      })
    };

    return processPortfolioData(rawPortfolio as any, futExInputs);
  }, [livePriceData, myAssets, futExInputs]);

  if (isLoading && myAssets.length > 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">
        <div className="max-w-7xl w-full space-y-8 text-center">
           <Skeleton className="h-12 w-72 bg-slate-900 rounded-full mx-auto" />
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-slate-900 rounded-2xl" />)}
           </div>
           <Skeleton className="h-96 bg-slate-900 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Live Engine Active
                </span>
                {isFetching && <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
                {processedPortfolio?.name || "Empty Node"}
              </h1>
              {processedPortfolio && (
                <div className="text-slate-500 text-sm font-medium mt-2 flex flex-wrap items-center gap-4 font-mono">
                  <span>VALUE: <b className="text-white">${processedPortfolio.summary.totalValue.toLocaleString()}</b></span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className="text-blue-400">EXP: +{processedPortfolio.summary.futExpPct}%</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className={Number(processedPortfolio.summary.performance.d) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    24H: {processedPortfolio.summary.performance.d}%
                  </span>
                </div>
              )}
            </motion.div>
            
            <Button variant="outline" onClick={() => refetch()} className="bg-slate-900/50 border-slate-800 text-white rounded-xl">
              <RefreshCw className="w-4 h-4 mr-3" /> Sync Node
            </Button>
          </header>

          <Tabs defaultValue="dashboard" className="w-full">
            <div className="sticky top-6 z-50 mb-12">
              <TabsList className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1 shadow-2xl">
                <NavTrigger value="dashboard" icon={LayoutDashboard} label="Overview" />
                <NavTrigger value="manage" icon={PlusCircle} label="Editor" />
                <NavTrigger value="strategy" icon={Target} label="FutEx" />
                <NavTrigger value="risk" icon={ShieldAlert} label="Risk" />
                <NavTrigger value="correlations" icon={Grid3X3} label="Matrix" />
                <NavTrigger value="markets" icon={Globe} label="Markets" />
                <NavTrigger value="calendar" icon={Calendar} label="Events" />
                <NavTrigger value="sandbox" icon={Castle} label="Sandbox" />
                <NavTrigger value="calculations" icon={Calculator} label="Math" />
                <NavTrigger value="transactions" icon={History} label="History" />
              </TabsList>
            </div>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                <TabsContent value="dashboard" className="outline-none">
                  {processedPortfolio ? (
                    <DashboardContent 
                      portfolio={processedPortfolio as any}
                      assetClasses={processedPortfolio.assetClasses as any}
                      onSelectAsset={setSelectedAssetClass} 
                    />
                  ) : <EmptyState />}
                </TabsContent>

                <TabsContent value="manage" className="outline-none">
                  <PortfolioEditor assets={myAssets} setAssets={setMyAssets} />
                </TabsContent>

                <TabsContent value="strategy" className="outline-none">
                  {processedPortfolio && (
                    <FutExTab 
                      assets={processedPortfolio.assets} 
                      inputs={futExInputs}
                      onInputChange={setFutExInputs}
                    />
                  )}
                </TabsContent>

                <TabsContent value="risk" className="outline-none">
                  {processedPortfolio && <RiskTab portfolio={processedPortfolio as any} />}
                </TabsContent>

                <TabsContent value="correlations" className="outline-none">
                  {processedPortfolio && (
                    <CorrelationsTab 
                      assetClasses={processedPortfolio.assetClasses as any} 
                      portfolio={processedPortfolio as any} 
                    />
                  )}
                </TabsContent>

                <TabsContent value="markets" className="outline-none">
                  <MarketsTab />
                </TabsContent>

                <TabsContent value="calendar" className="outline-none">
                  {processedPortfolio && <CalendarTab assetClasses={processedPortfolio.assetClasses as any} />}
                </TabsContent>

                <TabsContent value="sandbox" className="outline-none">
                  {processedPortfolio && <SandboxTab portfolio={processedPortfolio as any} />}
                </TabsContent>

                <TabsContent value="calculations" className="outline-none">
                  <CalculationsTab />
                </TabsContent>

                <TabsContent value="transactions" className="outline-none">
                   <TransactionHistory transactions={processedPortfolio?.transactions || []} />
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>

      {selectedAssetClass && (
        <AssetClassDetail 
          assetClass={selectedAssetClass} 
          onClose={() => setSelectedAssetClass(null)} 
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20 backdrop-blur-sm">
      <p className="text-slate-500 font-medium">Geen assets gevonden in de terminal.</p>
      <p className="text-slate-600 text-sm mt-1">Ga naar de Portfolio Editor om je posities toe te voegen.</p>
    </div>
  );
}

function NavTrigger({ value, icon: Icon, label }: { value: string, icon: any, label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/20 text-slate-400 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 hover:text-white"
    >
      <Icon className="w-4 h-4" />
      {label}
    </TabsTrigger>
  );
}