import { Portfolio } from "../../types/schemas";


export const mockPortfolio: Portfolio = {
  name: "Quantum Alpha Global Terminal",
  totalValue: 2845750,
  dailyChangePercent: 1.24,
  ytdReturn: 12.45,
  // Let op: We voegen RiskMetrics toe volgens jouw Schema
  riskMetrics: {
    beta: 1.08,
    maxDrawdown: 14.2,
    volatility: 15.8,
    // sharpeRatio en var95 vallen onder de [key: string]: any van je schema
    sharpeRatio: 2.1,
    var95: 142287
  },
  performanceHistory: [
    { date: "2024-01-01", portfolioValue: 2400000, benchmarkValue: 2400000 },
    { date: "2024-03-01", portfolioValue: 2550000, benchmarkValue: 2480000 },
    { date: "2024-06-01", portfolioValue: 2710000, benchmarkValue: 2600000 },
    { date: "2024-09-01", portfolioValue: 2680000, benchmarkValue: 2650000 },
    { date: "2024-12-01", portfolioValue: 2845750, benchmarkValue: 2710000 },
  ],
  sectorAllocation: [
    { name: "Information Technology", percentage: 32.5 },
    { name: "Financials", percentage: 15.2 },
    { name: "Healthcare", percentage: 12.8 },
    { name: "Energy", percentage: 10.5 },
    { name: "Consumer Discretionary", percentage: 8.4 },
    { name: "Government", percentage: 14.1 },
    { name: "Other", percentage: 6.5 }
  ],
  currencyAllocation: [
    { code: "USD", percentage: 58.0, value: 1650535 },
    { code: "EUR", percentage: 24.0, value: 682980 },
    { code: "DKK", percentage: 8.0, value: 227660 },
    { code: "JPY", percentage: 6.0, value: 170745 },
    { code: "BTC", percentage: 4.0, value: 113830 }
  ],
  assetClasses: [
    { 
      id: "ac-1",
      name: "Equities",
      current_value: 1850000,
      allocation_percent: 65.0,
      expected_return: 10.5,
      ytd_return: 18.2,
      color: "#3B82F6",
      holdings: [
        { name: "NVIDIA Corp", ticker: "NVDA", weight: 25, value: 462500, return_ytd: 145.2, volatility: 45.0, region: "North America", country: "USA", sector: "Information Technology" },
        { name: "Microsoft", ticker: "MSFT", weight: 20, value: 370000, return_ytd: 15.2, volatility: 18.0, region: "North America", country: "USA", sector: "Information Technology" },
        { name: "ASML Holding", ticker: "ASML", weight: 15, value: 277500, return_ytd: 12.4, volatility: 25.0, region: "Europe", country: "Netherlands", sector: "Information Technology" },
        { name: "Novo Nordisk", ticker: "NOVO-B", weight: 15, value: 277500, return_ytd: 32.1, volatility: 20.0, region: "Europe", country: "Denmark", sector: "Healthcare" },
        { name: "LVMH", ticker: "MC.PA", weight: 15, value: 277500, return_ytd: -4.5, volatility: 22.0, region: "Europe", country: "France", sector: "Consumer Discretionary" },
        { name: "Toyota Motor", ticker: "7203.T", weight: 10, value: 185000, return_ytd: 8.4, volatility: 19.0, region: "Asia-Pacific", country: "Japan", sector: "Consumer Discretionary" }
      ]
    },
    { 
      id: "ac-2",
      name: "Fixed Income", 
      current_value: 550000, 
      allocation_percent: 19.3,
      expected_return: 4.2,
      ytd_return: 2.1,
      color: "#8B5CF6",
      holdings: [
        { name: "US Treasury 10Y", ticker: "T10Y", weight: 60, value: 330000, return_ytd: 1.5, volatility: 7.0, region: "North America", country: "USA", sector: "Government" },
        { name: "German Bund", ticker: "BUND", weight: 40, value: 220000, return_ytd: 0.8, volatility: 6.0, region: "Europe", country: "Germany", sector: "Government" }
      ]
    },
    { 
      id: "ac-3",
      name: "Crypto Assets", 
      current_value: 300000, 
      allocation_percent: 10.5,
      expected_return: 8.0,
      ytd_return: 22.4,
      color: "#F59E0B",
      holdings: [
        { name: "Physical Gold", ticker: "GOLD", weight: 50, value: 150000, return_ytd: 14.2, volatility: 12.0, region: "Global", country: "Global", sector: "Materials" },
        { name: "Bitcoin", ticker: "BTC", weight: 50, value: 150000, return_ytd: 65.4, volatility: 55.0, region: "Global", country: "Global", sector: "Other" }
      ]
    }
  ],
  transactions: [
    { id: "t-1", date: "2024-12-15", type: "buy", asset_name: "NVIDIA Corp", ticker: "NVDA", quantity: 50, price: 125.50, total_amount: 6275.00 },
    { id: "t-2", date: "2024-12-12", type: "dividend", asset_name: "Microsoft", ticker: "MSFT", total_amount: 450.40 },
    { id: "t-3", date: "2024-12-10", type: "sell", asset_name: "Physical Gold", ticker: "GOLD", quantity: 2, price: 2350.00, total_amount: 4700.00 },
  ]
};