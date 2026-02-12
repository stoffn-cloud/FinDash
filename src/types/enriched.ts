import { 
  Asset, 
  AssetClass, 
  AssetSector, 
  AssetIndustry, 
  Currency, 
  Region, 
  Country, 
  Market,
  PortfolioItem // Indien nog gebruikt voor de Engine input
} from "./raw";

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
 * Verrijkte Holding: De combinatie van een aandeel met jouw persoonlijke aankoopdata
 */
export interface EnrichedHolding extends EnrichedAsset {
  purchaseDate: string;
  purchasePrice: number;
  costBasis: number;
  marketValue: number;
}

// --- 2. ALLOCATION INTERFACES ---

export interface EnrichedAssetClass extends AssetClass {
  id: number;                 // Alias voor asset_classes_id
  name: string;               // Alias voor asset_class
  current_value: number;
  allocation_percent: number;
  color: string;
  assets: EnrichedHolding[];  // Filtered lijst van holdings in deze class
}

export interface EnrichedAssetSector extends AssetSector {
  id: number;
  name: string;               // Alias voor GICS_name
  current_value: number;
  allocation_percent: number;
  color: string;
  holding_count: number;
}

export interface EnrichedAssetIndustry extends AssetIndustry {
  id: number;
  name: string;               // Alias voor description
  current_value: number;
  allocation_total_percent: number;
  allocation_sector_percent: number;
  color: string;
  holding_count: number;
}

export interface EnrichedCurrency extends Currency {
  id: number;
  name: string;               // Alias voor full_name
  current_value: number;
  allocation_percent: number;
}

export interface EnrichedCountry extends Country {
  id: number;
  name: string;               // Alias voor full_name
  current_value: number;
  allocation_total_percent: number;
  allocation_region_percent: number;
  holding_count: number;
}

export interface EnrichedRegion extends Region {
  id: number;
  name: string;               // Alias voor description
  current_value: number;
  allocation_percent: number;
  holding_count: number;
  countries: EnrichedCountry[]; // Drill-down relatie
}

export interface EnrichedMarket extends Market {
  id: number;
  name: string;               // Alias voor full_name
  current_value: number;
  allocation_percent: number;
  holding_count: number;
}

// --- 3. PORTFOLIO & STATS ---

export interface PortfolioStats {
  total_assets: number;
  unique_markets: number;
  unique_asset_classes: number;
  unique_sectors: number;
  tracker_count: number;
  stock_count: number;
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