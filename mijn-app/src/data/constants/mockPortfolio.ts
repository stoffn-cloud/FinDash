import { Portfolio } from "../../types/schemas";

export const mockPortfolio: Portfolio = {
  id: "main-portfolio-001",
  name: "Quantum Alpha Global Terminal",
  totalValue: 2845750, // Dit getal wordt nu consistent met quantity * price
  dailyChangePercent: 1.24,
  ytdReturn: 12.45,
  riskMetrics: {
    beta: 1.08,
    maxDrawdown: 14.2,
    volatility: 15.8,
    sharpeRatio: 2.1,
    var95: 142287
  },
  performanceHistory: [
    { date: "2024-01-01", portfolioValue: 2400000, benchmarkValue: 2400000 },
    { date: "2025-01-01", portfolioValue: 2650000, benchmarkValue: 2550000 },
    { date: "2026-02-03", portfolioValue: 2845750, benchmarkValue: 2710000 },
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
        { 
          name: "NVIDIA Corp", ticker: "NVDA", weight: 25, 
          quantity: 3250, price: 142.31, // Realistische prijs feb 2026
          value: 462507, return_ytd: 12.4, volatility: 45.0, 
          region: "North America", country: "USA", sector: "Information Technology" 
        },
        { 
          name: "Microsoft", ticker: "MSFT", weight: 20, 
          quantity: 800, price: 462.50, 
          value: 370000, return_ytd: 5.2, volatility: 18.0, 
          region: "North America", country: "USA", sector: "Information Technology" 
        },
        { 
          name: "ASML Holding", ticker: "ASML", weight: 15, 
          quantity: 310, price: 895.16, 
          value: 277500, return_ytd: 8.4, volatility: 25.0, 
          region: "Europe", country: "Netherlands", sector: "Information Technology" 
        },
        { 
          name: "Novo Nordisk", ticker: "NOVO-B", weight: 15, 
          quantity: 2100, price: 132.14, 
          value: 277494, return_ytd: 15.1, volatility: 20.0, 
          region: "Europe", country: "Denmark", sector: "Healthcare" 
        }
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
        { 
          name: "US Treasury 10Y", ticker: "T10Y", weight: 60, 
          quantity: 3300, price: 100.00, 
          value: 330000, return_ytd: 1.5, volatility: 7.0, 
          region: "North America", country: "USA", sector: "Government" 
        }
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
        { 
          name: "Bitcoin", ticker: "BTC-USD", weight: 50, 
          quantity: 1.55, price: 96774.19, 
          value: 150000, return_ytd: 25.4, volatility: 55.0, 
          region: "Global", country: "Global", sector: "Other" 
        }
      ]
    }
  ],
  transactions: [] // Kan leeg blijven voor de baseline
};