import { 
  Asset, 
  AssetClass, 
  AssetSector, 
  AssetIndustry, 
  Currency, 
  Region, 
  Country, 
  Market,
  RawHolding
} from "./raw";

// --- 0. INPUT INTERFACES (Voor hardcoded data) ---

/**
 * De interface voor handmatige invoer (bijv. in defaultHoldings.ts).
 * Gebruikt 'ticker' string als unieke identifier in plaats van ticker_id.
 */
export interface DefaultHolding {
  ticker: string;
  quantity: number;
  purchaseDate: string;   // camelCase zoals in jouw constante
  purchasePrice: number;  // camelCase zoals in jouw constante
}

// ... rest van je bestaande code (EnrichedAsset, EnrichedHolding, etc.)


// --- 1. HOLDINGS & ASSETS ---

/**
 * Verrijkte Asset: Bevat namen in plaats van enkel Foreign Key ID's
 */
export interface EnrichedAsset extends Asset {
  market_name: string;
  asset_class_name: string;
  currency_code: string;
  industry_name: string;
  country_name: string;
  
  current_price: number;
  total_quantity: number;
  total_market_value: number;
  is_tracker: boolean;
  isin: string | null;
}

/**
 * Verrijkte Holding: De combinatie van een aandeel met jouw persoonlijke aankoopdata.
 * We gebruiken snake_case om consistent te blijven met de database (Prisma/MySQL).
 */
export interface EnrichedHolding extends EnrichedAsset {
  purchase_date: string;    // Gefixed: matcht met RawHolding
  purchase_price: number;   // Gefixed: matcht met RawHolding
  costBasis: number;
  marketValue: number;
  pnlAbsolute: number;      // Nieuw: Nodig voor de Engines
  pnlPercentage: number;    // Nieuw: Nodig voor de Engines
  weight: number;           // Nieuw: Voor de tabel en charts
}

// --- 2. ALLOCATION INTERFACES ---

export interface EnrichedAssetClass extends AssetClass {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  color: string;
  assets: EnrichedHolding[];
}

export interface EnrichedAssetSector extends AssetSector {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  color: string;
  holding_count: number;
}

export interface EnrichedAssetIndustry extends AssetIndustry {
  id: number;
  name: string;
  current_value: number;
  allocation_total_percent: number;
  allocation_sector_percent: number;
  color: string;
  holding_count: number;
}

export interface EnrichedCurrency extends Currency {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
}

export interface EnrichedCountry extends Country {
  id: number;
  name: string;
  current_value: number;
  allocation_total_percent: number;
  allocation_region_percent: number;
  holding_count: number;
}

export interface EnrichedRegion extends Region {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  holding_count: number;
  countries: EnrichedCountry[];
}

export interface EnrichedMarket extends Market {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  holding_count: number;
}

// --- 3. PORTFOLIO & STATS ---

/**
 * Uitgebreide statistieken voor de Top Cards van het dashboard
 */
export interface PortfolioStats {
  total_assets: number;
  unique_markets: number;
  unique_asset_classes: number;
  unique_sectors: number;
  tracker_count: number;
  stock_count: number;
  
  // Nieuwe velden die we in de statsEngine berekenen:
  total_value: number;
  total_pnl_absolute: number;
  total_pnl_percent: number;
  top_performer_name: string;
  top_performer_ticker: string;
  top_performer_pct: number;
  concentration_risk: 'Low' | 'Medium' | 'High';
  highest_holding_weight: number;
}

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