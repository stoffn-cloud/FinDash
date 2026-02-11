import { useState, useEffect } from "react";
// 1. Gebruik de @ alias voor een schone import
import { calculatePortfolioSnapshot } from "@/logic/portfolioEngine";
import { 
  Portfolio, 
  PortfolioItem, 
  AssetClass, 
  AssetSector, 
  AssetIndustry, 
  Currency, 
  Region, 
  Country, 
  Market, 
  Asset 
} from "@/types"; // Importeer alles centraal vanuit de index

class PortfolioStore {
  private portfolio: Portfolio | null = null;
  private listeners: (() => void)[] = [];
  private isLoading: boolean = false;

  // Tip: Zorg dat je backend op 3001 draait zoals hier aangegeven
  private API_BASE_URL = 'http://localhost:3001/api';

  constructor() {}

  /**
   * Haalt alle relationele data op uit de MySQL database via de API
   */
  public async syncWithDatabase() {
    // Voorkom dubbele syncs
    if (this.isLoading) return;

    this.isLoading = true;
    this.notify();

    try {
      // 2. Fetch de data van je Express server
      const response = await fetch(`${this.API_BASE_URL}/portfolio-data`);
      
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      
      const data = await response.json();

      // 3. De engine aanroepen met de exact juiste namen uit je API-response
      // Let op: De namen hieronder (metadata, assetClasses, etc.) moeten matchen met je Express controller
      this.portfolio = calculatePortfolioSnapshot(
        data.metadata || [], 
        data.assetClasses || [], 
        data.sectors || [],
        data.industries || [],
        data.currencies || [],
        data.regions || [],
        data.countries || [],
        data.markets || [],
        data.assets || [],
        new Date().toISOString().split('T')[0]
      );

      console.log("🚀 FinDash: Engine gesynced met MySQL Database");
    } catch (error) {
      console.error("❌ SQL Sync mislukt:", error);
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public getPortfolio(): Portfolio | null {
    return this.portfolio;
  }

  public getLoadingStatus(): boolean {
    return this.isLoading;
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public subscribe(l: () => void) {
    this.listeners.push(l);
    return () => { 
      this.listeners = this.listeners.filter(i => i !== l); 
    };
  }
}

export const portfolioStore = new PortfolioStore();

/**
 * Hook voor je React Dashboard
 */
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(() => portfolioStore.getPortfolio());
  const [loading, setLoading] = useState<boolean>(() => portfolioStore.getLoadingStatus());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      const data = portfolioStore.getPortfolio();
      // We maken een ondiepe kopie om React te dwingen te her-renderen
      setPortfolio(data ? { ...data } : null);
      setLoading(portfolioStore.getLoadingStatus());
    });
    
    // Initial fetch als er nog geen data is
    if (!portfolioStore.getPortfolio() && !portfolioStore.getLoadingStatus()) {
      portfolioStore.syncWithDatabase();
    }
    
    return unsubscribe;
  }, []);

  return { 
    portfolio,
    loading,
    refresh: () => portfolioStore.syncWithDatabase()
  };
}