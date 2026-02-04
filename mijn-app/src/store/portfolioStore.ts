import { useState, useEffect } from "react";
// mockPortfolio is nu je lijst met losse assets (Holding[])
import { mockPortfolio } from "../data/constants/mockPortfolio";
import { Portfolio, Holding } from "../types/schemas"; 
import { buildPortfolioFromAssets } from "../logic/portfolioEngine";

class PortfolioStore {

public async searchInSheet(sheetName: string, ticker: string) {
  try {
    // URL van je Google Sheet (gepubliceerd als CSV)
    // Tip: Je kunt de GID (Sheet ID) achter de URL plakken om de juiste tab te pakken
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/1a_1ZHYG8pLbwX5zIwI5O-_Dt8KqjXEk1H2G_8dtBUNo/edit?gid=0#gid=0`;
    
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    // Simpele CSV parser (of gebruik PapaParse)
    const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '')));
    const headers = rows[0];
    const tickerIndex = headers.findIndex(h => h.toLowerCase() === 'ticker');
    const priceIndex = headers.findIndex(h => h.toLowerCase() === 'price');

    const dataRow = rows.find(row => row[tickerIndex] === ticker);

    if (dataRow) {
      return {
        ticker: dataRow[tickerIndex],
        price: parseFloat(dataRow[priceIndex]),
        // Voeg hier meer velden toe die in je sheet staan
      };
    }
    return null;
  } catch (error) {
    console.error("Zoeken in sheet mislukt", error);
    return null;
  }
}

  private portfolio: Portfolio;
  private listeners: (() => void)[] = [];

  constructor() {
    // We bouwen het portfolio direct op uit de losse assets
    this.portfolio = buildPortfolioFromAssets(mockPortfolio as any);
  }

  // Methode om de huidige staat op te vragen
  public getPortfolio(): Portfolio {
    return this.portfolio;
  }

  // Gebruik deze als je handmatig een heel berekend object wilt pushen
  public updatePortfolio(newPortfolio: Portfolio) {
    this.portfolio = newPortfolio;
    this.notify();
  }

  // Gebruik deze als je de lijst met assets verandert (hét scenario voor jou)
  public updateAssets(newAssets: Holding[]) {
    this.portfolio = buildPortfolioFromAssets(newAssets);
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public subscribe(l: () => void) {
    this.listeners.push(l);
    // Cleanup functie om geheugenlekken te voorkomen
    return () => { 
      this.listeners = this.listeners.filter(i => i !== l); 
    };
  }
}

// Singleton instantie van de store
export const portfolioStore = new PortfolioStore();

/**
 * Hook voor gebruik in React componenten
 */
export function usePortfolio() {
  // Lazy initialization van de state
  const [portfolio, setPortfolio] = useState<Portfolio>(() => portfolioStore.getPortfolio());

  useEffect(() => {
    // Abonneer op veranderingen in de store
    const unsubscribe = portfolioStore.subscribe(() => {
      // We maken een ondiepe kopie om React te dwingen de UI te verversen
      setPortfolio({ ...portfolioStore.getPortfolio() });
    });
    
    return unsubscribe;
  }, []);

  return { 
    portfolio,
    // Handig: geef de update-functie direct door aan je componenten
    updateAssets: (assets: Holding[]) => portfolioStore.updateAssets(assets)
  };
}