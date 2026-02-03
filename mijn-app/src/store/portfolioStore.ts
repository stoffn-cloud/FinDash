import { useState, useEffect } from "react";
import { mockPortfolio } from "../data/constants/mockPortfolio";
import { Portfolio } from "../types/schemas"; // Oplossing voor error 2304
import { calculatePortfolioTotals } from "../logic/portfolioEngine";

class PortfolioStore {
  // Oplossing voor error 2552: Zorg dat de naamgeving exact klopt
  private portfolio: Portfolio; 
  private listeners: (() => void)[] = [];

  constructor() {
    // We voeren de berekening uit bij het opstarten
    this.portfolio = calculatePortfolioTotals(mockPortfolio);
  }

  public getPortfolio(): Portfolio {
    return this.portfolio;
  }

  public updateData(newData: Portfolio) {
    this.portfolio = calculatePortfolioTotals(newData);
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public subscribe(l: () => void) {
    this.listeners.push(l);
    return () => { this.listeners = this.listeners.filter(i => i !== l); };
  }
}

// We maken de instantie van de klasse aan
export const portfolioStore = new PortfolioStore();

// De Hook die je in je componenten gebruikt
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>(portfolioStore.getPortfolio());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setPortfolio({ ...portfolioStore.getPortfolio() });
    });
    return unsubscribe;
  }, []);

  return { portfolio };
}