import { create } from 'zustand';
import { OHLCVHistory } from '@/types';

// We breiden het type uit omdat de API ook ticker-info 'include'
export type OHLCVWithAsset = OHLCVHistory & {
  assets: {
    ticker: string;
    full_name: string;
  };
};

interface HistoryState {
  ohlcvData: OHLCVWithAsset[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  ohlcvData: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/history/ohlcv'); // Pas pad aan indien nodig
      
      if (!response.ok) {
        throw new Error(`Historische data laden mislukt: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        ohlcvData: data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ History Store Error:", error);
      set({ 
        error: error.message || "Kon prijsgeschiedenis niet laden", 
        isLoading: false 
      });
    }
  },
}));