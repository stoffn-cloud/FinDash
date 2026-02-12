import { AssetClass, EnrichedAssetClass, EnrichedHolding, Currency } from "@/types";
import { calculateCurrencyExposure } from "./currencyEngine";

/**
 * Berekent de verdeling over Asset Classes (Aandelen, ETF's, etc.)
 * Inclusief de valuta-exposure per klasse.
 */
export const calculateClassAllocation = (
  dbAssetClasses: AssetClass[],
  dbCurrencies: Currency[],
  holdings: EnrichedHolding[],
  totalValue: number
): EnrichedAssetClass[] => {
  return dbAssetClasses.map((ac, idx) => {
    // Filter holdings voor deze specifieke klasse
    const holdingsInClass = holdings.filter(h => h.asset_classes_id === ac.asset_classes_id);
    const classValue = holdingsInClass.reduce((sum, h) => sum + h.marketValue, 0);

    return {
      ...ac,
      id: ac.asset_classes_id,
      name: ac.asset_class,
      current_value: classValue,
      allocation_percent: totalValue > 0 ? (classValue / totalValue) * 100 : 0,
      assets: holdingsInClass,
      // Hier hergebruiken we de currencyEngine voor een diepe analyse van deze klasse
      currencyExposure: calculateCurrencyExposure(dbCurrencies, holdingsInClass, classValue),
      // Dynamische kleuren voor de UI
      color: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][idx % 5],
    };
  }).filter(ac => ac.current_value > 0);
};