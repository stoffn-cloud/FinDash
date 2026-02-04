// src/data/constants/rawAssets.ts
import { Holding } from "../../types/schemas";

export const mockPortfolio: Holding[] = [
  // EQUITIES
  { id: "h1", name: "NVIDIA Corp", ticker: "NVDA", quantity: 3250, price: 142.31, beta: 1.85, sector: "Information Technology", assetClass: "Equities", region: "North America", return_ytd: 12.4 },
  { id: "h2", name: "Microsoft", ticker: "MSFT", quantity: 800, price: 462.50, beta: 1.20, sector: "Information Technology", assetClass: "Equities", region: "North America", return_ytd: 5.2 },
  { id: "h3", name: "ASML Holding", ticker: "ASML", quantity: 310, price: 895.16, beta: 1.35, sector: "Information Technology", assetClass: "Equities", region: "Europe", return_ytd: 8.4 },
  { id: "h4", name: "Novo Nordisk", ticker: "NOVO-B", quantity: 2100, price: 132.14, beta: 0.75, sector: "Healthcare", assetClass: "Equities", region: "Europe", return_ytd: 15.1 },
  
  // FIXED INCOME
  { id: "h5", name: "US Treasury 10Y", ticker: "T10Y", quantity: 3300, price: 100.00, beta: 0.12, sector: "Government", assetClass: "Bonds & Fixed Income", region: "North America", return_ytd: 1.5 },
  
  // CRYPTO
  { id: "h6", name: "Bitcoin", ticker: "BTC-USD", quantity: 1.55, price: 96774.19, beta: 2.40, sector: "Other", assetClass: "Crypto Assets", region: "Global", return_ytd: 25.4 }
];