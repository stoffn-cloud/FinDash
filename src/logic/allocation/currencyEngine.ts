import { Currency, EnrichedCurrency, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de blootstelling (Exposure) aan verschillende valuta's.
 * Dit laat zien in welke valuta je assets genoteerd staan.
 */
export const calculateCurrencyExposure = (
  dbCurrencies: Currency[],
  holdings: EnrichedHolding[],
  totalValue: number
): EnrichedCurrency[] => {
  return dbCurrencies
    .map(curr => {
      const holdingsInCurr = holdings.filter(h => h.currencies_id === curr.currencies_id);
      const valueInCurr = holdingsInCurr.reduce((sum, h) => sum + h.marketValue, 0);
      
      return {
        ...curr,
        id: curr.currencies_id,
        name: curr.full_name,
        current_value: valueInCurr,
        allocation_percent: calcWeight(valueInCurr, totalValue)
      };
    })
    .filter(c => c.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);
};