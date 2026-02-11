import { z } from "zod";

// 1. LOOKUP AND ENRICHMENT ---

// --- ASSET_CLASSES
export const AssetClassSchema = z.object({
  asset_classes_id: z.number(),
  asset_class: z.string(),
  description: z.string().nullable(),
});
export type AssetClass = z.infer<typeof AssetClassSchema>;

export interface EnrichedAssetClass extends AssetClass {
  id: number;                 // Voor de UI/Lucide React keys
  name: string;               // De weergavenaam (meestal gelijk aan asset_class)
  current_value: number;      // Berekend door de engine (euro's)
  allocation_percent: number; // Berekend door de engine (%)
  color: string;              // Voor de visuele balkjes         // Voor de risico-kolom
  assets: EnrichedHolding[];  // De lijst met aandelen in deze categorie
  currencyExposure: EnrichedCurrency[];
}

// --- ASSET_SECTORS
export const AssetSectorSchema = z.object({
  asset_sectors_id: z.number(),
  GICS_name: z.string(),
  description: z.string().nullable(),
});
export type AssetSector = z.infer<typeof AssetSectorSchema>;

export interface EnrichedAssetSector extends AssetSector {
  id: number;                 // Alias voor asset_sectors_id
  name: string;               // Alias voor GICS_name
  current_value: number;      // Totaalwaarde van alle aandelen in deze sector
  allocation_percent: number; // Percentage van het totale portfolio
  color: string;              // Kleur voor de sector-piechart/tabel
  holding_count: number;      // Aantal verschillende aandelen in deze sector
}

// --- ASSET_INDUSTRIES
export const AssetIndustrySchema = z.object({
  asset_industries_id: z.number(),
  asset_sectors_id: z.number(),
  description: z.string(),
});
export type AssetIndustry = z.infer<typeof AssetIndustrySchema>;

export interface EnrichedAssetIndustry extends AssetIndustry {
  id: number;                     // Alias voor asset_industries_id
  name: string;                   // De naam/omschrijving van de industrie
  current_value: number;          // Totaalwaarde in deze industrie
  allocation_total_percent: number; // % van je GEHELE portfolio
  allocation_sector_percent: number; // % binnen zijn eigen sector
  color: string;
  holding_count: number;
}

// --- CURENCIES
export const CurrencySchema = z.object({
  currencies_id: z.number(),
  ISO_code: z.string().length(3),
  full_name: z.string(),
});
export type Currency = z.infer<typeof CurrencySchema>;

export interface EnrichedCurrency extends Currency {
  id: number;                 // Alias voor currencies_id
  current_value: number;      // Totaalwaarde in deze valuta
  allocation_percent: number; // % van het totaal
}


// --- REGIONS
export const RegionSchema = z.object({
  regions_id: z.number(),
  description: z.string(),
  region_code: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;

export interface EnrichedRegion extends Region {
  id: number;                 // Alias voor regions_id
  name: string;               // Alias voor description (bijv. "North America")
  current_value: number;      // Totaalwaarde in deze regio
  allocation_percent: number; // % van je totale portfolio
  holding_count: number;      // Aantal aandelen in deze regio
  countries: EnrichedCountry[]; // NIEUW: Lijst met landen in deze regio
}


// --- COUNTRIES
export const CountrySchema = z.object({
  countries_id: z.number(),
  regions_id: z.number(),
  full_name: z.string(),
  ISO_code: z.string().length(3), 
});
export type Country = z.infer<typeof CountrySchema>;

export interface EnrichedCountry extends Country {
  id: number;                       // Alias voor countries_id
  name: string;                     // Alias voor full_name
  current_value: number;            // Totaalwaarde in dit land
  allocation_total_percent: number;   // % van je GEHELE portfolio
  allocation_region_percent: number;  // % binnen zijn eigen regio (bijv. "Duitsland is 20% van Europa")
  holding_count: number;
}


// --- MARKETS
export const MarketSchema = z.object({
  markets_id: z.number(),
  full_name: z.string(),
  markets_abbreviation: z.string(),
});
export type Market = z.infer<typeof MarketSchema>;

export interface EnrichedMarket extends Market {
  id: number;                 // Alias voor markets_id
  name: string;               // Alias voor full_name
  current_value: number;      // Totaalwaarde genoteerd op deze beurs
  allocation_percent: number; // % van totaal portfolio
  holding_count: number;      // Aantal aandelen op deze beurs
}


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

export interface EnrichedAsset extends Asset {
  // Metadata namen (voor de UI)
  market_name: string;
  asset_class_name: string;
  currency_code: string;
  industry_name: string;
  country_name: string;
  
  // Berekende waarden voor deze specifieke asset
  current_price: number;
  total_quantity: number;
  total_market_value: number;
  is_tracker: boolean; // Handig voor je samenvatting
}

// --- HOLDINGS
export interface RawHolding {
  ticker: string;
  quantity: number;
  purchaseDate: string;
  purchaePrice: number;
}

export interface EnrichedHolding extends PortfolioItem {
  quantity: number;
  purchaseDate: string;
  purchasePrice: number; // Overgenomen uit Raw
  currentPrice: number;  // Uit de database/API
  costBasis: number;     // Berekend: qty * purchasePrice
  marketValue: number;   // Berekend: qty * currentPrice
}


// --- PORTFOLIO
export interface Portfolio {
  id: string;
  name: string;
  holdings: EnrichedHolding[];
  assetAllocation: EnrichedAssetClass[];
  sectorAllocation: EnrichedAssetSector[];
  industryAllocation: EnrichedAssetIndustry[];
  currencyExposure: EnrichedCurrency[];
  regionAllocation: EnrichedRegion[];
  countryAllocation: EnrichedCountry[];
  marketAllocation: EnrichedMarket[];
  enrichedAssets: EnrichedAsset[];
  stats: PortfolioStats;          
  totalValue: number;
  lastUpdated: string;
}

export interface PortfolioStats {
  total_assets: number;
  unique_markets: number;
  unique_asset_classes: number;
  unique_sectors: number;
  tracker_count: number;
  stock_count: number;
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
  price: z.number().optional().default(0), 
  date: z.string().optional(), 
});
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;
