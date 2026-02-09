import { z } from "zod";

// 1. Database Metadata Types (De "Lookup" tabellen) ---

// --- ASSET_CLASSES
export const AssetClassSchema = z.object({
  asset_classes_id: z.number(),
  asset_class: z.string(),
  description: z.string().nullable(),
});
export type AssetClass = z.infer<typeof AssetClassSchema>;


// --- ASSET_SECTORS
export const AssetSectorSchema = z.object({
  asset_sectors_id: z.number(),
  GICS_name: z.string(),
  description: z.string().nullable(),
});
export type AssetSector = z.infer<typeof AssetSectorSchema>;


// --- ASSET_INDUSTRIES
export const AssetIndustrySchema = z.object({
  asset_industries_id: z.number(),
  asset_sectors_id: z.number(),
  description: z.string(),
});
export type AssetIndustry = z.infer<typeof AssetIndustrySchema>;


// --- CURENCIES
export const CurrencySchema = z.object({
  currencies_id: z.number(),
  ISO_code: z.string().length(3),
  full_name: z.string(),
});
export type Currency = z.infer<typeof CurrencySchema>;


// --- REGIONS
export const RegionSchema = z.object({
  regions_id: z.number(),
  description: z.string(),
  region_code: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;


// --- COUNTRIES
export const CountrySchema = z.object({
  countries_id: z.number(),
  regions_id: z.number(),
  full_name: z.string(),
  ISO_code: z.string().length(3), 
});
export type Country = z.infer<typeof CountrySchema>;


// --- MARKETS
export const MarketSchema = z.object({
  markets_id: z.number(),
  full_name: z.string(),
  markets_abbreviation: z.string(),
});
export type Market = z.infer<typeof MarketSchema>;


// --- DATE DIMENSION
export const DateDimSchema = z.object({
  date_id: z.string(),
  year: z.number(),
  quarter: z.number(),
  quarter_abbreviation: z.string(),
  month: z.number(),
  month_name: z.string(),
  day: z.number(),
  day_name: z.string(),
  is_weekend: z.boolean(),
  is_quarter_end: z.boolean(),
  is_year_end: z.boolean(),
});
export type DateDim = z.infer<typeof DateDimSchema>;


// --- MARKET CALENDAR
export const MarketStatusSchema = z.object({
  markets_id: z.number(),
  date: z.string(),
  is_open: z.boolean(),
  market_status: z.enum(['OPEN', 'CLOSED']),
  reason: z.string().nullable(),
});
export type MarketStatus = z.infer<typeof MarketStatusSchema>;


// --- ASSETS
export const AssetSchema = z.object({
  ticker_id: z.number(),
  ticker: z.string(),
  full_name: z.string(),
  ISIN: z.string().nullable(),
  markets_id: z.number(),
  asset_classes_id: z.number(),
  currencies_id: z.number(),
  asset_industries_id: z.number(),
  countries_id: z.number(),
});
export type Asset = z.infer<typeof AssetSchema>;


// --- RAW HOLDINGS
export interface RawHolding {
  ticker: string;
  quantity: number;
  purchaseDate: string;
  purchaePrice: number;
}

// --- ENRICHED HOLDINGS
export interface EnrichedHolding extends PortfolioItem {
  quantity: number;
  purchaseDate: string;
  purchasePrice: number; // Overgenomen uit Raw
  currentPrice: number;  // Uit de database/API
  costBasis: number;     // Berekend: qty * purchasePrice
  marketValue: number;   // Berekend: qty * currentPrice
}


// 2. De Master View
export const PortfolioItemSchema = z.object({
  ticker: z.string(),
  full_name: z.string(),
  isin: z.string().nullable(),
  asset_class: z.string(),
  sector: z.string(),
  industry: z.string(),
  market: z.string(),
  currency: z.string(),
  country: z.string(),
  region: z.string(),
});

export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;