import { useState, useEffect } from "react";
import { mockPortfolio } from "./mockData";
import { Portfolio, AssetClass, Holding } from "../types/dashboard";

class PortfolioStore {
  private portfolio: Portfolio = JSON.parse(JSON.stringify(mockPortfolio));
  private listeners: (() => void)[] = [];

  constructor() {
    // Initial calculation to set quantities if missing
    this.initializeQuantities();
  }

  private initializeQuantities() {
    this.portfolio.assetClasses?.forEach(ac => {
      ac.holdings?.forEach(h => {
        // Mock a price for initial quantity if not present.
        // We derive quantity from the mock value using a reasonable base price.
        if (!(h as any).quantity) {
          let basePrice = 150; // Default base price for stocks
          if (h.ticker === 'GOLD') basePrice = 2000;
          if (h.ticker === 'USD' || h.ticker === 'EUR' || h.ticker === 'GBP' || h.ticker === 'JPY') basePrice = 1;

          (h as any).quantity = Math.round((h.value / basePrice) * 100) / 100;
          (h as any).price = basePrice;
          // Store a derived YTD start value to keep returns consistent with live prices
          (h as any).ytdStartValue = h.value / (1 + (h.return_ytd || 0) / 100);
        }
      });
    });
  }

  getPortfolio(): Portfolio {
    return this.portfolio;
  }

  setPortfolio(portfolio: Portfolio) {
    this.portfolio = portfolio;
    this.notify();
  }

  updateHoldings(assetClassId: string, holdings: Holding[]) {
    if (!this.portfolio.assetClasses) return;
    const acIndex = this.portfolio.assetClasses.findIndex(ac => ac.id === assetClassId);
    if (acIndex !== -1) {
      this.portfolio.assetClasses[acIndex].holdings = holdings;
      this.calculateMetrics();
      this.notify();
    }
  }

  public calculateMetrics() {
    let totalValue = 0;
    let totalYtdReturnWeighted = 0;

    this.portfolio.assetClasses?.forEach(ac => {
      let acValue = 0;
      let acYtdReturnWeighted = 0;

      ac.holdings?.forEach(h => {
        acValue += h.value;
        acYtdReturnWeighted += (h.return_ytd || 0) * h.value;
      });

      ac.current_value = Math.round(acValue * 100) / 100;
      ac.ytd_return = acValue > 0 ? Math.round((acYtdReturnWeighted / acValue) * 100) / 100 : 0;
      totalValue += acValue;
      totalYtdReturnWeighted += acYtdReturnWeighted;
    });

    this.portfolio.totalValue = Math.round(totalValue * 100) / 100;
    this.portfolio.ytdReturn = totalValue > 0 ? Math.round((totalYtdReturnWeighted / totalValue) * 100) / 100 : 0;

    this.portfolio.assetClasses?.forEach(ac => {
      ac.allocation_percent = totalValue > 0 ? Math.round(((ac.current_value / totalValue) * 100) * 100) / 100 : 0;
    });
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

  async fetchLivePrices() {
    const tickers = new Set<string>();
    this.portfolio.assetClasses?.forEach(ac => {
      ac.holdings?.forEach(h => {
        if (h.ticker && h.ticker !== 'USD' && h.ticker !== 'EUR') {
          tickers.add(h.ticker);
        }
      });
    });

    if (tickers.size === 0) return;

    try {
      const response = await fetch(`/api/quotes?symbols=${Array.from(tickers).join(',')}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const quotes = await response.json();

      this.portfolio.assetClasses?.forEach(ac => {
        ac.holdings?.forEach(h => {
          const quote = quotes.find((q: any) => q.symbol === h.ticker);
          if (quote) {
            if (!(h as any).quantity) {
               (h as any).quantity = 100; // Default
            }
            h.value = (h as any).quantity * quote.regularMarketPrice;

            // Calculate live YTD return based on derived start value if available
            if ((h as any).ytdStartValue) {
              h.return_ytd = Math.round(((h.value / (h as any).ytdStartValue) - 1) * 100 * 100) / 100;
            } else {
              h.return_ytd = quote.regularMarketChangePercent;
            }

            (h as any).price = quote.regularMarketPrice;
          }
        });
      });

      this.calculateMetrics();
      this.notify();
    } catch (error) {
      console.error("Failed to fetch live prices:", error);
    }
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
    fetchLivePrices: () => portfolioStore.fetchLivePrices(),
    updateHoldings: (id: string, holdings: any[]) => portfolioStore.updateHoldings(id, holdings)
  };
}
