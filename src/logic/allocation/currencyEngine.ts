import { Currency, EnrichedCurrency, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de blootstelling (Exposure) aan verschillende valuta's.
 * Helpt bij het in kaart brengen van het wisselkoersrisico.
 */
export const calculateCurrencyExposure = (
  dbCurrencies: Currency[] = [],
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
): EnrichedCurrency[] => {
  
  // 1. VEILIGHEIDSCHECK
  if (!dbCurrencies || !Array.isArray(dbCurrencies) || dbCurrencies.length === 0) {
    return [];
  }

  return dbCurrencies
    .map((curr) => {
      // 2. FILTER: Match holdings op currencies_id
      // Omdat de holding verrijkt is, zit currencies_id direct in het object
      const holdingsInCurr = holdings.filter(
        (h) => Number(h.currencies_id) === Number(curr.currencies_id)
      );
      
      // 3. AGGREGATIE: Gebruik de snake_case market_value
      const valueInCurr = holdingsInCurr.reduce(
        (sum, h) => sum + (Number(h.market_value) || 0), 
        0
      );
      
      return {
        ...curr,
        // UI Helpers voor consistentie met andere engines
        id: curr.currencies_id,
        name: curr.full_name || curr.ISO_code,
        code: curr.ISO_code,
        current_value: valueInCurr,
        
        // 4. WEGING: Bereken het percentage t.o.v. de meegegeven totalValue
        // Merk op: als totalValue de waarde van een AssetClass is, krijg je de mix BINNEN die klasse.
        allocation_percent: calcWeight(valueInCurr, totalValue),
        
        // Optioneel: voeg vlag-iconen of kleuren toe op basis van ISO code
        color: curr.ISO_code === 'USD' ? '#22C55E' : curr.ISO_code === 'EUR' ? '#3B82F6' : '#94A3B8'
      } as EnrichedCurrency;
    })
    // 5. CLEANUP: Toon alleen valuta's waar je daadwerkelijk geld in hebt zitten
    .filter((c) => c.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);
};