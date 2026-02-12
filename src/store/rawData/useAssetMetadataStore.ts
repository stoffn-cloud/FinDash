import { create } from 'zustand';
import { AssetSector, Country, Market } from '@/types';

interface AssetMetadataState {
  sectors: AssetSector[];
  countries: Country[];
  markets: Market[];
  isLoading: boolean;
  error: string | null;
  
  // De actie die de gecombineerde metadata ophaalt
  fetchMetadata: () => Promise<void>;
}

export const useAssetMetadataStore = create<AssetMetadataState>((set) => ({
  sectors: [],
  countries: [],
  markets: [],
  isLoading: false,
  error: null,

  fetchMetadata: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/assets/metadata'); // Zorg dat dit pad klopt met je route.ts locatie
      
      if (!response.ok) {
        throw new Error(`Server fout: ${response.statusText}`);
      }

      const data = await response.json();

      // We vullen de drie lijsten tegelijkertijd
      set({ 
        sectors: data.sectors,
        countries: data.countries,
        markets: data.markets,
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ Metadata Store Error:", error);
      set({ 
        error: error.message || "Kon metadata niet laden", 
        isLoading: false 
      });
    }
  },
}));