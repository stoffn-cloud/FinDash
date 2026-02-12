import { create } from 'zustand';
import { Market } from '@/types';

// We breiden het type uit met de Prisma count-informatie
export type MarketWithCount = Market & {
  _count?: {
    assets: number;
  };
};

interface MarketsEntitiesState {
  markets: MarketWithCount[];
  isLoading: boolean;
  error: string | null;
  fetchMarkets: () => Promise<void>;
}

export const useMarketsEntitiesStore = create<MarketsEntitiesState>((set) => ({
  markets: [],
  isLoading: false,
  error: null,

  fetchMarkets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/markets/entities');
      
      if (!response.ok) {
        throw new Error(`Marktgegevens laden mislukt: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        markets: data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ Markets Entities Store Error:", error);
      set({ 
        error: error.message || "Kon markten niet laden", 
        isLoading: false 
      });
    }
  },
}));