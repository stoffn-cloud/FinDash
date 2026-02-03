import { Portfolio } from "../../types/dashboard";

export const DEFAULT_PORTFOLIO_STRUCTURE: Portfolio = {
  id: "default-alpha-node",
  name: "Global Multi-Asset Strategy",
  totalValue: 0, // Wordt berekend door de store
  dailyChangePercent: 0.45,
  ytdReturn: 8.2,
  lastUpdated: new Date().toISOString(),
  
  riskMetrics: {
    beta: 0.88,
    volatility: 0.12,
    maxDrawdown: -14.2,
    sharpeRatio: 1.45
  },

  performanceHistory: [
    { date: "2023-10-01", portfolioValue: 92000, benchmarkValue: 90000 },
    { date: "2023-11-01", portfolioValue: 95000, benchmarkValue: 93500 },
    { date: "2023-12-01", portfolioValue: 98500, benchmarkValue: 96000 },
    { date: "2024-01-01", portfolioValue: 100000, benchmarkValue: 97500 }
  ],

  assetClasses: [
    {
      id: "ac-eq",
      name: "Equities",
      allocation_percent: 60,
      current_value: 0,
      expected_return: 0.09,
      ytd_return: 12.4,
      color: "#3b82f6", // Blue
      holdings: [
        {
          id: "h-aapl",
          name: "Apple Inc.",
          ticker: "AAPL",
          weight: 25,
          quantity: 150,
          price: 0,
          value: 0,
          return_ytd: 14.2,
          sector: "Information Technology",
          region: "North America"
        },
        {
          id: "h-asml",
          name: "ASML Holding",
          ticker: "ASML",
          weight: 15,
          quantity: 40,
          price: 0,
          value: 0,
          return_ytd: 22.1,
          sector: "Information Technology",
          region: "Europe"
        },
        {
          id: "h-jpm",
          name: "JPMorgan Chase & Co.",
          ticker: "JPM",
          weight: 20,
          quantity: 120,
          price: 0,
          value: 0,
          return_ytd: 8.5,
          sector: "Financials",
          region: "North America"
        }
      ]
    },
    {
      id: "ac-fi",
      name: "Bonds & Fixed Income",
      allocation_percent: 25,
      current_value: 0,
      expected_return: 0.045,
      ytd_return: -2.1,
      color: "#10b981", // Emerald
      holdings: [
        {
          id: "h-tlt",
          name: "iShares 20+ Year Treasury Bond",
          ticker: "TLT",
          weight: 60,
          quantity: 300,
          price: 0,
          value: 0,
          return_ytd: -5.4,
          sector: "Government",
          region: "North America"
        },
        {
          id: "h-bndx",
          name: "Vanguard Total Int. Bond ETF",
          ticker: "BNDX",
          weight: 40,
          quantity: 500,
          price: 0,
          value: 0,
          return_ytd: 1.2,
          sector: "Government",
          region: "Global"
        }
      ]
    },
    {
      id: "ac-com",
      name: "Commodities",
      allocation_percent: 10,
      current_value: 0,
      expected_return: 0.03,
      ytd_return: 6.8,
      color: "#f59e0b", // Amber
      holdings: [
        {
          id: "h-gld",
          name: "SPDR Gold Shares",
          ticker: "GLD",
          weight: 100,
          quantity: 50,
          price: 0,
          value: 0,
          return_ytd: 6.8,
          sector: "Materials",
          region: "Global"
        }
      ]
    },
    {
      id: "ac-cry",
      name: "Crypto Assets",
      allocation_percent: 5,
      current_value: 0,
      expected_return: 0.25,
      ytd_return: 45.2,
      color: "#8b5cf6", // Violet
      holdings: [
        {
          id: "h-btc",
          name: "Bitcoin",
          ticker: "BTC-USD",
          weight: 100,
          quantity: 0.85,
          price: 0,
          value: 0,
          return_ytd: 48.5,
          sector: "Other",
          region: "Global"
        }
      ]
    }
  ],
  sectorAllocation: [], // Wordt afgeleid
  currencyAllocation: [
    { code: "USD", percentage: 75, value: 0 },
    { code: "EUR", percentage: 25, value: 0 }
  ]
};