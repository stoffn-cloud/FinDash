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
import PortfolioEditor, { DEFAULT_PORTFOLIO, Asset } from "../components/dashboard/PortfolioEditor";

export type FutExInputs = Record<string, number>;

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<any>(null);

  // 1. LOKALE PORTEFEUILLE STATE MET DEFAULT FALLBACK
  const [myAssets, setMyAssets] = useState<Asset[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fin_dash_assets");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.length > 0 ? parsed : DEFAULT_PORTFOLIO;
        } catch (e) {
          return DEFAULT_PORTFOLIO;
        }
      }
    }
    return DEFAULT_PORTFOLIO;
  });

  // Persist naar localStorage bij wijzigingen
  useEffect(() => {
    localStorage.setItem("fin_dash_assets", JSON.stringify(myAssets));
  }, [myAssets]);

  const [futExInputs, setFutExInputs] = useState<FutExInputs>({
    Equity: 7.5, FixedIncome: 3.0, Crypto: 15.0, Commodities: 4.0, Cash: 2.0, RealEstate: 5.0
  });

  // 2. LIVE DATA FETCHING MET STABIELE QUERY KEY
  const { data: livePriceData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["livePrices", [...myAssets].map(a => a.ticker).sort()],
    queryFn: async () => {
      const validTickers = myAssets
        .map(a => a.ticker?.trim().toUpperCase())
        .filter(t => t && t !== "");

      if (validTickers.length === 0) return {};
      
      const symbols = Array.from(new Set(validTickers)).join(',');
      const response = await fetch(`http://localhost:5000/api/prices?symbols=${symbols}`);
      
      if (!response.ok) throw new Error("Backend server offline");
      return response.json();
    },
    enabled: myAssets.length > 0,
    refetchInterval: 60000, 
    staleTime: 30000,
  });

  // 3. ENGINE CALCULATIONS (Gerepareerd voor NaN en Dubbele Berekeningen)
  const processedPortfolio = useMemo(() => {
    if (!myAssets || myAssets.length === 0) return null;

    const rawPortfolio = {
      name: "Main Terminal",
      assets: myAssets.map((asset, idx) => {
        const ticker = asset?.ticker ? String(asset.ticker).toUpperCase().trim() : "";
        
        // Zoek live prijs op, anders gebruik handmatige prijs uit editor, anders 0
        const currentLivePrice = (livePriceData && livePriceData[ticker]) 
          ? Number(livePriceData[ticker]) 
          : (Number(asset.price) || 0);
        
        const amount = Number(asset.amount) || 0;

        return {
          ...asset,
          id: asset.id || `gen-${ticker}-${idx}`, // Garandeer unieke key voor UI
          ticker: ticker,
          symbol: ticker,
          price: currentLivePrice,
          amount: amount,
          value: currentLivePrice * amount,
          historicalPrices: {
            lastClose: currentLivePrice * 0.99,
            monthAgo: currentLivePrice * 0.92,
            yearAgo: currentLivePrice * 0.85
          }
        };
      })
    };

    return processPortfolioData(rawPortfolio as any, futExInputs);
  }, [livePriceData, myAssets, futExInputs]);

  // Loading screen alleen bij eerste boot zonder data
  if (isLoading && myAssets.length > 0 && !livePriceData) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-10">
        <div className="max-w-7xl w-full space-y-8 text-center">
           <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
           <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Neural Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  {isFetching ? "Syncing..." : "Live Engine Active"}
                </span>
                {isFetching && <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                {processedPortfolio?.name || "Terminal"}
              </h1>
              {processedPortfolio && (
                <div className="text-slate-500 text-[11px] font-bold mt-4 flex flex-wrap items-center gap-4 font-mono uppercase tracking-wider">
                  <span>NAV: <b className="text-white text-sm">${processedPortfolio.summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></span>
                  <span className="w-1 h-1 bg-slate-800 rounded-full" />
                  <span className="text-blue-400">EXP: +{processedPortfolio.summary.futExpPct}%</span>
                  <span className="w-1 h-1 bg-slate-800 rounded-full" />
                  <span className={Number(processedPortfolio.summary.performance.d) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    24H: {processedPortfolio.summary.performance.d}%
                  </span>
                </div>
              )}
            </motion.div>
            
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              className="bg-slate-900/50 border-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest h-11 px-6"
            >
              <RefreshCw className="w-4 h-4 mr-3" /> Manual Sync
            </Button>
          </header>

          <Tabs defaultValue="dashboard" className="w-full">
            <div className="sticky top-6 z-50 mb-12">
              <TabsList className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1 shadow-2xl">
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
                <TabsContent key="dashboard-tab" value="dashboard" className="outline-none">
                  {processedPortfolio ? (
                    <DashboardContent 
                      portfolio={processedPortfolio}
                      assetClasses={processedPortfolio.assetClasses}
                      onSelectAsset={setSelectedAssetClass} 
                    />
                  ) : <EmptyState />}
                </TabsContent>

                <TabsContent key="manage-tab" value="manage" className="outline-none">
                  <PortfolioEditor 
                    initialAssets={myAssets} 
                    onSave={(updatedAssets) => {
                      setMyAssets(updatedAssets);
                      // Korte timeout om te zorgen dat state is bijgewerkt voor refetch
                      setTimeout(() => refetch(), 150);
                    }} 
                  />
                </TabsContent>

                <TabsContent key="strategy-tab" value="strategy" className="outline-none">
                  {processedPortfolio && (
                    <FutExTab 
                      assets={processedPortfolio.assets} 
                      inputs={futExInputs}
                      onInputChange={setFutExInputs}
                    />
                  )}
                </TabsContent>

                <TabsContent key="risk-tab" value="risk" className="outline-none">
                  {processedPortfolio && <RiskTab portfolio={processedPortfolio} />}
                </TabsContent>

                <TabsContent key="correlations-tab" value="correlations" className="outline-none">
                  {processedPortfolio && (
                    <CorrelationsTab 
                      assetClasses={processedPortfolio.assetClasses} 
                      portfolio={processedPortfolio} 
                    />
                  )}
                </TabsContent>

                <TabsContent key="markets-tab" value="markets" className="outline-none">
                  <MarketsTab />
                </TabsContent>

                <TabsContent key="calendar-tab" value="calendar" className="outline-none">
                  {processedPortfolio && <CalendarTab assetClasses={processedPortfolio.assetClasses} />}
                </TabsContent>

                <TabsContent key="sandbox-tab" value="sandbox" className="outline-none">
                  {processedPortfolio && <SandboxTab portfolio={processedPortfolio} />}
                </TabsContent>

                <TabsContent key="calculations-tab" value="calculations" className="outline-none">
                  <CalculationsTab />
                </TabsContent>

                <TabsContent key="transactions-tab" value="transactions" className="outline-none">
  {/* Gebruik de optionele chaining en een fallback lege array */}
  <TransactionHistory transactions={(processedPortfolio as any)?.transactions || []} />
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
    <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm">
      <div className="p-4 rounded-full bg-white/5 mb-4">
        <PlusCircle className="w-8 h-8 text-slate-700" />
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Terminal is offline</p>
      <p className="text-slate-600 text-[9px] mt-2 font-mono uppercase">Initialize Engine via Asset Ledger</p>
    </div>
  );
}

function NavTrigger({ value, icon: Icon, label }: { value: string, icon: any, label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_25px_rgba(37,99,235,0.4)] text-slate-500 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 hover:text-slate-200"
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </TabsTrigger>
  );
}