import { create } from 'zustand';
import { Asset } from '@/types';

// Omdat de API 'include' gebruikt, maken we een specifiek type voor deze response
// Dit voorkomt de gevreesde type-errors waar je naar vroeg.
export type AssetWithRelations = Asset & {
  countries?: any;
  asset_classes?: any;
  markets?: any;
  asset_industries?: {
    asset_sectors: any;
  };
};

interface AssetsState {
  assets: AssetWithRelations[];
  isLoading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set) => ({
  assets: [],
  isLoading: false,
  error: null,

  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/assets');
      
      if (!response.ok) {
        throw new Error(`Assets ophalen mislukt: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        assets: data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ Assets Store Error:", error);
      set({ 
        error: error.message || "Kon assets niet laden", 
        isLoading: false 
      });
    }
  },
}));