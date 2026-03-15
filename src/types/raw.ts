import { z } from "zod";

/**
 * --- HELPERS ---
 */

/**
 * Vertaalt MySQL TINYINT (0/1) naar een echte Boolean.
 */
const mysqlBoolean = z.preprocess(
  (val) => (typeof val === "number" ? val === 1 : val),
  z.boolean()
);

/**
 * Maakt van elke input (string, null, etc.) een bruikbaar nummer.
 * Voorkomt NaN errors in de math engines.
 */
const robustNumber = z.coerce.number().default(0);

/**
 * Helper om datums te normaliseren naar YYYY-MM-DD.
 * Splitst op 'T' (ISO) of spatie (MySQL/SQL).
 */
const normalizeDate = (val: any): string | undefined => {
  if (!val) return undefined;
  const str = String(val);
  return str.split(/[ T]/)[0];
};

/**
 * --- SCHEMAS ---
 */

/**
 * RawHoldingSchema
 * Cruciaal voor het vertalen van de database (of API) naar de Engine.
 * Handelt zowel snake_case als camelCase af.
 */
export const RawHoldingSchema = z.preprocess((obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const rawDate = obj.purchase_date ?? obj.purchaseDate;
  const formattedDate = normalizeDate(rawDate);

  return {
    ...obj,
    purchase_price: obj.purchase_price ?? obj.purchasePrice,
    // We overschrijven de datum alleen als we een geldige waarde hebben gevonden
    ...(formattedDate && { purchase_date: formattedDate }),
  };
}, z.object({
  id: z.number().optional(),
  ticker_id: robustNumber,
  quantity: robustNumber,
  purchase_price: robustNumber,
  // We zetten de default op een datum in het verleden (begin 2025) 
  // zodat de historie altijd berekend kan worden als de datum ontbreekt.
  purchase_date: z.string().default("2025-01-01"),
}));

export type RawHolding = z.infer<typeof RawHoldingSchema>;

/**
 * AssetSchema
 * De basisinformatie van een aandeel/fonds.
 */
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

/**
 * OHLCVHistorySchema
 * De prijsdata. Cruciaal dat date_id exact matcht met de purchase_date.
 */
export const OHLCVHistorySchema = z.object({
  ticker_id: robustNumber,
  // Transformeert "2025-12-31T00:00:00Z" direct naar "2025-12-31"
  date_id: z.string().transform(val => normalizeDate(val) || val),
  open_price: robustNumber.nullable(),
  high_price: robustNumber.nullable(),
  low_price: robustNumber.nullable(),
  close_price: robustNumber, 
  Volume: robustNumber.nullable(),
});

export type OHLCVHistory = z.infer<typeof OHLCVHistorySchema>;

/**
 * --- ENTITEITEN (Lookup Tabellen) ---
 */

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