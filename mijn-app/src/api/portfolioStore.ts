import { useState, useEffect } from "react";
// Zorg dat je src/data/defaultPortfolio.ts eerst aanmaakt!
import { DEFAULT_PORTFOLIO_STRUCTURE } from "../data/constants/defaultPortfolio";
import { Portfolio } from "../types/dashboard";

class PortfolioStore {
  private portfolio: Portfolio = DEFAULT_PORTFOLIO_STRUCTURE;
  private listeners: (() => void)[] = [];

  constructor() {
    this.initializePortfolio();
  }

  private async initializePortfolio() {
    try {
      const response = await fetch('http://localhost:5000/api/portfolio');
      if (response.ok) {
        const userData = await response.json();
        if (userData && userData.assetClasses?.length > 0) {
          this.portfolio = userData;
        }
      }
    } catch (error) {
      console.warn("Using Default Data (Backend unreachable)");
    } finally {
      await this.fetchLivePrices();
    }
  }

  public getPortfolio(): Portfolio {
    return this.portfolio;
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  async fetchLivePrices() {
    try {
      const tickers = new Set<string>();
      this.portfolio.assetClasses?.forEach((ac) => {
        ac.holdings?.forEach((h) => {
          if (h.ticker) tickers.add(h.ticker);
        });
      });

      if (tickers.size === 0) return this.notify();

      const quoteResponse = await fetch(`http://localhost:5000/api/quotes?symbols=${Array.from(tickers).join(',')}`);
      if (!quoteResponse.ok) throw new Error("API Offline");
      const quotes = await quoteResponse.json();

      this.portfolio.assetClasses?.forEach((ac) => {
        ac.holdings?.forEach((h) => {
          const quote = quotes.find((q: any) => q.symbol === h.ticker);
          if (quote) {
            h.price = quote.regularMarketPrice;
            // FIX: Gebruik || 0 om 'undefined' fouten te voorkomen
            h.value = (h.quantity || 0) * (h.price || 0);
            h.return_ytd = quote.regularMarketChangePercent;
          }
        });
      });

      this.calculateMetrics();
      this.notify();
    } catch (error) {
      console.error("Live update failed", error);
    }
  }

  public calculateMetrics() {
    let totalValue = 0;
    this.portfolio.assetClasses?.forEach(ac => {
      let acValue = 0;
      ac.holdings?.forEach(h => { 
        acValue += (h.value || 0); 
      });
      ac.current_value = acValue;
      totalValue += acValue;
    });
    this.portfolio.totalValue = totalValue;
    
    this.portfolio.assetClasses?.forEach(ac => {
      ac.allocation_percent = totalValue > 0 ? (ac.current_value / totalValue) * 100 : 0;
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