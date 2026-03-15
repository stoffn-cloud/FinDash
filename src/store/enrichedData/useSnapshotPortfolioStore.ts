"use client";

import { create } from 'zustand';
import { calculatePortfolioSnapshot } from '@/logic/engineOrchestrator';
import { Portfolio } from '@/types';

interface PortfolioState {
  portfolio: Portfolio | null;
  isInitialised: boolean;
  // We houden deze types simpel en gefocust op de werkelijke data
  updatePortfolio: (data: any) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  isInitialised: false,

  updatePortfolio: (data) => {
    if (!data) return;

    try {
      // 1. Data extractie & Fallbacks
      // We mappen de inkomende data direct naar de variabelen voor de Orchestrator
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
      // We vertrouwen nu 100% op de database input
      const userHoldings = data.userHoldings || [];

      // 3. Bereken de snapshot via de Orchestrator
      // De Orchestrator handelt nu de validatie af
      const snapshot = calculatePortfolioSnapshot(
        assets,
        classes,
        sectors,
        industries,
        currencies,
        regions,
        countries,
        markets,
        userHoldings, // Direct doorgeven
        prices
      );

      // 4. Staat updaten
      set({ 
        portfolio: snapshot, 
        isInitialised: true 
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`🏪 Store: Portfolio updated with live DB data. Total Value: ${snapshot.totalValue}`);
      }
    } catch (error) {
      console.error("❌ Store Update Error:", error);
    }
  }
}));