import { Market, EnrichedMarket, EnrichedHolding } from "@/types";

/**
 * Berekent de verdeling van de portefeuille over de verschillende aandelenmarkten/beurzen.
 */
export const calculateMarketAllocation = (
  dbMarkets: Market[],
  holdings: EnrichedHolding[],
  totalValue: number
): EnrichedMarket[] => {
  return dbMarkets
    .map((m) => {
      // Filter alle holdings die genoteerd staan op deze specifieke markt
      const holdingsInMarket = holdings.filter(
        (h) => h.markets_id === m.markets_id
      );

      // Bereken de totale waarde op deze beurs
      const marketValue = holdingsInMarket.reduce(
        (sum, h) => sum + h.marketValue, 
        0
      );

      return {
        ...m,
        id: m.markets_id,
        name: m.full_name,
        current_value: marketValue,
        allocation_percent: totalValue > 0 ? (marketValue / totalValue) * 100 : 0,
        holding_count: holdingsInMarket.length,
      };
    })
    // Verwijder markten waar je momenteel niets in bezit hebt (houdt de UI clean)
    .filter((market) => market.current_value > 0)
    // Sorteer van grootste naar kleinste weging
    .sort((a, b) => b.current_value - a.current_value);
};