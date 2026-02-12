import { create } from 'zustand';
import { calculatePortfolioSnapshot } from "@/logic/engineOrchestrator";
import { Asset, AssetClass, Market, Country, Portfolio } from "@/types";

interface PortfolioState {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  syncWithDatabase: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  isLoading: false,
  error: null,

  syncWithDatabase: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log("🔄 FinDash: Gegevens ophalen uit SQL via nieuwe structuur...");

      // We halen de data op bij de opgeschoonde API endpoints
      const [assetsRes, classesRes, marketsRes, countriesRes] = await Promise.all([
        fetch("/api/assets"),
        fetch("/api/asset-classes"),
        fetch("/api/markets/info"),
        fetch("/api/geography/countries")
      ]);

      // Controleer of alle responses ok zijn
      if (!assetsRes.ok || !classesRes.ok) throw new Error("API-connectie mislukt");

      const assetsData = await assetsRes.json();
      const classesData = await classesRes.json();
      const marketsData = await marketsRes.json();
      const countriesData = await countriesRes.json();

      // 4. ENGINE AANROEPEN (bevindt zich in @/logic/engine)
      const snapshot = calculatePortfolioSnapshot(
        assetsData,
        classesData,
        marketsData,
        countriesData,
        new Date().toISOString().split('T')[0]
      );

      set({ 
        portfolio: snapshot, 
        isLoading: false 
      });

      console.log("🚀 FinDash: Dashboard succesvol geladen");
    } catch (error: any) {
      console.error("❌ SQL Sync mislukt:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));