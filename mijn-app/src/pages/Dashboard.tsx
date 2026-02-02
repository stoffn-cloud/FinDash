"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard,
  ShieldAlert,
  History,
  Grid3X3,
  Globe,
  Calendar,
  Castle,
  Calculator,
  RefreshCw,
  TrendingUp
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// @ts-ignore
import { mockPortfolio } from "../api/mockData.js";

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

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<any>(null);

  // --- CENTRALE DATA FETCH ---
  const { data: portfolio, isLoading, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      // Simuleer een korte vertraging voor de pro-look
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockPortfolio as any;
    },
  });

  // Haal assetClasses direct uit de centrale portfolio bron
  const assetClasses = portfolio?.assetClasses || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">
        <div className="max-w-7xl w-full space-y-8">
          <Skeleton className="h-12 w-72 bg-slate-900 rounded-full" />
          <div className="grid grid-cols-4 gap-4">
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
          
          {/* Header Sectie */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Live Terminal v2.1
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
                {portfolio?.name}
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-2 flex items-center gap-4">
                <span>VALUE: <b className="text-white font-mono">${portfolio?.totalValue?.toLocaleString()}</b></span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span>YTD: <b className="text-emerald-400">+{portfolio?.ytdReturn}%</b></span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span>CURRENCY: <b className="text-slate-300">{portfolio?.currency}</b></span>
              </p>
            </motion.div>
            
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="bg-slate-900/50 border-slate-800 text-white hover:bg-slate-800 rounded-xl px-8 py-6 h-auto transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-3" />
              Sync Node
            </Button>
          </header>

          <Tabs defaultValue="dashboard" className="w-full">
            <div className="sticky top-6 z-50 mb-12">
              <TabsList className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1 shadow-2xl">
                <NavTrigger value="dashboard" icon={LayoutDashboard} label="Overview" />
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
                  <DashboardContent 
                    portfolio={portfolio}
                    assetClasses={assetClasses}
                    onSelectAsset={setSelectedAssetClass} 
                  />
                </TabsContent>

                {/* Risk Tab met Data Injectie */}
                <TabsContent value="risk" className="outline-none">
                  <RiskTab {...({ portfolio } as any)} />
                </TabsContent>

                {/* Correlations Tab met Data Injectie */}
                <TabsContent value="correlations" className="outline-none">
                  <CorrelationsTab {...({ assetClasses, portfolio } as any)} />
                </TabsContent>

                <TabsContent value="markets" className="outline-none">
                  <MarketsTab />
                </TabsContent>

                <TabsContent value="calendar" className="outline-none">
                  <CalendarTab {...({ assetClasses } as any)} />
                </TabsContent>

                {/* Sandbox Tab met Data Injectie */}
                <TabsContent value="sandbox" className="outline-none">
                  <SandboxTab {...({ portfolio } as any)} />
                </TabsContent>

                <TabsContent value="calculations" className="outline-none">
                  <CalculationsTab />
                </TabsContent>

                {/* Transactions Tab met Data Injectie uit de nieuwe MockData */}
                <TabsContent value="transactions" className="outline-none">
                  <TransactionHistory {...({ transactions: portfolio?.transactions } as any)} />
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