// src/types/index.ts

// 1. Export alle ruwe types uit Zod (Asset, AssetClass, etc.)
export * from './raw';

// 2. Export alle berekende types voor de Engine (Portfolio, EnrichedHolding, etc.)
export * from './enriched';

// 3. Handmatige types die (nog) nergens anders staan
// src/types/index.ts (of waar RawHolding staat)
export interface RawHolding {
  id: number;
  ticker_id: number;
  quantity: number;
  purchasePrice: number; // Aanpassen naar CamelCase
  purchaseDate: string | Date; // Aanpassen naar CamelCase
}