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
 * Gebruikt voor de initiële data-inname vanuit de database of store.
 */
export interface DefaultHolding {
  id?: number;
  ticker_id: number;
  quantity: number;
  purchase_price: number;
  purchase_date: string; // Formaat: YYYY-MM-DD
}

/**
 * 1. HOLDINGS & ASSETS
 */

/**
 * Verrijkte Asset: Basis metadata gecombineerd met actuele marktprijs en status.
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
 * Verrijkte Holding: De 'werkpaarden' van de engine.
 * Bevat zowel de asset informatie als de berekende financiële resultaten.
 */
export interface EnrichedHolding extends EnrichedAsset {
  id: number;               
  quantity: number;         
  purchase_price: number;    
  purchase_date: string;     
  
  // Financiële resultaten (Berekend door holdingsEngine/math)
  cost_basis: number;       
  market_value: number;     
  pnl_absolute: number;     
  pnl_percentage: number;   
  weight: number;           
  
  // UI Aliases voor consistente rendering
  symbol: string;
  name: string;
}

/**
 * 2. ALLOCATION INTERFACES
 * Gebruikt voor Pie Charts, Donut Charts en Treemaps.
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

/**
 * Samenvattende statistieken voor de bovenkant van het dashboard.
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

/**
 * Een enkel datapunt voor de tijdslijn-grafiek.
 */
export interface PortfolioHistoryPoint {
  date: string;         // Altijd YYYY-MM-DD
  total_value: number;
}

/**
 * Het Finale Portfolio Object
 * Dit is wat de UI (Dashboard) consumeert.
 */
export interface Portfolio {
  id: string;
  name: string;
  holdings: EnrichedHolding[];
  enrichedAssets: EnrichedAsset[];

  // Allocatie-data (georganiseerd voor UI componenten)
  assetAllocation: EnrichedAssetClass[];
  sectorAllocation: EnrichedAssetSector[];
  industryAllocation: EnrichedAssetIndustry[];
  currencyExposure: EnrichedCurrency[];
  currencyAllocation?: EnrichedCurrency[]; // Fallback alias
  regionAllocation: EnrichedRegion[];
  countryAllocation: EnrichedCountry[];
  marketAllocation: EnrichedMarket[];

  // Performance-data over tijd
  history: PortfolioHistoryPoint[];

  // Dashboard-breedte data
  stats: PortfolioStats;
  totalValue: number;
  lastUpdated: string;
}