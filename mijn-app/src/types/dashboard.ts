export type AssetClassName = 
  | "Equities" 
  | "Bonds & Fixed Income" 
  | "Cash & Equivalents" 
  | "Commodities" 
  | "Crypto Assets" 
  | "Real Estate" 
  | "Alternatives";

export type SectorName = 
  | "Information Technology" 
  | "Financials" 
  | "Healthcare" 
  | "Consumer Discretionary" 
  | "Communication Services" 
  | "Industrials" 
  | "Consumer Staples" 
  | "Energy" 
  | "Utilities" 
  | "Real Estate" 
  | "Materials" 
  | "Government"
  | "Other";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CHF";

export type RegionName = "North America" | "Europe" | "Asia-Pacific" | "Emerging Markets" | "Global";

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  quantity: number; 
  price: number;    
  value: number;    // Berekend: quantity * price
  weight: number;   // Percentage van totaal portfolio
  beta: number;
  return_ytd: number;
  volatility?: number;
  region?: RegionName;
  country?: string;
  sector: SectorName;   
  assetClass: AssetClassName;
}

export interface AssetClass {
  id: string;
  name: AssetClassName;
  allocation_percent: number;
  beta: number;
  current_value: number;
  expected_return?: number;
  ytd_return?: number;
  color: string;
  holdings: Holding[];
  volatility?: number;
}

export interface Sector {
  name: SectorName;
  percentage: number;
  value: number;
}

export interface Currency {
  code: CurrencyCode;
  percentage: number;
  value: number;
}

export interface RiskMetrics {
  beta: number;
  maxDrawdown: number;
  volatility: number;
  sharpeRatio?: number;
}

export interface PerformancePoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  dailyChangePercent: number;
  ytdReturn: number;
  riskMetrics: RiskMetrics;
  performanceHistory: PerformancePoint[];
  sectorAllocation: Sector[];
  currencyAllocation: Currency[];
  assetClasses: AssetClass[];
  lastUpdated?: string; 
}