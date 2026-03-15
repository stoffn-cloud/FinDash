"use client";

import { create } from 'zustand';
import { calculatePortfolioSnapshot } from '@/logic/engineOrchestrator';
import { DEFAULT_HOLDINGS } from '@/data/constants/defaultHolding';
import { Portfolio, DefaultHolding } from '@/types';

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
    // Optioneel: herbereken portfolio direct als de lock wijzigt
  },

  updatePortfolio: (data) => {
    if (!data) return;

    try {
      const { isDemoLocked } = get();

      // 1. Data extractie & Fallbacks
      // We zorgen dat we altijd arrays doorgeven aan de Orchestrator
      const assets = data.dbAssets || data.assets || [];
      const classes = data.dbAssetClasses || data.classes || [];
      const sectors = data.dbSectors || data.sectors || [];
      const industries = data.dbIndustries || data.industries || [];
      const currencies = data.dbCurrencies || data.currencies || [];
      const regions = data.dbRegions || data.regions || [];
      const countries = data.dbCountries || data.countries || [];
      const markets = data.dbMarkets || data.markets || [];
      const prices = data.prices || [];
      
      // 2. Holdings bepalen
      // De orchestrator zal deze 'DefaultHolding' omzetten naar de correcte 'RawHolding' (snake_case)
      const userHoldingsFromDb = data.userHoldings || [];
      const activeHoldings = (isDemoLocked || userHoldingsFromDb.length === 0) 
        ? (DEFAULT_HOLDINGS as unknown as DefaultHolding[]) 
        : userHoldingsFromDb;

      // 3. Bereken de snapshot via de Orchestrator
      // De Orchestrator voert nu de Zod-wasstraat uit op 'activeHoldings' en 'prices'
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

      // 4. Staat updaten
      // Snapshot voldoet nu aan de verrijkte interfaces (incl. market_value, cost_basis)
      set({ 
        portfolio: snapshot, 
        isInitialised: true 
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`🏪 Store: Portfolio "${snapshot.name}" updated. Value: ${snapshot.totalValue}`);
      }
    } catch (error) {
      console.error("❌ Store Update Error:", error);
    }
  }
}));