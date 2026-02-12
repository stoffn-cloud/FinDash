import { create } from 'zustand';

// We definiëren de interface op basis van de 'flattenedHoldings' van je API
export interface FlattenedHolding {
  ticker: string;
  full_name: string;
  ISIN: string;
  market: string | undefined;
  country: string | undefined;
  sector: string | undefined;
}

interface HoldingsState {
  holdings: FlattenedHolding[];
  isLoading: boolean;
  error: string | null;
  
  // Acties
  fetchHoldings: () => Promise<void>;
  addAsset: (assetData: any) => Promise<boolean>;
}

export const useHoldingsStore = create<HoldingsState>((set, get) => ({
  holdings: [],
  isLoading: false,
  error: null,

  fetchHoldings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/holdings');
      if (!response.ok) throw new Error('Kon holdings niet ophalen');
      
      const data = await response.json();
      set({ holdings: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addAsset: async (assetData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData),
      });

      if (!response.ok) throw new Error('Toevoegen asset mislukt');

      // Refresh de lijst na succesvolle toevoeging
      await get().fetchHoldings();
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));