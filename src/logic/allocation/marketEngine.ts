import { Market, EnrichedMarket, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de verdeling van de portefeuille over de verschillende aandelenmarkten.
 */
export const calculateMarketAllocation = (
  dbMarkets: Market[],
  holdings: EnrichedHolding[],
  totalValue: number
): EnrichedMarket[] => {
  return dbMarkets
    .map((m, idx) => {
      const holdingsInMarket = holdings.filter(
        (h) => h.markets_id === m.markets_id
      );

      const marketValue = holdingsInMarket.reduce(
        (sum, h) => sum + h.marketValue, 
        0
      );

      return {
        ...m,
        id: m.markets_id,
        name: m.full_name,
        current_value: marketValue,
        // Gebruik de centrale helper voor consistentie
        allocation_percent: calcWeight(marketValue, totalValue),
        holding_count: holdingsInMarket.length,
        // Voeg een dynamische kleur toe voor je charts
        color: `hsl(210, 70%, ${30 + (idx * 15) % 50}%)` 
      };
    })
    .filter((market) => market.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);
};