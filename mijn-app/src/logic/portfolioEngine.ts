import { deafaultPortfolio } from "../data/constants/defaultPortfolio";
import { PortfolioItem, EnrichedHolding, Portfolio } from "../types";

export const calculatePortfolioSnapshot = (
  dbMetadata: PortfolioItem[],
  snapshotDate: string = '2025-01-31'
): Portfolio => {
  
  const enrichedHoldings: EnrichedHolding[] = deafaultPortfolio.map((holding) => {
    const sqlMatch = dbMetadata.find((m) => m.ticker === holding.ticker);

    const priceAtSnapshot = sqlMatch?.price ?? 0;
    
    // We berekenen hier de velden die jouw type 'EnrichedHolding' verplicht stelt
    const marketValue = holding.quantity * priceAtSnapshot;
    const costBasis = holding.quantity * (holding.purchasePrice ?? 0);

    return {
      // 1. Haal alle metadata uit SQL binnen (full_name, sector, etc.)
      ...(sqlMatch as PortfolioItem), 
      
      // 2. Voeg de velden uit de default portfolio toe
      ticker: holding.ticker,
      quantity: holding.quantity,
      purchaseDate: holding.purchaseDate,
      purchasePrice: holding.purchasePrice,

      // 3. Match de namen exact met jouw EnrichedHolding interface
      currentPrice: priceAtSnapshot,
      marketValue: marketValue,
      costBasis: costBasis,
    } as EnrichedHolding;
  });

  // 4. Bereken de totale waarde met de juiste property naam: 'marketValue'
  const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.marketValue, 0);

  return {
    id: "default-portfolio-snapshot",
    name: "Mijn Portfolio",
    holdings: enrichedHoldings,
    totalValue: totalValue,
    lastUpdated: snapshotDate
  };
};