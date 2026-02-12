import { AssetClass, EnrichedAssetClass, EnrichedHolding, Currency } from "@/types";
import { calculateCurrencyExposure } from "./currencyEngine";
import { calcWeight } from "../core/math";

/**
 * Berekent de verdeling over Asset Classes (Equity, Fixed Income, etc.)
 * Inclusief de valuta-exposure per klasse.
 */
export const calculateClassAllocation = (
  dbAssetClasses: AssetClass[],
  dbCurrencies: Currency[],
  holdings: EnrichedHolding[],
  totalValue: number
): EnrichedAssetClass[] => {
  return dbAssetClasses
    .map((ac, idx) => {
      // 1. Filter holdings voor deze specifieke klasse
      const holdingsInClass = holdings.filter(h => h.asset_classes_id === ac.asset_classes_id);
      const classValue = holdingsInClass.reduce((sum, h) => sum + h.marketValue, 0);

      return {
        ...ac,
        id: ac.asset_classes_id,
        name: ac.asset_class,
        current_value: classValue,
        // Gebruik de centrale helper
        allocation_percent: calcWeight(classValue, totalValue),
        assets: holdingsInClass,
        // Diepe analyse: wat is de valuta-mix binnen deze specifieke Asset Class?
        currencyExposure: calculateCurrencyExposure(dbCurrencies, holdingsInClass, classValue),
        // Dynamische kleuren (of behoud je eigen palet)
        color: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][idx % 5],
      };
    })
    .filter(ac => ac.current_value > 0)
    // Sortering toevoegen voor een rustige UI
    .sort((a, b) => b.current_value - a.current_value);
};