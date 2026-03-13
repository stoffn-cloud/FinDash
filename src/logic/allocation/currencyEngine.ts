import { Currency, EnrichedCurrency, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de blootstelling (Exposure) aan verschillende valuta's.
 * Dit laat zien in welke valuta je assets genoteerd staan in je portfolio.
 */
export const calculateCurrencyExposure = (
  dbCurrencies: Currency[] = [],     // Default naar lege array
  holdings: EnrichedHolding[] = [],  // Default naar lege array
  totalValue: number = 0
): EnrichedCurrency[] => {
  
  // 1. VEILIGHEIDSCHECK: Voorkom crashes bij ontbrekende valuta-data
  if (!dbCurrencies || !Array.isArray(dbCurrencies)) return [];

  return dbCurrencies
    .map(curr => {
      // 2. FILTER: Zoek holdings die in deze valuta genoteerd staan
      // We gebruiken (h as any) omdat de currencies_id uit de verrijkte Asset-data komt
      const holdingsInCurr = holdings.filter(h => 
        (h as any).currencies_id === curr.currencies_id
      );
      
      const valueInCurr = holdingsInCurr.reduce((sum, h) => sum + (h.marketValue || 0), 0);
      
      return {
        ...curr,
        id: curr.currencies_id,
        name: curr.full_name || curr.ISO_code,
        current_value: valueInCurr,
        // Gebruik de centrale helper voor de weging in het totaal
        allocation_percent: calcWeight(valueInCurr, totalValue)
      };
    })
    // 3. CLEANUP: Filter valuta's zonder posities en sorteer op grootte
    .filter(c => c.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);
};