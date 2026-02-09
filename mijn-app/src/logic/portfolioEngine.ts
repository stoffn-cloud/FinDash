// src/logic/portfolioEngine.ts
import { DefaultHolding } from "../data/constants/defaultPortfolio";
import { PortfolioItem, EnrichedHolding, Portfolio } from "../types";

/**
 * Berekent de status van de default portfolio op een specifieke snapshot datum.
 */
export const buildSnapshotPortfolio = (
  dbMetadata: PortfolioItem[], // De prijzen en info uit SQL voor 31-01-2025
  snapshotDate: string = '2025-01-31'
): EnrichedHolding[] => {
  
  return DEFAULT_PORTFOLIO.map(holding => {
    // 1. Zoek de prijs en info in de SQL data voor deze ticker
    const sqlMatch = dbMetadata.find(m => m.ticker === holding.ticker);

    // 2. Pak de prijs (we gaan ervan uit dat je SQL query de prijs van 31 jan geeft)
    const priceAtSnapshot = (sqlMatch as any)?.price || 0;
    
    // 3. De berekening: Hoeveelheid (constant) * Prijs op die datum (SQL)
    const valueAtSnapshot = holding.quantity * priceAtSnapshot;

    return {
      ...(sqlMatch as PortfolioItem),
      ticker: holding.ticker,
      quantity: holding.quantity,
      purchaseDate: holding.purchaseDate,
      purchasePrice: holding.purchasePrice,
      price: priceAtSnapshot,
      value: valueAtSnapshot,
    } as EnrichedHolding;
  });
};