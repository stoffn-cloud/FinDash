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
  Search,
  Settings
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
  CommandItem,
  CommandShortcut
} from "@/components/ui/command";

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
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Keyboard shortcut voor de Search (Cmd+K)
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: portfolio, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockPortfolio;
    },
  });

  const assetClasses = portfolio?.assetClasses || [];

  if (isLoading) {
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
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
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
                {portfolio?.name}
              </h1>
            </motion.div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCommandOpen(true)}
                className="bg-slate-900/40 border-slate-800 text-slate-400"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="mr-4">Search...</span>
                <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
              </Button>
              <Button
                variant="default"
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-blue-600 hover:bg-blue-500"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
                Sync
              </Button>
            </div>
          </header>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="sticky top-6 z-40">
              <div className="p-1 bg-slate-950/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl inline-block">
                <TabsList className="bg-transparent border-none gap-1">
                  <NavTrigger value="dashboard" icon={LayoutDashboard} label="Overview" />
                  <NavTrigger value="assets" icon={Grid3X3} label="Asset Classes" />
                  <NavTrigger value="transactions" icon={History} label="History" />
                  <NavTrigger value="markets" icon={Globe} label="Markets" />
                  <NavTrigger value="calendar" icon={CalendarIcon} label="Calendar" />
                  <NavTrigger value="sandbox" icon={Wallet} label="Sandbox" />
                  <NavTrigger value="calculations" icon={Calculator} label="Math" />
                </TabsList>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="dashboard"><DashboardContent portfolio={portfolio} assetClasses={assetClasses} onSelectAsset={setSelectedAssetClass} /></TabsContent>
                <TabsContent value="assets"><CorrelationsTab portfolio={portfolio} /></TabsContent>
                <TabsContent value="transactions"><TransactionHistory /></TabsContent>
                <TabsContent value="markets"><MarketsTab /></TabsContent>
                <TabsContent value="calendar"><CalendarTab /></TabsContent>
                <TabsContent value="sandbox"><SandboxTab /></TabsContent>
                <TabsContent value="calculations"><CalculationsTab /></TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {/* Global Command Menu */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search assets, tools or pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => setIsCommandOpen(false)}>Overview</CommandItem>
            <CommandItem onSelect={() => setIsCommandOpen(false)}>Portfolio Analysis</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => refetch()}>Refresh Data</CommandItem>
            <CommandItem>Export CSV</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Detail Modal */}
      <AssetClassDetail 
        assetClass={selectedAssetClass} 
        isOpen={!!selectedAssetClass} 
        onClose={() => setSelectedAssetClass(null)} 
      />
    </div>
  );
}

// Helper component for cleaner TabsList
function NavTrigger({ value, icon: Icon, label }) {
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