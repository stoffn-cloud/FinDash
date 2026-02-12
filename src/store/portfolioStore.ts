import { useState, useEffect } from "react";
import { calculatePortfolioSnapshot } from "@/logic/portfolioEngine";
import { Portfolio } from "@/types";

class PortfolioStore {
  private portfolio: Portfolio | null = null;
  private listeners: (() => void)[] = [];
  private isLoading: boolean = false;
  // We gebruiken het relatieve pad voor Next.js API routes
  private API_BASE_URL = "/api";

  constructor() {}

  public async syncWithDatabase() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.notify();

    try {
      console.log("🔄 FinDash: Gegevens ophalen uit SQL...");

      // We halen data op uit de mappen die je daadwerkelijk hebt aangemaakt
      const [assetsRes, marketsRes, holdingsRes] = await Promise.all([
        fetch(`${this.API_BASE_URL}/portfolio/assets`),
        fetch(`${this.API_BASE_URL}/portfolio/markets/status`),
        fetch(`${this.API_BASE_URL}/holdings`)
      ]);

      // Debugging logs om te zien welke route faalt
      if (!assetsRes.ok) console.warn("Assets route niet bereikbaar (404/500)");

      const assetsData = assetsRes.ok ? await assetsRes.json() : [];
      const marketsData = marketsRes.ok ? await marketsRes.json() : [];
      const holdingsData = holdingsRes.ok ? await holdingsRes.ok && holdingsRes.status !== 405 ? await holdingsRes.json() : [] : [];

      // Engine aanroepen om alle SQL data te verwerken naar een Dashboard-snapshot
      this.portfolio = calculatePortfolioSnapshot(
        assetsData,       // Data uit portfolio_data tabel
        [], 
        [], 
        [], 
        [], 
        [], 
        [], // Optionele relationele tabellen
        marketsData,      // Markt status/kalender
        holdingsData,     // Specifieke instrumenten
        new Date().toISOString().split('T')[0]
      );

      console.log("🚀 FinDash: Dashboard succesvol geladen");
    } catch (error) {
      console.error("❌ SQL Sync mislukt in Store:", error);
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

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(() => portfolioStore.getPortfolio());
  const [loading, setLoading] = useState<boolean>(() => portfolioStore.getLoadingStatus());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setPortfolio(portfolioStore.getPortfolio() ? { ...portfolioStore.getPortfolio()! } : null);
      setLoading(portfolioStore.getLoadingStatus());
    });
    
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