import { deafaultPortfolio } from "../data/constants/defaultPortfolio";
import { PortfolioItem, EnrichedHolding } from "../types";

export const getEnrichedHoldings = (dbMetadata: PortfolioItem[]): EnrichedHolding[] => {
  return deafaultPortfolio.map((holding) => {
    const sqlMatch = dbMetadata.find((m) => m.ticker === holding.ticker);

    // Haal de prijs uit SQL
    const priceFromSql = sqlMatch?.price ?? 0;

    // Bereken de waarden met de namen die je interface verwacht
    const marketValue = holding.quantity * priceFromSql;
    const costBasis = holding.quantity * (holding.purchasePrice ?? 0);

    return {
      ...(sqlMatch as PortfolioItem), // Metadata uit SQL
      ...holding,                    // Jouw quantity, ticker, etc.
      
      // Gebruik hier de exacte namen uit je EnrichedHolding interface:
      currentPrice: priceFromSql,    
      marketValue: marketValue,
      costBasis: costBasis
    } as EnrichedHolding;
  });
};