"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  RefreshCw,
  LayoutDashboard,
  History,
  Grid3X3,
  Globe,
  Calendar as CalendarIcon,
  Calculator,
  Search
} from "lucide-react";

// Utilities
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";

// Dashboard Sections
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

// ------------------- TYPES -------------------
interface AssetClass {
  id: string;
  name: string;
  value: number;
  percentage: number;
  expected_return: number;
  ytd_return: number;
  color: string;
  holdings?: any[];
}

interface Portfolio {
  name: string;
  totalValue: number;
  dailyChangePercent: number;
  ytdReturn: number;
  riskMetrics: {
    beta: number;
    maxDrawdown: number;
    volatility: number;
  };
  assetClasses: AssetClass[];
  sectorAllocation: any[];
  currencyAllocation: any[];
  performanceHistory: any[];
}

// ------------------- MAIN COMPONENT -------------------
export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: portfolio, isLoading, refetch, isFetching } = useQuery<Portfolio>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockPortfolio as unknown as Portfolio;
    },
  });

  if (isLoading || !portfolio) {
    return (
      <div className="min-h-screen bg-[#020617] p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48 bg-slate-800/50 rounded-lg" />
            <Skeleton className="h-10 w-32 bg-slate-800/50 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-slate-800/20 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[450px] w-full bg-slate-800/10 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Terminal v2.0 • Live</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter italic">
                {portfolio.name}
              </h1>
            </motion.div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCommandOpen(true)} className="bg-slate-900/40 border-slate-800 text-slate-400">
                <Search className="w-4 h-4 mr-2" />
                <span className="mr-4">Search...</span>
                <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
              </Button>
              <Button variant="default" onClick={() => refetch()} disabled={isFetching} className="bg-blue-600 hover:bg-blue-500">
                <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
                Sync
              </Button>
            </div>
          </header>

          <Tabs defaultValue="dashboard" className="space-y-8">
            <div className="sticky top-6 z-40">
              <div className="p-1 bg-slate-950/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl inline-block">
                <TabsList className="bg-transparent border-none gap-1">
                  <NavTrigger value="dashboard" icon={LayoutDashboard} label="Overview" />
                  <NavTrigger value="assets" icon={Grid3X3} label="Analysis" />
                  <NavTrigger value="transactions" icon={History} label="History" />
                  <NavTrigger value="markets" icon={Globe} label="Markets" />
                  <NavTrigger value="calendar" icon={CalendarIcon} label="Calendar" />
                  <NavTrigger value="sandbox" icon={Wallet} label="Sandbox" />
                  <NavTrigger value="calculations" icon={Calculator} label="Math" />
                </TabsList>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <TabsContent value="dashboard" key="dashboard">
                <DashboardContent 
                  assetClasses={portfolio.assetClasses || []} 
                  onSelectAsset={setSelectedAssetClass} 
                />
              </TabsContent>

              <TabsContent value="assets" key="assets">
                <CorrelationsTab portfolio={portfolio} />
              </TabsContent>

              <TabsContent value="transactions" key="transactions">
                <TransactionHistory />
              </TabsContent>

              <TabsContent value="markets" key="markets">
                <MarketsTab />
              </TabsContent>

              <TabsContent value="calendar" key="calendar">
                <CalendarTab />
              </TabsContent>

              <TabsContent value="sandbox" key="sandbox">
                <SandboxTab />
              </TabsContent>

              <TabsContent value="calculations" key="math">
                <CalculationsTab />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search assets, tools or pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => setIsCommandOpen(false)}>Overview</CommandItem>
            <CommandItem onSelect={() => setIsCommandOpen(false)}>Portfolio Analysis</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <AssetClassDetail 
        assetClass={selectedAssetClass} 
        isOpen={!!selectedAssetClass} 
        onClose={() => setSelectedAssetClass(null)} 
      />
    </div>
  );
}

function NavTrigger({ value, icon: Icon, label }: { value: string; icon: any; label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
    >
      <Icon className="w-4 h-4 mr-2" />
      <span className="hidden md:inline">{label}</span>
    </TabsTrigger>
  );
}