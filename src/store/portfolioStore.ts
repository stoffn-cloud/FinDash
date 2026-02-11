import { useState, useEffect } from "react";
import { mockPortfolio } from "../data/constants/mockPortfolio";
import { Portfolio, Holding } from "../types/schemas"; 
import { buildPortfolioFromAssets } from "../logic/portfolioEngine";

class PortfolioStore {
  private portfolio: Portfolio;
  private listeners: (() => void)[] = [];
  private isLoading: boolean = false;

  private SHEET_ID = '1a_1ZHYG8pLbwX5zIwI5O-_Dt8KqjXEk1H2G_8dtBUNo';
  // Voeg hier de GIDs toe van je tabbladen
  private GIDS = ['0']; 
  private TARGET_DATE = "2026-02-03";

  constructor() {
    // Initiële bouw met mockData (prijzen zijn dan 0 of uit mock)
    this.portfolio = buildPortfolioFromAssets(mockPortfolio as any);
  }

  /**
   * Haalt alle data op uit Google Sheets en update de hele store
   */
  public async syncWithGoogleSheets() {
    this.isLoading = true;
    this.notify();

    try {
      const fetchPromises = this.GIDS.map(gid => 
        fetch(`https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/pub?gid=${gid}&single=true&output=csv`)
          .then(res => res.text())
      );

      const csvResults = await Promise.all(fetchPromises);
      const priceMap: Record<string, number> = {};

      csvResults.forEach(csvText => {
        const lines = csvText.split('\n').filter(Boolean);
        // We skippen de header (i=0)
        for (let i = 1; i < lines.length; i++) {
          const [date, ticker, price] = lines[i].split(',').map(item => item.trim());
          if (date === this.TARGET_DATE) {
            priceMap[ticker] = parseFloat(price);
          }
        }
      });

      // Update de holdings in de mockPortfolio met de nieuwe prijzen
      const updatedHoldings = (mockPortfolio as any).map((holding: any) => ({
        ...holding,
        // Zoek de prijs op in onze map, anders behoud huidige/0
        price: priceMap[holding.ticker] || holding.price || 0 
      }));

      // Herbereken het hele portfolio via de engine
      this.portfolio = buildPortfolioFromAssets(updatedHoldings);
      console.log("🚀 Portfolio gesynced met Google Sheets");
    } catch (error) {
      console.error("❌ Sync mislukt:", error);
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public getPortfolio(): Portfolio {
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
 * Verbeterde Hook
 */
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>(() => portfolioStore.getPortfolio());
  const [loading, setLoading] = useState<boolean>(() => portfolioStore.getLoadingStatus());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setPortfolio({ ...portfolioStore.getPortfolio() });
      setLoading(portfolioStore.getLoadingStatus());
    });
    
    // Start de sync automatisch bij laden van de app
    portfolioStore.syncWithGoogleSheets();
    
    return unsubscribe;
  }, []);

  return { 
    portfolio,
    loading,
    refresh: () => portfolioStore.syncWithGoogleSheets()
  };
}