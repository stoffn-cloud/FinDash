'use client';

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import PageHeader from "@/components/layout/pageHeader";
import TabRenderer from "@/components/layout/tabRenderer";
import Footer from "@/components/layout/footer";
import AssetClassDetail from "@/components/features/overviewTab/portfolioMixTile/assetClassDetail";
import PortfolioEditor from "@/components/features/portfolioEditor/portfolioEditor"; 
import { usePortfolioStore } from "@/store/enrichedData/useSnapshotPortfolioStore";
import { X } from "lucide-react";

export default function DashboardPage() {
  const { portfolio, isInitialised, updatePortfolio } = usePortfolioStore();
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  /**
   * Haalt alle ruwe data op uit de API en stuurt deze naar de Store.
   * De Store triggert vervolgens de Orchestrator voor alle berekeningen.
   */
  const refreshData = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch('/api/portfolio'); 
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Server error: ${response.status}`);
      }

      const rawData = await response.json();
      
      // We sturen de data exact door in de structuur die de Orchestrator verwacht.
      // De store zal 'calculatePortfolioSnapshot' aanroepen met deze velden.
      updatePortfolio({
        dbAssets: rawData.assets || [],
        dbAssetClasses: rawData.classes || [],
        dbSectors: rawData.sectors || [],
        dbIndustries: rawData.industries || [],
        dbCurrencies: rawData.currencies || [],
        dbRegions: rawData.regions || [],
        dbCountries: rawData.countries || [],
        dbMarkets: rawData.markets || [],
        userHoldings: rawData.userHoldings || [],
        prices: rawData.prices || []
      });

      console.log(`✅ Dashboard gesynchroniseerd: ${rawData.assets?.length || 0} assets ingeladen.`);

    } catch (err: any) {
      console.error("❌ Data Fetch Error:", err);
      setError(err.message || "Fout bij het ophalen van de portfolio data.");
    } finally {
      setIsFetching(false);
    }
  }, [updatePortfolio]);

  // Initialiseer data bij de eerste keer laden
  useEffect(() => {
    if (!isInitialised) {
      refreshData();
    }
  }, [isInitialised, refreshData]);

  const handleEditorSuccess = () => {
    setIsEditorOpen(false);
    refreshData(); 
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto h-screen">
        <Header isFetching={isFetching} onRefresh={refreshData} />
        
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <PageHeader 
              activeTab={activeTab} 
              isFetching={isFetching} 
              onRefresh={refreshData}
              onAddAsset={() => setIsEditorOpen(true)} 
            />
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono">
                <span className="font-bold uppercase tracking-widest mr-2">[Sync Error]</span> {error}
              </div>
            )}

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
                <div className="relative w-20 h-20 animate-pulse">
                    <div className="absolute inset-0 border-2 border-blue-500/10 rounded-2xl" />
                    <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-2xl animate-spin" />
                </div>
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Initialising Engine...</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Fullscreen Editor Modal */}
      {isEditorOpen && portfolio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-slate-900/90 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div>
                <h2 className="text-white font-black uppercase tracking-tighter text-xl">Asset Management</h2>
                <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Database Sync Engine</p>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-2xl text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <PortfolioEditor 
                portfolio={portfolio} 
                onSuccess={handleEditorSuccess} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Asset Class Detail View */}
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