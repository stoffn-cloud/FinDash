import { Currency, EnrichedCurrency, EnrichedHolding } from "@/types";

/**
 * Berekent de blootstelling aan verschillende valuta's.
 */
export const calculateCurrencyExposure = (
  dbCurrencies: Currency[],
  holdings: EnrichedHolding[],
  totalValue: number
): EnrichedCurrency[] => {
  return dbCurrencies.map(curr => {
    // Filter holdings die deze valuta gebruiken
    const holdingsInCurr = holdings.filter(h => h.currencies_id === curr.currencies_id);
    const valueInCurr = holdingsInCurr.reduce((sum, h) => sum + h.marketValue, 0);
    
    return {
      ...curr,
      id: curr.currencies_id,
      name: curr.full_name,
      current_value: valueInCurr,
      allocation_percent: totalValue > 0 ? (valueInCurr / totalValue) * 100 : 0
    };
  }).filter(c => c.current_value > 0);
};