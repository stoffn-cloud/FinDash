export interface PortfolioItem {
  ticker: string;
  amount: number;
  purchaseDate: string;
}

export const mockPortfolio: PortfolioItem[] = [
  { ticker: 'NASDAQ:AAPL', amount: 15.5, purchaseDate: '2025-01-02' },
  { ticker: 'NASDAQ:ABNB', amount: 25.0, purchaseDate: '2025-01-05' },
  { ticker: 'NASDAQ:ADBE', amount: 8.2, purchaseDate: '2025-01-10' },
  { ticker: 'NASDAQ:AMAT', amount: 30.0, purchaseDate: '2025-01-12' },
  { ticker: 'NASDAQ:AMD', amount: 45.0, purchaseDate: '2025-01-15' },
  { ticker: 'NASDAQ:AMGN', amount: 12.0, purchaseDate: '2025-01-18' },
  { ticker: 'NASDAQ:ASML', amount: 5.5, purchaseDate: '2025-01-20' },
  { ticker: 'NASDAQ:BKNG', amount: 2.0, purchaseDate: '2025-01-22' },
  { ticker: 'NASDAQ:COST', amount: 10.0, purchaseDate: '2025-01-25' },
  { ticker: 'NASDAQ:CSCO', amount: 100.0, purchaseDate: '2025-01-28' },
  { ticker: 'NASDAQ:GILD', amount: 60.0, purchaseDate: '2025-02-01' },
  { ticker: 'NASDAQ:GOOG', amount: 20.0, purchaseDate: '2025-02-03' },
  { ticker: 'NASDAQ:INTC', amount: 150.0, purchaseDate: '2025-02-05' },
  { ticker: 'NASDAQ:INTU', amount: 10.0, purchaseDate: '2025-02-08' },
  { ticker: 'NASDAQ:ISRG', amount: 14.0, purchaseDate: '2025-02-10' },
  { ticker: 'NASDAQ:MELI', amount: 4.0, purchaseDate: '2025-02-12' },
  { ticker: 'NASDAQ:MRNA', amount: 35.0, purchaseDate: '2025-02-15' },
  { ticker: 'NASDAQ:MSFT', amount: 18.5, purchaseDate: '2025-02-18' },
  { ticker: 'NASDAQ:NFLX', amount: 12.0, purchaseDate: '2025-02-20' },
  { ticker: 'NASDAQ:PANW', amount: 22.0, purchaseDate: '2025-02-22' },
  { ticker: 'NASDAQ:PEP', amount: 40.0, purchaseDate: '2025-02-25' },
  { ticker: 'NASDAQ:QCOM', amount: 50.0, purchaseDate: '2025-02-28' },
  { ticker: 'NASDAQ:SBUX', amount: 75.0, purchaseDate: '2025-03-01' },
  { ticker: 'NASDAQ:TMUS', amount: 30.0, purchaseDate: '2025-03-03' },
  { ticker: 'NASDAQ:VRTX', amount: 15.0, purchaseDate: '2025-03-05' }
];