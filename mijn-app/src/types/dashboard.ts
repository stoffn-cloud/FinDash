export interface Holding {
  name: string;
  ticker: string;
  weight: number;
  value: number;
  return_ytd: number;
  volatility?: number;
  region?: string;
  country?: string;
}

export interface AssetClass {
  id?: string;
  name: string;
  allocation_percent: number;
  current_value: number;
  expected_return: number;
  ytd_return: number;
  color: string;
  holdings?: Holding[];
  volatility?: number;
}

export interface Sector {
  name: string;
  percentage: number;
  value?: number;
}

export interface Currency {
  code: string;
  percentage: number;
  value: number;
}

export interface RiskMetrics {
  beta?: number;
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
  name?: string;
  totalValue?: number;
  dailyChangePercent?: number;
  ytdReturn?: number;
  riskMetrics?: RiskMetrics;
  performanceHistory?: PerformancePoint[];
  sectorAllocation?: Sector[];
  currencyAllocation?: Currency[];
  assetClasses?: AssetClass[];
}
