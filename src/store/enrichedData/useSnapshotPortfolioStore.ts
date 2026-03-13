import { create } from 'zustand';
import { calculatePortfolioSnapshot } from '@/logic/engineOrchestrator';
import { DEFAULT_HOLDINGS } from '@/data/constants/defaultHolding';
import { Portfolio, DefaultHolding } from '@/types';

interface PortfolioState {
  portfolio: Portfolio | null;
  isInitialised: boolean;
  isDemoLocked: boolean; 
  setDemoLocked: (locked: boolean) => void;
  // We veranderen de input naar 'any' om flexibel te zijn met het object uit page.tsx
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

      // MAPPING: Zorg dat we de namen gebruiken die uit page.tsx komen
      // Page stuurt 'dbAssets', 'dbAssetClasses', etc.
      const assets = data.dbAssets || data.assets || [];
      const classes = data.dbAssetClasses || data.classes || [];
      const sectors = data.dbSectors || data.sectors || [];
      const industries = data.dbIndustries || data.industries || [];
      const currencies = data.dbCurrencies || data.currencies || [];
      const regions = data.dbRegions || data.regions || [];
      const countries = data.dbCountries || data.countries || [];
      const markets = data.dbMarkets || data.markets || [];
      const prices = data.prices || {};
      
      // Holdings bepalen
      const userHoldingsFromDb = data.userHoldings || [];
      const activeHoldings = (isDemoLocked || userHoldingsFromDb.length === 0) 
        ? DEFAULT_HOLDINGS 
        : userHoldingsFromDb;

      // Bereken de snapshot met de juiste variabelen
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

      // Verrijk het portfolio object zodat de Editor de assets kan vinden
      const enrichedPortfolio = {
        ...snapshot,
        enrichedAssets: assets, // De lijst waar de zoekbalk naar kijkt!
        holdings: activeHoldings // Zorg dat holdings ook in portfolio zitten
      };

      set({ 
        portfolio: enrichedPortfolio, 
        isInitialised: true 
      });

      console.log("🏪 Store Success: Assets in portfolio:", assets.length);
    } catch (error) {
      console.error("❌ Store Update Error:", error);
    }
  }
}));