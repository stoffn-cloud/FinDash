export const mockPortfolio = {
  totalValue: 125000,
  performance: 5.4,
  // Het component 'AssetAllocationTable' mapt over deze 'assetClasses'
  assetClasses: [
    { 
        id: "1",
        name: "Equities", 
        current_value: 80000, 
        // ... andere velden
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