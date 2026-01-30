import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  RefreshCw,
  LayoutDashboard,
  History,
  Grid3X3,
  Globe,
  Calendar,
  Castle,
  Calculator,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dashboard Secties
import DashboardContent from "@/components/dashboard/DashboardContent";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import CorrelationsTab from "@/components/dashboard/CorrelationsTab";
import MarketsTab from "@/components/dashboard/MarketsTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import SandboxTab from "@/components/dashboard/SandboxTab";
import CalculationsTab from "@/components/dashboard/CalculationsTab";
import AssetClassDetail from "@/components/dashboard/AssetClassDetail";

// Data Import
import { mockPortfolio } from "@/api/mockData";

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState(null);

  const { data: portfolio, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      // Simuleer een kleine vertraging voor de UX-ervaring
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockPortfolio;
    },
  });

  const assetClasses = portfolio?.assetClasses || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48 bg-slate-800/50" />
            <Skeleton className="h-10 w-32 bg-slate-800/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-slate-800/30 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[400px] w-full bg-slate-800/20 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Aurora Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Portfolio Engine v2.0
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                {portfolio.name}
              </h1>
            </div>
            
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-slate-900/50 border-slate-800 hover:bg-slate-800 text-slate-300 backdrop-blur-md"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
              {isFetching ? "Syncing..." : "Update Engine"}
            </Button>
          </header>

          {/* Navigation Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-8">
            <div className="sticky top-4 z-30 group">
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl transition-all" />
              <TabsList className="relative bg-transparent h-14 p-1 flex justify-start overflow-x-auto no-scrollbar">
                <NavTrigger value="dashboard" icon={LayoutDashboard} label="Overview" />
                <NavTrigger value="correlations" icon={Grid3X3} label="Correlations" />
                <NavTrigger value="markets" icon={Globe} label="Macro" />
                <NavTrigger value="sandbox" icon={Castle} label="Sandbox" />
                <NavTrigger value="transactions" icon={History} label="Logs" />
                <NavTrigger value="calculations" icon={Calculator} label="Tools" />
              </TabsList>
            </div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              <TabsContent value="dashboard" className="focus-visible:outline-none">
                <DashboardContent 
                  portfolio={portfolio}
                  assetClasses={assetClasses}
                  setSelectedAssetClass={setSelectedAssetClass}
                />
              </TabsContent>

              <TabsContent value="correlations">
                <CorrelationsTab assetClasses={assetClasses} portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="markets">
                <MarketsTab />
              </TabsContent>

              <TabsContent value="sandbox">
                <SandboxTab portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionHistory transactions={portfolio.transactions} />
              </TabsContent>

              <TabsContent value="calculations">
                <CalculationsTab />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedAssetClass && (
          <AssetClassDetail 
            assetClass={selectedAssetClass} 
            onClose={() => setSelectedAssetClass(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Kleine helper voor de tabs om herhaling te voorkomen
function NavTrigger({ value, icon: Icon, label }) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl px-5 text-xs font-bold uppercase tracking-wider transition-all"
    >
      <Icon className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">{label}</span>
    </TabsTrigger>
  );
}