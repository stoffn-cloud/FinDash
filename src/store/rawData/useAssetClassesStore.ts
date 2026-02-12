import { create } from 'zustand';
import { AssetClass } from '@/types';

interface AssetClassesState {
  assetClasses: AssetClass[];
  isLoading: boolean;
  error: string | null;
  
  // Actie om de ruwe data uit de API te trekken
  fetchAssetClasses: () => Promise<void>;
}

export const useAssetClassesStore = create<AssetClassesState>((set) => ({
  assetClasses: [],
  isLoading: false,
  error: null,

  fetchAssetClasses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/asset-classes');
      
      if (!response.ok) {
        throw new Error(`Fout bij laden: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        assetClasses: data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || "Onbekende fout in AssetClassesStore", 
        isLoading: false 
      });
    }
  },
}));