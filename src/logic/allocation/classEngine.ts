import { 
  AssetClass, 
  EnrichedAssetClass, 
  EnrichedHolding, 
  Currency 
} from "@/types";
import { calculateCurrencyExposure } from "./currencyEngine";
import { calcWeight } from "../core/math";

// Kleurenpalet voor consistente UI
const CLASS_COLORS: Record<string, string> = {
  'Equity': '#3B82F6',        // Blue
  'Fixed Income': '#10B981', // Emerald
  'Cash': '#64748B',         // Slate
  'Crypto': '#F59E0B',       // Amber
  'Commodities': '#8B5CF6',  // Violet
  'Real Estate': '#EC4899',  // Pink
  'Default': '#94A3B8'       // Fallback
};

/**
 * Berekent de verdeling over Asset Classes.
 */
export const calculateClassAllocation = (
  dbAssetClasses: AssetClass[] = [],
  dbCurrencies: Currency[] = [],
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
): EnrichedAssetClass[] => {
  
  if (!dbAssetClasses || !Array.isArray(dbAssetClasses) || dbAssetClasses.length === 0) {
    return [];
  }

  return dbAssetClasses
    .map((ac) => {
      // 1. Filter holdings die tot deze klasse behoren
      const holdingsInClass = holdings.filter(
        (h) => Number(h.asset_classes_id) === Number(ac.asset_classes_id)
      );

      // 2. Bereken totale waarde voor deze klasse (gebruik snake_case!)
      const classValue = holdingsInClass.reduce(
        (sum, h) => sum + (Number(h.market_value) || 0), 
        0
      );

      // 3. Bepaal kleur op basis van naam of fallback
      const color = CLASS_COLORS[ac.asset_class] || CLASS_COLORS.Default;

      return {
        ...ac,
        id: ac.asset_classes_id,
        name: ac.asset_class,
        current_value: classValue,
        
        // Gebruik je centrale math helper
        allocation_percent: calcWeight(classValue, totalValue),
        
        assets: holdingsInClass,
        
        // Valuta-mix binnen deze klasse
        currency_exposure: calculateCurrencyExposure(
          dbCurrencies, 
          holdingsInClass, 
          classValue
        ),
        
        color: color,
      } as EnrichedAssetClass;
    })
    // 4. Filter klassen zonder waarde (houdt de UI schoon)
    .filter(ac => ac.current_value > 0)
    // 5. Sorteer van groot naar klein voor de Pie Chart/Lijst
    .sort((a, b) => b.current_value - a.current_value);
};