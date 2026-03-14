import { create } from 'zustand';
import { calculatePortfolioSnapshot } from '@/logic/engineOrchestrator';
import { DEFAULT_HOLDINGS } from '@/data/constants/defaultHolding';
import { Portfolio, DefaultHolding, EnrichedAsset } from '@/types';

interface PortfolioState {
  portfolio: Portfolio | null;
  isInitialised: boolean;
  isDemoLocked: boolean; 
  setDemoLocked: (locked: boolean) => void;
  updatePortfolio: (data: any) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: null,
  isInitialised: false,
  isDemoLocked: false,

  setDemoLocked: (locked) => {
    set({ isDemoLocked: locked });
  },

  updatePortfolio: (data) => {
    try {
      const { isDemoLocked } = get();

      // 1. Data extractie
      const assets = data.dbAssets || data.assets || [];
      const classes = data.dbAssetClasses || data.classes || [];
      const sectors = data.dbSectors || data.sectors || [];
      const industries = data.dbIndustries || data.industries || [];
      const currencies = data.dbCurrencies || data.currencies || [];
      const regions = data.dbRegions || data.regions || [];
      const countries = data.dbCountries || data.countries || [];
      const markets = data.dbMarkets || data.markets || [];
      const prices = data.prices || []; // Zorg dat dit een array is
      
      // 2. Holdings bepalen
      const userHoldingsFromDb = data.userHoldings || [];
      const activeHoldings = (isDemoLocked || userHoldingsFromDb.length === 0) 
        ? (DEFAULT_HOLDINGS as unknown as DefaultHolding[]) 
        : userHoldingsFromDb;

      // 3. Bereken de snapshot via de Orchestrator
      // Deze snapshot bevat nu de snake_case financials (market_value, etc.)
      const snapshot = calculatePortfolioSnapshot(
        assets,
        classes,
        sectors,
        industries,
        currencies,
        regions,
        countries,
        markets,
        activeHoldings,
        prices
      );

      // 4. De "Brug" naar de UI:
      // We zorgen dat het portfolio object exact de vorm heeft die de UI verwacht.
      // We overschrijven enrichedAssets alleen als de snapshot die niet al heeft.
      const finalPortfolio: Portfolio = {
        ...snapshot,
        enrichedAssets: (snapshot as any).enrichedAssets || assets, 
      };

      set({ 
        portfolio: finalPortfolio, 
        isInitialised: true 
      });

      console.log("🏪 Store Success: Portfolio updated with", finalPortfolio.holdings.length, "holdings");
    } catch (error) {
      console.error("❌ Store Update Error:", error);
    }
  }
}));