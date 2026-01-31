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

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<any>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const { data: portfolio, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockPortfolio;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] p-10">
        <Skeleton className="h-[400px] w-full bg-slate-800/20 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="relative z-10 p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex justify-between items-end">
            <h1 className="text-5xl font-extrabold text-white italic">
              {portfolio?.name}
            </h1>
          </header>

          <Tabs defaultValue="dashboard" className="space-y-8">
            <TabsList className="bg-slate-950/60 border border-slate-800">
              <TabsTrigger value="dashboard">Overview</TabsTrigger>
              <TabsTrigger value="assets">Analysis</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="dashboard">
                {/* HIER ZAT DE FOUT: Dubbele nesting en vage checks */}
                {portfolio ? (
                  <TabsContent value="dashboard">
                    {portfolio && (
                      <DashboardContent 
                        portfolio={portfolio} 
                        assetClasses={portfolio.assetClasses} 
                        onSelectAsset={setSelectedAssetClass} 
                      />
                    )}
                  </TabsContent>
                ) : null}
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      <AssetClassDetail 
        assetClass={selectedAssetClass} 
        isOpen={!!selectedAssetClass} 
        onClose={() => setSelectedAssetClass(null)} 
      />
    </div>
  );
}