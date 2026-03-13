// src/data/constants/defaultHolding.ts

export interface DefaultHolding {
  ticker_id: number; // Directe link naar de Primary Key in MySQL
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}

export const DEFAULT_HOLDINGS: DefaultHolding[] = [
  { ticker_id: 1, quantity: 15, purchaseDate: '2016-01-02', purchasePrice: 26.33 },
  { ticker_id: 2, quantity: 5, purchaseDate: '2016-01-20', purchasePrice: 82.50 },
  { ticker_id: 3, quantity: 18, purchaseDate: '2016-02-18', purchasePrice: 52.10 },
  { ticker_id: 4, quantity: 30, purchaseDate: '2016-01-12', purchasePrice: 6.25 },
];