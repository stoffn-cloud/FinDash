import { Market, EnrichedMarket, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * We definiëren precies wat de Engine teruggeeft.
 * Dit voorkomt dat we 'any' moeten gebruiken.
 */
export type MarketAllocationResult = EnrichedMarket & {
  holding_count: number;
  color: string;
};

export const calculateMarketAllocation = (
  dbMarkets: Market[] = [],
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
): MarketAllocationResult[] => {
  
  if (!dbMarkets || !Array.isArray(dbMarkets)) return [];

  return dbMarkets
    .map((m, idx) => {
      const holdingsInMarket = holdings.filter(
        (h) => Number(h.markets_id) === Number(m.markets_id)
      );

      const marketValue = holdingsInMarket.reduce(
        (sum, h) => sum + (Number(h.market_value) || 0), 
        0
      );

      // Hier bouwen we het object zonder 'any'
      const result: MarketAllocationResult = {
        ...m,
        id: m.markets_id,
        // We gebruiken alleen velden die gegarandeerd in het Market type zitten
        name: m.full_name || m.markets_abbreviation || "Unknown Exchange",
        current_value: marketValue,
        allocation_percent: calcWeight(marketValue, totalValue),
        holding_count: holdingsInMarket.length,
        color: `hsl(217, 91%, ${30 + (idx * 8) % 40}%)` 
      };

      return result;
    })
    .filter((market) => market.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);
};