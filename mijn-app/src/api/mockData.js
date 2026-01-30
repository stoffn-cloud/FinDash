export const mockPortfolio = {
  totalValue: 125000,
  performance: 5.4,
  dailyChangePercent: 1.25,
  ytdReturn: 8.42,
  riskMetrics: {
    beta: 1.12,
    maxDrawdown: 12.5,
    volatility: 15.4
  },
  sectorAllocation: [
    { name: "Technology", percentage: 45, value: 45, color: "#3B82F6" },
    { name: "Healthcare", percentage: 20, value: 20, color: "#10B981" },
    { name: "Finance", percentage: 15, value: 15, color: "#F59E0B" },
    { name: "Energy", percentage: 10, value: 10, color: "#EF4444" },
    { name: "Others", percentage: 10, value: 10, color: "#6366F1" }
  ],
  currencyAllocation: [
    { code: "USD", percentage: 70, value: 87500, color: "#3B82F6" },
    { code: "EUR", percentage: 20, value: 25000, color: "#10B981" },
    { code: "GBP", percentage: 5, value: 6250, color: "#F59E0B" },
    { code: "JPY", percentage: 5, value: 6250, color: "#EF4444" }
  ],
  performanceHistory: [
    { date: '2023-01-01', portfolioValue: 100000, benchmarkValue: 100000 },
    { date: '2023-02-01', portfolioValue: 105000, benchmarkValue: 102000 },
    { date: '2023-03-01', portfolioValue: 103000, benchmarkValue: 101000 },
    { date: '2023-04-01', portfolioValue: 108000, benchmarkValue: 104000 },
    { date: '2023-05-01', portfolioValue: 112000, benchmarkValue: 106000 },
    { date: '2023-06-01', portfolioValue: 115000, benchmarkValue: 108000 },
    { date: '2023-07-01', portfolioValue: 125000, benchmarkValue: 110000 }
  ],
  // Het component 'AssetAllocationTable' mapt over deze 'assetClasses'
  assetClasses: [
    { 
      id: "1",
      name: "Equities",
      current_value: 80000,
      allocation_percent: 64.0,
      expected_return: 8.5,
      volatility: 18.0,
      ytd_return: 12.4,
      color: "#3B82F6",
      holdings: [
        { name: "Apple Inc.", ticker: "AAPL", weight: 45, value: 36000, return_ytd: 12.4, volatility: 22.0 },
        { name: "Microsoft", ticker: "MSFT", weight: 55, value: 44000, return_ytd: 8.2, volatility: 18.0 }
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
      color: "#F59E0B" 
    },
    { 
      id: "3",
      name: "Cash", 
      current_value: 25000, 
      allocation_percent: 20.0,
      expected_return: 3.5,
      volatility: 0.5,
      ytd_return: 1.2,
      color: "#10B981" 
    }
  ]
};
