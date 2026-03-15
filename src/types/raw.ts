import { z } from "zod";

// --- HELPERS
/**
 * Vertaalt MySQL TINYINT (0/1) naar een echte Boolean.
 */
const mysqlBoolean = z.preprocess(
  (val) => (typeof val === "number" ? val === 1 : val),
  z.boolean()
);

/**
 * Maakt van elke input (string, null, etc.) een bruikbaar nummer.
 * Cruciaal voor prijzen die als "271.86" uit de DB komen.
 */
const robustNumber = z.coerce.number().default(0);

// --- HOLDINGS
/**
 * Normaliseert inkomende holdings van CamelCase (API/Legacy) naar snake_case (DB/Engine).
 * Zorgt ook dat datums beperkt blijven tot de dag (YYYY-MM-DD).
 */
export const RawHoldingSchema = z.preprocess((obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Datum normalisatie: pak de eerste 10 karakters van de string
  const rawDate = obj.purchase_date ?? obj.purchaseDate;
  const formattedDate = typeof rawDate === 'string' ? rawDate.split('T')[0] : rawDate;

  return {
    ...obj,
    purchase_price: obj.purchase_price ?? obj.purchasePrice,
    purchase_date: formattedDate,
  };
}, z.object({
  id: z.number().optional(),
  ticker_id: robustNumber,
  quantity: robustNumber,
  purchase_price: robustNumber,
  purchase_date: z.string().default(() => new Date().toISOString().split('T')[0]),
}));

export type RawHolding = z.infer<typeof RawHoldingSchema>;

// --- ASSETS
export const AssetSchema = z.object({
  ticker_id: robustNumber,
  ticker: z.string(),
  full_name: z.string(),
  ISIN: z.string().default(""),
  markets_id: robustNumber,
  asset_classes_id: robustNumber,
  currencies_id: robustNumber,
  asset_industries_id: robustNumber,
  asset_sectors_id: robustNumber.optional(), 
  countries_id: robustNumber,
});
export type Asset = z.infer<typeof AssetSchema>;

// --- HISTORY TABLES (Cruciaal voor prijzen)
export const OHLCVHistorySchema = z.object({
  ticker_id: robustNumber,
  date_id: z.string().transform(val => val.split('T')[0]), // Altijd YYYY-MM-DD
  open_price: robustNumber.nullable(),
  high_price: robustNumber.nullable(),
  low_price: robustNumber.nullable(),
  close_price: robustNumber, // Mag nooit null zijn voor berekeningen
  Volume: robustNumber.nullable(),
});
export type OHLCVHistory = z.infer<typeof OHLCVHistorySchema>;

// --- OVERIGE ENTITEITEN
export const AssetClassSchema = z.object({
  asset_classes_id: robustNumber,
  asset_class: z.string(),
  description: z.string().default(""),
});
export type AssetClass = z.infer<typeof AssetClassSchema>;

export const AssetSectorSchema = z.object({
  asset_sectors_id: robustNumber,
  GICS_name: z.string(),
  description: z.string().default(""),
});
export type AssetSector = z.infer<typeof AssetSectorSchema>;

export const AssetIndustrySchema = z.object({
  asset_industries_id: robustNumber,
  asset_sectors_id: robustNumber,
  description: z.string(),
});
export type AssetIndustry = z.infer<typeof AssetIndustrySchema>;

export const CountrySchema = z.object({
  countries_id: robustNumber,
  regions_id: robustNumber,
  ISO_code: z.string(),
  full_name: z.string(),
});
export type Country = z.infer<typeof CountrySchema>;

export const RegionSchema = z.object({
  regions_id: robustNumber,
  region_code: z.string(),
  description: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;

export const MarketSchema = z.object({
  markets_id: robustNumber,
  markets_abbreviation: z.string(),
  full_name: z.string(),
});
export type Market = z.infer<typeof MarketSchema>;

export const CurrencySchema = z.object({
  currencies_id: robustNumber,
  ISO_code: z.string(),
  full_name: z.string(),
});
export type Currency = z.infer<typeof CurrencySchema>;