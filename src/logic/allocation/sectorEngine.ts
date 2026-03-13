import { 
  AssetSector, AssetIndustry, EnrichedHolding, 
  EnrichedAssetSector, EnrichedAssetIndustry 
} from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de verdeling van de portfolio over Sectoren en Industrieën.
 * Inclusief veiligheidschecks om crashes bij ontbrekende data te voorkomen.
 */
export const calculateSectorAllocation = (
  dbSectors: AssetSector[] = [],    // Default naar lege array
  dbIndustries: AssetIndustry[] = [], // Default naar lege array
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
) => {
  // 1. VEILIGHEIDSCHECK: Voorkom .map() op undefined/null
  if (!dbSectors || !Array.isArray(dbSectors)) {
    return { sectorAllocation: [], industryAllocation: [] };
  }

  // 2. BEREKEN SECTOREN
  const sectorAllocation: EnrichedAssetSector[] = dbSectors
    .map((sec, idx) => {
      // Filter holdings die bij deze sector horen. 
      // We gebruiken 'as any' omdat de sector_id uit de verrijkte Asset-data komt.
      const holdingsInSector = holdings.filter(h => 
        (h as any).asset_sectors_id === sec.asset_sectors_id
      );
      
      const sectorValue = holdingsInSector.reduce((sum, h) => sum + (h.marketValue || 0), 0);
      
      return {
        ...sec,
        id: sec.asset_sectors_id,
        name: sec.GICS_name || "Unknown Sector",
        current_value: sectorValue,
        allocation_percent: calcWeight(sectorValue, totalValue),
        holding_count: holdingsInSector.length,
        // Dynamische kleur voor de donut chart (gulden snede spreiding)
        color: `hsl(${(idx * 137.5) % 360}, 65%, 50%)` 
      };
    })
    .filter(s => s.current_value > 0) // Alleen actieve sectoren tonen
    .sort((a, b) => b.current_value - a.current_value);

  // 3. BEREKEN INDUSTRIEËN (Gedetailleerder niveau)
  const safeIndustries = Array.isArray(dbIndustries) ? dbIndustries : [];
  
  const industryAllocation: EnrichedAssetIndustry[] = safeIndustries
    .map((ind) => {
      // Filter holdings die bij deze industrie horen
      const holdingsInInd = holdings.filter(h => 
        (h as any).asset_industries_id === ind.asset_industries_id
      );
      
      const indValue = holdingsInInd.reduce((sum, h) => sum + (h.marketValue || 0), 0);
      
      // Zoek de bovenliggende sector op voor relatieve weging binnen de sector
      const parentSector = sectorAllocation.find(s => s.id === ind.asset_sectors_id);
      
      return {
        ...ind,
        id: ind.asset_industries_id,
        name: ind.description || "Unknown Industry",
        current_value: indValue,
        allocation_total_percent: calcWeight(indValue, totalValue),
        allocation_sector_percent: calcWeight(indValue, parentSector?.current_value ?? 0),
        holding_count: holdingsInInd.length,
        color: "#94A3B8" // Neutrale kleur voor sub-levels
      };
    })
    .filter(i => i.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  return { sectorAllocation, industryAllocation };
};