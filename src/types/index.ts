// src/types/index.ts

// 1. Export alle ruwe types uit Zod (Asset, AssetClass, etc.)
export * from './raw';

// 2. Export alle berekende types voor de Engine (Portfolio, EnrichedHolding, etc.)
export * from './enriched';

// 3. Handmatige types die (nog) nergens anders staan
export interface RawHolding {
  ticker_id: number;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}