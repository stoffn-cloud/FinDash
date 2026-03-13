import { Market, EnrichedMarket, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de verdeling van de portefeuille over de verschillende aandelenmarkten.
 * Bevat fallbacks voor undefined data om runtime crashes te voorkomen.
 */
export const calculateMarketAllocation = (
  dbMarkets: Market[] = [],       // Default naar lege array
  holdings: EnrichedHolding[] = [], // Default naar lege array
  totalValue: number = 0
): EnrichedMarket[] => {
  
  // 1. VEILIGHEIDSCHECK: Voorkom .map() op undefined
  if (!dbMarkets || !Array.isArray(dbMarkets)) return [];

  return dbMarkets
    .map((m, idx) => {
      // 2. FILTER: Zoek holdings in deze markt.
      // We gebruiken (h as any) omdat markets_id uit de verrijkte Asset-data komt.
      const holdingsInMarket = holdings.filter(
        (h) => (h as any).markets_id === m.markets_id
      );

      // 3. REDUCE: Bereken de totale marktwaarde voor deze beurs
      const marketValue = holdingsInMarket.reduce(
        (sum, h) => sum + (h.marketValue || 0), 
        0
      );

      return {
        ...m,
        id: m.markets_id,
        name: m.full_name || "Unknown Exchange",
        current_value: marketValue,
        // Gebruik de centrale helper voor consistentie
        allocation_percent: calcWeight(marketValue, totalValue),
        holding_count: holdingsInMarket.length,
        // Blauw-getinte dynamische kleuren voor een professionele look
        color: `hsl(210, 70%, ${30 + (idx * 10) % 40}%)` 
      };
    })
    // 4. CLEANUP: Verwijder markten zonder posities en sorteer op grootte
    .filter((market) => market.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);
};