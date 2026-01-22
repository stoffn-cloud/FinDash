import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { 
  Wallet, 
  RefreshCw,
  LayoutDashboard,
  History,
  Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardContent from "@/components/dashboard/DashboardContent";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import CorrelationsTab from "@/components/dashboard/CorrelationsTab";
import AssetClassDetail from "@/components/dashboard/AssetClassDetail";

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState(null);

  const { data: portfolios, isLoading, refetch } = useQuery({
    queryKey: ["portfolios"],
    queryFn: () => base44.entities.Portfolio.list("-updated_date", 1),
  });

  const { data: assetClasses = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: ["assetClasses"],
    queryFn: () => base44.entities.AssetClass.list("-allocation_percent"),
  });

  const portfolio = portfolios?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-36 bg-slate-800 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 bg-slate-800 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-80 bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
            <Wallet className="w-10 h-10 text-slate-500" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Portfolio Found</h2>
            <p className="text-slate-400 max-w-md">
              Create your first portfolio to start tracking your investment performance, risk metrics, and benchmark comparisons.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {portfolio.name || "My Portfolio"}
              </h1>
              <p className="text-slate-400 mt-1">
                Benchmark: <span className="text-slate-300">{portfolio.benchmark_index || "S&P 500"}</span>
                {assetClasses.length > 0 && (
                  <span className="ml-4">
                    Asset Allocation: {assetClasses.map(ac => `${ac.name} ${ac.allocation_percent}%`).join(' · ')}
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="correlations"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Correlations
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              >
                <History className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <DashboardContent 
                portfolio={portfolio}
                assetClasses={assetClasses}
                setSelectedAssetClass={setSelectedAssetClass}
              />
            </TabsContent>

            <TabsContent value="correlations" className="mt-6">
              <CorrelationsTab 
                assetClasses={assetClasses}
                portfolio={portfolio}
              />
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Asset Class Detail Modal */}
      {selectedAssetClass && (
        <AssetClassDetail 
          assetClass={selectedAssetClass} 
          onClose={() => setSelectedAssetClass(null)} 
        />
      )}
    </div>
  );
}