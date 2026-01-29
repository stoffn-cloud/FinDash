import React, { useState } from "react";
// We gebruiken nog steeds useQuery voor de structuur, maar zonder de Base44-motor
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Wallet, 
  RefreshCw,
  LayoutDashboard,
  History,
  Grid3X3,
  Globe,
  Calendar,
  Castle,
  Calculator
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

// Importeer je eigen duurzame data
import { mockPortfolio } from "@/api/mockData";

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState(null);

  // Spoor 2: We halen de data nu rechtstreeks uit de mockPortfolio
  const { data: portfolio, isLoading, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => {
      // Hier zouden we later een echte fetch naar een eigen API kunnen doen
      return mockPortfolio;
    },
  });

  // Haal assetClasses veilig uit de portfolio data
  const assetClasses = portfolio?.assetClasses || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-36 bg-slate-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Als er geen data is (bijv. lege mockData)
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Wallet className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Geen Portfolio Data</h2>
          <p className="text-slate-400">Controleer je mockData.js bestand.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Achtergrond effecten */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header - Nu met data uit mockPortfolio */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {portfolio.name || "Mijn Dashboard"}
              </h1>
              <p className="text-slate-400 mt-1">
                Totale Waarde: <span className="text-emerald-400 font-medium">
                  ${portfolio.totalValue?.toLocaleString()}
                </span>
                <span className="ml-4 text-slate-500">
                  Status: <span className="text-slate-300">Live (Mock)</span>
                </span>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Verversen
            </Button>
          </motion.div>

          {/* Tabs Menu */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="bg-slate-800/40 border border-slate-700/50 p-1 mb-8 overflow-x-auto justify-start">
              <TabsTrigger value="dashboard" className="text-sm">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="correlations" className="text-sm">
                <Grid3X3 className="w-4 h-4 mr-2" /> Correlations
              </TabsTrigger>
              <TabsTrigger value="markets" className="text-sm">
                <Globe className="w-4 h-4 mr-2" /> Markets
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-sm">
                <Calendar className="w-4 h-4 mr-2" /> Calendar
              </TabsTrigger>
              <TabsTrigger value="sandbox" className="text-sm">
                <Castle className="w-4 h-4 mr-2" /> Sandbox
              </TabsTrigger>
              <TabsTrigger value="calculations" className="text-sm">
                <Calculator className="w-4 h-4 mr-2" /> Calculations
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-sm">
                <History className="w-4 h-4 mr-2" /> Transactions
              </TabsTrigger>
            </TabsList>

            {/* Content per tab */}
            <TabsContent value="dashboard">
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

            <TabsContent value="calendar">
              <CalendarTab assetClasses={assetClasses} />
            </TabsContent>

            <TabsContent value="sandbox">
              <SandboxTab portfolio={portfolio} />
            </TabsContent>

            <TabsContent value="calculations">
              <CalculationsTab />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAssetClass && (
        <AssetClassDetail 
          assetClass={selectedAssetClass} 
          onClose={() => setSelectedAssetClass(null)} 
        />
      )}
    </div>
  );
}