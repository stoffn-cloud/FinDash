export const mockPortfolio = {
  name: "Quantum Alpha Global Terminal",
  totalValue: 2845750, // Verhoogd om de grotere asset lijst te accommoderen
  dailyChangePercent: 1.24,
  ytdReturn: 12.45,
  currency: "USD",
  riskMetrics: {
    beta: 1.08,
    maxDrawdown: 14.2,
    volatility: 15.8,
    sharpeRatio: 2.1,
    var95: 142287
  },
  // Performance geschiedenis voor de grote grafiek
  performanceHistory: [
    { date: "2024-01-01", portfolioValue: 2400000, benchmarkValue: 2400000 },
    { date: "2024-03-01", portfolioValue: 2550000, benchmarkValue: 2480000 },
    { date: "2024-06-01", portfolioValue: 2710000, benchmarkValue: 2600000 },
    { date: "2024-09-01", portfolioValue: 2680000, benchmarkValue: 2650000 },
    { date: "2024-12-01", portfolioValue: 2845750, benchmarkValue: 2710000 },
  ],
  sectorAllocation: [
    { name: "Technology", percentage: 32.5 },
    { name: "Finance", percentage: 15.2 },
    { name: "Healthcare", percentage: 12.8 },
    { name: "Energy", percentage: 10.5 },
    { name: "Consumer Luxury", percentage: 8.4 },
    { name: "Government Bonds", percentage: 14.1 },
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
      id: "1",
      name: "Equities",
      current_value: 1850000,
      allocation_percent: 65.0,
      expected_return: 10.5,
      ytd_return: 18.2,
      color: "#3B82F6",
      holdings: [
        { name: "NVIDIA Corp", ticker: "NVDA", weight: 25, value: 462500, return_ytd: 145.2, volatility: 45.0, region: "North America", country: "USA", sector: "Tech" },
        { name: "Microsoft", ticker: "MSFT", weight: 20, value: 370000, return_ytd: 15.2, volatility: 18.0, region: "North America", country: "USA", sector: "Tech" },
        { name: "ASML Holding", ticker: "ASML", weight: 15, value: 277500, return_ytd: 12.4, volatility: 25.0, region: "Europe", country: "Netherlands", sector: "Tech" },
        { name: "Novo Nordisk", ticker: "NOVO-B", weight: 15, value: 277500, return_ytd: 32.1, volatility: 20.0, region: "Europe", country: "Denmark", sector: "Healthcare" },
        { name: "LVMH", ticker: "MC.PA", weight: 15, value: 277500, return_ytd: -4.5, volatility: 22.0, region: "Europe", country: "France", sector: "Luxury" },
        { name: "Toyota Motor", ticker: "7203.T", weight: 10, value: 185000, return_ytd: 8.4, volatility: 19.0, region: "Japan", country: "Japan", sector: "Automotive" }
      ]
    },
    { 
      id: "2",
      name: "Fixed Income", 
      current_value: 550000, 
      allocation_percent: 19.3,
      expected_return: 4.2,
      volatility: 8.0,
      ytd_return: 2.1,
      color: "#8B5CF6",
      holdings: [
        { name: "US Treasury 10Y", ticker: "T10Y", weight: 60, value: 330000, return_ytd: 1.5, volatility: 7.0, region: "North America", country: "USA", sector: "Government" },
        { name: "German Bund", ticker: "BUND", weight: 40, value: 220000, return_ytd: 0.8, volatility: 6.0, region: "Europe", country: "Germany", sector: "Government" }
      ]
    },
    { 
      id: "3",
      name: "Alternatives", 
      current_value: 300000, 
      allocation_percent: 10.5,
      expected_return: 8.0,
      volatility: 25.0,
      ytd_return: 22.4,
      color: "#F59E0B",
      holdings: [
        { name: "Physical Gold", ticker: "GOLD", weight: 50, value: 150000, return_ytd: 14.2, volatility: 12.0, region: "Global", country: "Global", sector: "Commodity" },
        { name: "Bitcoin", ticker: "BTC", weight: 50, value: 150000, return_ytd: 65.4, volatility: 55.0, region: "Global", country: "Global", sector: "Crypto" }
      ]
    },
    { 
      id: "4",
      name: "Cash", 
      current_value: 145750, 
      allocation_percent: 5.2,
      expected_return: 3.5,
      volatility: 0.2,
      ytd_return: 1.8,
      color: "#10B981",
      holdings: [
        { name: "USD Cash", ticker: "USD", weight: 100, value: 145750, return_ytd: 1.8, volatility: 0.1, region: "North America", country: "USA", sector: "Cash" }
      ]
    }
  ],
  transactions: [
    { id: 1, date: "2024-12-15", type: "buy", asset_name: "NVIDIA Corp", ticker: "NVDA", quantity: 50, price: 125.50, total_amount: 6275.00 },
    { id: 2, date: "2024-12-12", type: "dividend", asset_name: "Microsoft", ticker: "MSFT", total_amount: 450.40 },
    { id: 3, date: "2024-12-10", type: "sell", asset_name: "Physical Gold", ticker: "GOLD", quantity: 2, price: 2350.00, total_amount: 4700.00 },
    { id: 4, date: "2024-12-05", type: "buy", asset_name: "Bitcoin", ticker: "BTC", quantity: 0.1, price: 95000.00, total_amount: 9500.00 },
    { id: 5, date: "2024-11-28", type: "buy", asset_name: "ASML Holding", ticker: "ASML", quantity: 5, price: 820.00, total_amount: 4100.00 },
  ]
};