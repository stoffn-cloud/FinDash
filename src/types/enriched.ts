import { 
  Asset, 
  AssetClass, 
  AssetSector, 
  AssetIndustry, 
  Currency, 
  Region, 
  Country, 
  Market
} from "./raw";

/**
 * 0. INPUT INTERFACES
 * Gebruikt voor handmatige invoer of mock-data.
 */
export interface DefaultHolding {
  id?: number;
  ticker_id: number;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  // Optionele CamelCase ondersteuning voor legacy compatibiliteit
  purchasePrice?: number;
  purchaseDate?: string;
}

/**
 * 1. HOLDINGS & ASSETS
 */

/**
 * Verrijkte Asset: Statische data + Marktprijs.
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
}

/**
 * Verrijkte Holding: De koppeling tussen je portefeuilledata en assetinformatie.
 */
export interface EnrichedHolding extends EnrichedAsset {
  id: number;               
  quantity: number;         
  purchase_price: number;    
  purchase_date: string;     
  
  // Berekende waarden (Financials)
  cost_basis: number;       
  market_value: number;     
  pnl_absolute: number;     
  pnl_percentage: number;   
  weight: number;           
  
  // Voor UI-rendering fallback
  symbol: string;
  name: string;
}

/**
 * 2. ALLOCATION INTERFACES
 */

export interface EnrichedAssetClass extends AssetClass {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  color: string;
}

export interface EnrichedAssetSector extends AssetSector {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  color: string;
}

export interface EnrichedAssetIndustry extends AssetIndustry {
  id: number;
  name: string;
  current_value: number;
  allocation_total_percent: number;
  color: string;
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
  allocation_percent: number;
}

export interface EnrichedRegion extends Region {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
  countries: EnrichedCountry[];
}

export interface EnrichedMarket extends Market {
  id: number;
  name: string;
  current_value: number;
  allocation_percent: number;
}

/**
 * 3. PORTFOLIO, STATS & HISTORY
 */

export interface PortfolioStats {
  total_assets: number;
  unique_markets: number;
  unique_asset_classes: number;
  unique_sectors: number;
  tracker_count: number;
  stock_count: number;
  total_value: number;
  total_pnl_absolute: number;
  total_pnl_percent: number;
  top_performer_ticker: string;
  top_performer_pct: number;
  concentration_risk: 'Low' | 'Medium' | 'High';
  highest_holding_weight: number;
}

export interface PortfolioHistoryPoint {
  date: string;         
  total_value: number;
}

/**
 * De Master Portfolio Object
 * Zorg dat deze namen EXACT zo uit de Orchestrator komen.
 */
export interface Portfolio {
  id: string;
  name: string;
  holdings: EnrichedHolding[];
  enrichedAssets: EnrichedAsset[];

  // Allocatie-data
  assetAllocation: EnrichedAssetClass[];
  sectorAllocation: EnrichedAssetSector[];
  industryAllocation: EnrichedAssetIndustry[];
  currencyExposure: EnrichedCurrency[];
  // Fallback voor UI componenten die 'currencyAllocation' zoeken
  currencyAllocation?: EnrichedCurrency[]; 
  regionAllocation: EnrichedRegion[];
  countryAllocation: EnrichedCountry[];
  marketAllocation: EnrichedMarket[];

  // Grafiek-data
  history: PortfolioHistoryPoint[];

  // Dashboard-data
  stats: PortfolioStats;
  totalValue: number;
  lastUpdated: string;
}