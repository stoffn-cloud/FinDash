'use client';

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import PageHeader from "@/components/layout/pageHeader";
import TabRenderer from "@/components/layout/tabRenderer";
import Footer from "@/components/layout/footer";
import AssetClassDetail from "@/components/features/overviewTab/assetClassDetail";

import { usePortfolioStore } from "@/store/enrichedData/useSnapshotPortfolioStore";
import { portfolioService } from "@/lib/api/portfolioService";

export default function DashboardPage() {
  // 1. Store state & actions
  const { portfolio, isInitialised, updatePortfolio } = usePortfolioStore();
  
  // 2. UI states
  const [activeTab, setActiveTab] = useState("Overview");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string | null>(null);

  /**
   * REFRESH DATA
   * Ingepakt in useCallback om referentiële stabiliteit te behouden
   */
  const refreshData = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await portfolioService.fetchAllData();
      
      updatePortfolio(
        data.assets,
        data.classes,
        data.sectors,
        data.industries,
        data.currencies,
        data.regions,
        data.countries,
        data.markets,
        data.prices
      );
    } catch (err) {
      console.error("❌ Data Fetch Error:", err);
      setError("Kon de portfolio data niet ophalen. Controleer de database verbinding.");
    } finally {
      setIsFetching(false);
    }
  }, [updatePortfolio]);

  // Auto-fetch bij eerste mount
  useEffect(() => {
    if (!isInitialised) {
      refreshData();
    }
  }, [isInitialised, refreshData]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <Header isFetching={isFetching} onRefresh={refreshData} />
      
      <div className="flex max-w-[1600px] mx-auto relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="max-w-6xl mx-auto space-y-6">
            <PageHeader 
              activeTab={activeTab} 
              isFetching={isFetching} 
              onRefresh={refreshData}
              onAddAsset={() => console.log("Open Add Asset Modal")} 
            />
            
            {/* Error State Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Main Content Area */}
            {isInitialised && portfolio ? (
              <TabRenderer 
                activeTab={activeTab} 
                portfolio={portfolio} 
                onAssetClick={(asset) => console.log("Geselecteerd:", asset)} 
              />
            ) : (
              // Verbeterde Loader met Skeleton-feel
              <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-300">Portfolio berekenen</h3>
                  <p className="text-slate-500 text-sm">Data wordt verwerkt door de engine...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Asset Class Detail Modal */}
      {selectedAssetClass && portfolio && (
        <AssetClassDetail 
          assetClass={selectedAssetClass} 
          onClose={() => setSelectedAssetClass(null)} 
          portfolio={portfolio.holdings} 
        />
      )}
    </div>
  );
}