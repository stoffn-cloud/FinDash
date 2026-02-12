import { create } from 'zustand';
import { Region, Country } from '@/types';

// We definiëren de geneste structuur die uit de API komt
export type RegionWithCountries = Region & {
  countries: Country[];
};

interface GeographyState {
  geography: RegionWithCountries[];
  isLoading: boolean;
  error: string | null;
  fetchGeography: () => Promise<void>;
}

export const useGeographyStore = create<GeographyState>((set) => ({
  geography: [],
  isLoading: false,
  error: null,

  fetchGeography: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/geography'); // Check of je route op dit pad staat
      
      if (!response.ok) {
        throw new Error(`Geografie laden mislukt: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        geography: data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ Geography Store Error:", error);
      set({ 
        error: error.message || "Kon geografische data niet laden", 
        isLoading: false 
      });
    }
  },
}));