'use client';

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import PageHeader from "@/components/layout/pageHeader";
import TabRenderer from "@/components/layout/tabRenderer";
import Footer from "@/components/layout/footer";
import AssetClassDetail from "@/components/features/overviewTab/assetClassDetail";
import { usePortfolioStore } from "@/store/enrichedData/useSnapshotPortfolioStore";

export default function DashboardPage() {
  const { portfolio, isInitialised } = usePortfolioStore();
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Server error: ${response.status}`);
      }
      const berekendPortfolio = await response.json();
      
      usePortfolioStore.setState({ 
        portfolio: berekendPortfolio, 
        isInitialised: true 
      });
    } catch (err: any) {
      console.error("❌ Fetch Error:", err);
      setError(err.message || "Kon de data niet ophalen.");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialised) {
      refreshData();
    }
  }, [isInitialised, refreshData]);

  return (
    // 'flex' op de root div zorgt ervoor dat Sidebar en de rest naast elkaar staan
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* 1. SIDEBAR (Links) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. RECHTER KOLOM (Header + Content + Footer) */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto h-screen">
        
        {/* Header bovenaan de rechter kolom */}
        <Header isFetching={isFetching} onRefresh={refreshData} />
        
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <PageHeader 
              activeTab={activeTab} 
              isFetching={isFetching} 
              onRefresh={refreshData}
              onAddAsset={() => console.log("Open Modal")} 
            />
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono animate-in fade-in duration-300">
                <span className="font-bold uppercase tracking-widest mr-2">[Error]</span> {error}
              </div>
            )}

            {/* Content Switch */}
            {isInitialised && portfolio ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <TabRenderer 
                  activeTab={activeTab} 
                  portfolio={portfolio} 
                  onAssetClick={(ac) => setSelectedAssetClass(ac.asset_class)} 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-2 border-blue-500/10 rounded-2xl" />
                  <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-2xl animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold tracking-tighter uppercase italic">Engine Pulse</h3>
                  <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse mt-2">
                    Calibrating Analytics...
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

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