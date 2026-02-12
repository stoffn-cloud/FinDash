import { create } from 'zustand';
import { PerformanceHistory } from '@/types';

// Verrijkt type voor de join met assets
export type PerformanceWithAsset = PerformanceHistory & {
  assets: {
    ticker: string;
    full_name: string;
  };
};

interface PerformanceHistoryState {
  performanceData: PerformanceWithAsset[];
  isLoading: boolean;
  error: string | null;
  
  // Actie om de rendementen op te halen (met optionele limiet)
  fetchPerformance: (limit?: number) => Promise<void>;
}

export const useHistoryPerformanceStore = create<PerformanceHistoryState>((set) => ({
  performanceData: [],
  isLoading: false,
  error: null,

  fetchPerformance: async (limit = 100) => {
    set({ isLoading: true, error: null });
    try {
      // We geven de limiet mee als query parameter aan de API
      const response = await fetch(`/api/history/performance?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Performance data laden mislukt: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        performanceData: data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ Performance Store Error:", error);
      set({ 
        error: error.message || "Kon rendementen niet laden", 
        isLoading: false 
      });
    }
  },
}));