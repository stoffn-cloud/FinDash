export const mockPortfolio = {
  name: "Quantum Alpha Portfolio",
  totalValue: 125000,
  dailyChangePercent: 1.24,
  ytdReturn: 8.45,
  riskMetrics: {
    beta: 0.85,
    maxDrawdown: 12.4,
    volatility: 15.2
  },
  performanceHistory: [
    { date: "2024-01-01", portfolioValue: 100000, benchmarkValue: 100000 },
    { date: "2024-02-01", portfolioValue: 102000, benchmarkValue: 101000 },
    { date: "2024-03-01", portfolioValue: 101500, benchmarkValue: 102500 },
    { date: "2024-04-01", portfolioValue: 105000, benchmarkValue: 103000 },
    { date: "2024-05-01", portfolioValue: 108000, benchmarkValue: 104500 },
    { date: "2024-06-01", portfolioValue: 110000, benchmarkValue: 106000 },
    { date: "2024-07-01", portfolioValue: 112500, benchmarkValue: 105500 },
    { date: "2024-08-01", portfolioValue: 115000, benchmarkValue: 107000 },
    { date: "2024-09-01", portfolioValue: 118000, benchmarkValue: 108500 },
    { date: "2024-10-01", portfolioValue: 120000, benchmarkValue: 110000 },
    { date: "2024-11-01", portfolioValue: 123000, benchmarkValue: 111500 },
    { date: "2024-12-01", portfolioValue: 125000, benchmarkValue: 112000 },
  ],
  sectorAllocation: [
    { name: "Technology", percentage: 42.5 },
    { name: "Finance", percentage: 18.2 },
    { name: "Healthcare", percentage: 12.8 },
    { name: "Consumer Discretionary", percentage: 10.5 },
    { name: "Communication Services", percentage: 8.4 },
    { name: "Other", percentage: 7.6 }
  ],
  currencyAllocation: [
    { code: "USD", percentage: 65.0, value: 81250 },
    { code: "EUR", percentage: 22.0, value: 27500 },
    { code: "GBP", percentage: 8.0, value: 10000 },
    { code: "JPY", percentage: 5.0, value: 6250 }
  ],
  assetClasses: [
    { 
      id: "1",
      name: "Equities",
      current_value: 80000,
      allocation_percent: 64.0,
      expected_return: 12.5,
      ytd_return: 14.2,
      volatility: 18.5,
      color: "#3B82F6",
      holdings: [
        { name: "Apple Inc.", ticker: "AAPL", weight: 45, value: 36000, return_ytd: 12.4, volatility: 22.0, region: "North America", country: "USA" },
        { name: "Microsoft", ticker: "MSFT", weight: 55, value: 44000, return_ytd: 15.2, volatility: 18.0, region: "North America", country: "USA" },
        { name: "ASML Holding", ticker: "ASML", weight: 10, value: 8000, return_ytd: 8.2, volatility: 25.0, region: "Europe", country: "Netherlands" }
      ]
    },
    { 
      id: "2",
      name: "Gold", 
      current_value: 20000, 
      allocation_percent: 16.0,
      expected_return: 2.0,
      volatility: 12.0,
      ytd_return: -1.5,
      color: "#F59E0B",
      holdings: [
        { name: "Physical Gold", ticker: "GOLD", weight: 100, value: 20000, return_ytd: -1.5, volatility: 12.0, region: "Global", country: "Global" }
      ]
    },
    { 
      id: "3",
      name: "Cash", 
      current_value: 25000, 
      allocation_percent: 20.0,
      expected_return: 3.5,
      volatility: 0.5,
      ytd_return: 1.2,
      color: "#10B981",
      holdings: [
        { name: "USD Cash", ticker: "USD", weight: 60, value: 15000, return_ytd: 1.2, volatility: 0.1, region: "North America", country: "USA" },
        { name: "EUR Cash", ticker: "EUR", weight: 40, value: 10000, return_ytd: 0.5, volatility: 0.1, region: "Europe", country: "Germany" }
      ]
    }
  ]
};
