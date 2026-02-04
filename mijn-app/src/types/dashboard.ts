export type AssetClassName = 
  | "Equities" 
  | "Bonds & Fixed Income" 
  | "Cash & Equivalents" 
  | "Commodities" 
  | "Crypto Assets" 
  | "Real Estate" 
  | "Alternatives";

// De standaard sectoren (GICS structuur)
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
  | "Government" // Voor staatsobligaties
  | "Other";

// De ondersteunde valuta
export type CurrencyCode = 
  | "USD" 
  | "EUR" 
  | "GBP" 
  | "JPY" 
  | "CHF";

export type RegionName = 
  | "North America" 
  | "Europe" 
  | "Asia-Pacific" 
  | "Emerging Markets" 
  | "Global";

export interface Holding {
  id: string; // NIEUW: Altijd handig voor React keys en database lookups
  name: string;
  ticker: string;
  weight?: number;
  quantity?: number; // NIEUW: Nodig om waarde te berekenen (quantity * price)
  price?: number;    // NIEUW: De live prijs van Yahoo Finance
  beta?: number;
  value?: number;
  return_ytd: number;
  volatility?: number;
  region?: RegionName;
  country?: string;
  sector?: SectorName;   // NIEUW: Om sectorAllocation automatisch te berekenen
  assetClass?: AssetClassName; // NIEUW: Om assetClasses automatisch te berekenen
}

export interface AssetClass {
  id: string;
  name: AssetClassName;
  allocation_percent?: number;
  beta?: number;
  current_value?: number;
  expected_return?: number;
  ytd_return?: number;
  color?: string;
  holdings: Holding[]; // Verplicht maken (leeg array is ook goed)
  volatility?: number;
}

export interface Sector {
  name: SectorName;
  percentage: number;
  value?: number;
}

export interface Currency {
  code: CurrencyCode;
  percentage: number;
  value: number;
}

export interface RiskMetrics {
  beta: number;
  maxDrawdown?: number;
  volatility?: number;
  [key: string]: any;
}

export interface PerformancePoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
}

export interface Portfolio {
  id: string; // NIEUW: Unieke identificatie van de set
  name: string;
  totalValue?: number;
  dailyChangePercent?: number;
  ytdReturn?: number;
  riskMetrics: RiskMetrics;
  performanceHistory: PerformancePoint[];
  sectorAllocation: Sector[];
  currencyAllocation: Currency[];
  assetClasses: AssetClass[];
  lastUpdated?: string; // NIEUW: Voor de "Live" status indicatie
}
