import { useState, useEffect } from "react";
// DE IMPORT VAN MOCKDATA IS VERWIJDERD
import { Portfolio, AssetClass, Holding } from "../types/dashboard";

// Een minimaal start-portfolio zodat de app niet crasht terwijl hij laadt
const INITIAL_PORTFOLIO: Portfolio = {
  totalValue: 0,
  ytdReturn: 0,
  assetClasses: [],
  performanceHistory: [],
  riskMetrics: { beta: 0, volatility: 0, maxDrawdown: 0 }
};

class PortfolioStore {
  private portfolio: Portfolio = INITIAL_PORTFOLIO;
  private listeners: (() => void)[] = [];

  constructor() {
    // We laden de data zodra de store wordt aangemaakt
    this.fetchLivePrices();
  }

  getPortfolio(): Portfolio {
    return this.portfolio;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // DE KERN: Deze functie haalt de data op van je Yahoo Finance backend
  async fetchLivePrices() {
    try {
      // 1. Haal eerst je opgeslagen portfolio-structuur op (tickers die je wilt volgen)
      const portResponse = await fetch('http://localhost:5000/api/portfolio');
      if (!portResponse.ok) throw new Error("Could not fetch portfolio structure");
      const currentPortfolio = await portResponse.json();

      // 2. Verzamel alle tickers voor Yahoo Finance
      const tickers = new Set<string>();
      currentPortfolio.assetClasses?.forEach((ac: any) => {
        ac.holdings?.forEach((h: any) => {
          if (h.ticker) tickers.add(h.ticker);
        });
      });

      if (tickers.size === 0) {
        this.portfolio = currentPortfolio;
        this.notify();
        return;
      }

      // 3. Haal de LIVE prijzen op bij je Yahoo Finance endpoint
      const quoteResponse = await fetch(`http://localhost:5000/api/quotes?symbols=${Array.from(tickers).join(',')}`);
      if (!quoteResponse.ok) throw new Error("Failed to fetch live quotes");
      const quotes = await quoteResponse.json();

      // 4. Update de prijzen in de holdings
      currentPortfolio.assetClasses?.forEach((ac: any) => {
        ac.holdings?.forEach((h: any) => {
          const quote = quotes.find((q: any) => q.symbol === h.ticker);
          if (quote) {
            h.price = quote.regularMarketPrice;
            h.value = (h.quantity || 0) * h.price;
            h.return_ytd = quote.regularMarketChangePercent;
          }
        });
      });

      this.portfolio = currentPortfolio;
      this.calculateMetrics(); // Bereken totalen op basis van live prijzen
      this.notify();
    } catch (error) {
      console.error("Failed to fetch live prices:", error);
    }
  }

  public calculateMetrics() {
    let totalValue = 0;
    this.portfolio.assetClasses?.forEach(ac => {
      let acValue = 0;
      ac.holdings?.forEach(h => { acValue += (h.value || 0); });
      ac.current_value = acValue;
      totalValue += acValue;
    });
    this.portfolio.totalValue = totalValue;
    this.portfolio.assetClasses?.forEach(ac => {
      ac.allocation_percent = totalValue > 0 ? (ac.current_value! / totalValue) * 100 : 0;
    });
  }
}

export const portfolioStore = new PortfolioStore();

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(portfolioStore.getPortfolio());

  useEffect(() => {
    return portfolioStore.subscribe(() => {
      setPortfolio({ ...portfolioStore.getPortfolio() });
    });
  }, []);

  return {
    portfolio,
    fetchLivePrices: () => portfolioStore.fetchLivePrices()
  };
}