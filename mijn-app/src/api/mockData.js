// 1. De Portfolio Hoofdata
export const mockPortfolio = {
  name: "Main Growth Portfolio",
  totalValue: 1250000,
  performance: 12.5,
  dailyChangePercent: 0.85,
  ytdReturn: 8.2,
  riskMetrics: {
    beta: 1.15,
    maxDrawdown: 14.2,
    volatility: 18.5,
  },
  assetClasses: [
    {
      id: "1",
      name: "Global Equities",
      value: 750000,
      percentage: 60,
      expected_return: 8.5,
      ytd_return: 5.2,
      color: "#3B82F6",
      holdings: [
        { name: "Apple Inc.", ticker: "AAPL", weight: 5, value: 37500, return_ytd: 4.2 },
        { name: "Microsoft", ticker: "MSFT", weight: 4.5, value: 33750, return_ytd: 6.1 },
        { name: "NVIDIA", ticker: "NVDA", weight: 3.2, value: 24000, return_ytd: 12.4 },
      ]
    },
    {
      id: "2",
      name: "Fixed Income",
      value: 375000,
      percentage: 30,
      expected_return: 4.2,
      ytd_return: 1.5,
      color: "#10B981",
      holdings: [
        { name: "US 10Y Treasury", ticker: "US10Y", weight: 15, value: 187500, return_ytd: 0.5 },
      ]
    },
    {
      id: "3",
      name: "Commodities",
      value: 125000,
      percentage: 10,
      expected_return: 6.8,
      ytd_return: -2.1,
      color: "#F59E0B",
      holdings: [
        { name: "Gold", ticker: "GOLD", weight: 8, value: 100000, return_ytd: 2.3 },
      ]
    }
  ],
  sectorAllocation: [
    { name: "Technology", value: 450000, percentage: 36 },
    { name: "Finance", value: 200000, percentage: 16 },
    { name: "Healthcare", value: 150000, percentage: 12 },
    { name: "Energy", value: 100000, percentage: 8 },
    { name: "Consumer Disc.", value: 350000, percentage: 28 },
  ],
  currencyAllocation: [
    { code: "USD", value: 875000, percentage: 70 },
    { code: "EUR", value: 250000, percentage: 20 },
    { code: "GBP", value: 125000, percentage: 10 },
  ],
  // Gebruikt voor de grafiek in PerformanceChart
  performanceHistory: [
    { date: "2023-01", value: 1000000, benchmark: 1000000 },
    { date: "2023-02", value: 1020000, benchmark: 1015000 },
    { date: "2023-03", value: 1015000, benchmark: 1005000 },
    { date: "2023-04", value: 1045000, benchmark: 1025000 },
    { date: "2023-05", value: 1080000, benchmark: 1040000 },
    { date: "2023-06", value: 1120000, benchmark: 1060000 },
  ]
};

// 2. Transactiegeschiedenis (voor de History tab)
export const mockTransactions = [
  { id: "t1", date: "2024-01-15", type: "BUY", asset: "AAPL", amount: 10, price: 185.20, status: "COMPLETED" },
  { id: "t2", date: "2024-01-12", type: "SELL", asset: "MSFT", amount: 5, price: 390.10, status: "COMPLETED" },
  { id: "t3", date: "2024-01-10", type: "DIVIDEND", asset: "VTI", amount: 1, price: 45.50, status: "COMPLETED" },
];

// 3. Marktinformatie (voor de Markets tab)
export const mockMarketData = [
  { symbol: "S&P 500", price: 4890.97, change: 0.45 },
  { symbol: "Nasdaq 100", price: 17443.52, change: 0.98 },
  { symbol: "BTC/USD", price: 42300, change: -1.2 },
];