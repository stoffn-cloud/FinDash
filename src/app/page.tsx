'use client';

import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import PageHeader from "@/components/layout/pageHeader";
import TabRenderer from "@/components/layout/tabRenderer";
import Footer from "@/components/layout/footer";
import AssetClassDetail from "@/components/features/overviewTab/assetClassDetail";
import { PortfolioItem } from "@/types";

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isFetching, setIsFetching] = useState(false);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string | null>(null); // Gered uit oude code

  const fetchPortfolio = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/portfolio/assets');
      const data = await res.json();
      setPortfolio(data);
    } catch (error) { console.error(error); } 
    finally { setIsFetching(false); }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* 3 Background Gradients - Gered uit oude code voor maximale sfeer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <Header isFetching={isFetching} onRefresh={fetchPortfolio} />
      
      <div className="flex max-w-[1600px] mx-auto relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="max-w-6xl mx-auto">
            <PageHeader 
              activeTab={activeTab} 
              isFetching={isFetching} 
              onRefresh={fetchPortfolio}
              onAddAsset={() => console.log("Modal openen")} 
            />
            
            <TabRenderer 
              activeTab={activeTab} 
              portfolio={portfolio} 
              onAssetClick={(asset) => console.log(asset)} 
            />
          </div>
        </main>
      </div>

      <Footer />

      {/* Modal - Gered uit oude code */}
      <AssetClassDetail 
        assetClass={selectedAssetClass} 
        onClose={() => setSelectedAssetClass(null)} 
        portfolio={portfolio} 
      />
    </div>
  );
}