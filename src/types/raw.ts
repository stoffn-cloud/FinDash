import { z } from "zod";

// Helper om MySQL TINYINT (0/1) naar Boolean te vertalen
const mysqlBoolean = z.number().transform((val) => val === 1);

// --- ASSETS
export const AssetSchema = z.object({
  ticker_id: z.number(),
  ticker: z.string(),
  full_name: z.string(),
  ISIN: z.string(), // SQL: NOT NULL
  markets_id: z.number(),
  asset_classes_id: z.number(),
  currencies_id: z.number(),
  asset_industries_id: z.number(),
  countries_id: z.number(),
});
export type Asset = z.infer<typeof AssetSchema>;

// --- ASSET_CLASSES
export const AssetClassSchema = z.object({
  asset_classes_id: z.number(),
  asset_class: z.string(),
  description: z.string(), // SQL: NOT NULL
});
export type AssetClass = z.infer<typeof AssetClassSchema>;

// --- SECTORS & INDUSTRIES
export const AssetSectorSchema = z.object({
  asset_sectors_id: z.number(),
  GICS_name: z.string(),
  description: z.string(),
});
export type AssetSector = z.infer<typeof AssetSectorSchema>;

export const AssetIndustrySchema = z.object({
  asset_industries_id: z.number(),
  asset_sectors_id: z.number(),
  description: z.string(),
});
export type AssetIndustry = z.infer<typeof AssetIndustrySchema>;

// --- GEOGRAPHY & MARKETS
export const CountrySchema = z.object({
  countries_id: z.number(),
  regions_id: z.number(),
  ISO_code: z.string(),
  full_name: z.string(),
});
export type Country = z.infer<typeof CountrySchema>;

export const RegionSchema = z.object({
  regions_id: z.number(),
  region_code: z.string(),
  description: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;

export const MarketSchema = z.object({
  markets_id: z.number(),
  markets_abbreviation: z.string(),
  full_name: z.string(),
});
export type Market = z.infer<typeof MarketSchema>;

export const CurrencySchema = z.object({
  currencies_id: z.number(),
  ISO_code: z.string(),
  full_name: z.string(),
});
export type Currency = z.infer<typeof CurrencySchema>;

// --- DATE DIMENSION (Nieuw: day_of_week toegevoegd)
export const DateDimSchema = z.object({
  date_id: z.string(), // DATE type komt vaak als string binnen
  year: z.number(),
  quarter: z.number(),
  quarter_abbreviation: z.string(),
  month: z.number(),
  month_name: z.string(),
  day: z.number(),
  day_name: z.string(),
  day_of_week: z.number(),
  is_weekend: mysqlBoolean,
  is_quarter_end: mysqlBoolean,
  is_year_end: mysqlBoolean,
});
export type DateDim = z.infer<typeof DateDimSchema>;

// --- HISTORY TABLES (Let op de underscores)
export const OHLCVHistorySchema = z.object({
  ticker_id: z.number(),
  date_id: z.string(),
  open_price: z.number(),
  high_price: z.number(),
  low_price: z.number(),
  close_price: z.number(),
  Volume: z.number().nullable(),
});
export type OHLCVHistory = z.infer<typeof OHLCVHistorySchema>;

export const PerformanceHistorySchema = z.object({
  ticker_id: z.number(),
  date_id: z.string(),
  return_pct: z.number(),
});
export type PerformanceHistory = z.infer<typeof PerformanceHistorySchema>;

// --- MARKET CALENDAR
export const MarketCalendarSchema = z.object({
  markets_id: z.number(),
  date: z.string(),
  is_open: mysqlBoolean.nullable(),
  market_status: z.string(),
  reason: z.string(),
});
export type MarketCalendar = z.infer<typeof MarketCalendarSchema>;