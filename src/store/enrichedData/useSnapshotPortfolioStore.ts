import { create } from 'zustand';
import { Portfolio } from '@/types';
import { calculatePortfolioSnapshot } from '@/logic/engineOrchestrator';
// Importeer hier je hardcoded data
import { DEFAULT_HOLDINGS } from '@/data/constants/defaultHolding'; 

interface PortfolioState {
  portfolio: Portfolio | null;
  isInitialised: boolean;
  
  // De actie heeft nu alleen nog de database data en prijzen nodig, 
  // want de holdings haalt hij zelf uit de constante.
  updatePortfolio: (
    assets: any[], 
    classes: any[], 
    sectors: any[], 
    industries: any[], 
    currencies: any[], 
    regions: any[], 
    countries: any[], 
    markets: any[], 
    prices: any[]
  ) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  isInitialised: false,

  updatePortfolio: (assets, classes, sectors, industries, currencies, regions, countries, markets, prices) => {
    try {
      // De Orchestrator krijgt de hardcoded DEFAULT_HOLDINGS als input
      const snapshot = calculatePortfolioSnapshot(
        assets, classes, sectors, industries, currencies, 
        regions, countries, markets, 
        DEFAULT_HOLDINGS, // <--- Hardcoded data
        prices
      );

      set({ portfolio: snapshot, isInitialised: true });
    } catch (error) {
      console.error("Fout bij updaten portfolio:", error);
    }
  }
}));