import { 
  AssetSector, AssetIndustry, EnrichedHolding, 
  EnrichedAssetSector, EnrichedAssetIndustry 
} from "@/types";
import { calcWeight } from "../core/math";

/**
 * Lokale interfaces om de types uit te breiden zonder 'as any'.
 */
interface SectorResult extends EnrichedAssetSector {
  holding_count: number;
  color: string;
}

interface IndustryResult extends EnrichedAssetIndustry {
  allocation_total_percent: number;
  allocation_sector_percent: number;
  holding_count: number;
  color: string;
}

/**
 * Berekent de verdeling van de portfolio over Sectoren en Industrieën.
 */
export const calculateSectorAllocation = (
  dbSectors: AssetSector[] = [],
  dbIndustries: AssetIndustry[] = [],
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
): { sectorAllocation: SectorResult[], industryAllocation: IndustryResult[] } => {
  
  if (!dbSectors || !Array.isArray(dbSectors)) {
    return { sectorAllocation: [], industryAllocation: [] };
  }

  // 1. BEREKEN SECTOREN
  const sectorAllocation: SectorResult[] = dbSectors
    .map((sec, idx) => {
      // Gebruik Number() voor veilige ID vergelijking en snake_case asset_sectors_id
      const holdingsInSector = holdings.filter(
        (h) => Number(h.asset_sectors_id) === Number(sec.asset_sectors_id)
      );
      
      const sectorValue = holdingsInSector.reduce(
        (sum, h) => sum + (Number(h.market_value) || 0), 
        0
      );
      
      return {
        ...sec,
        id: sec.asset_sectors_id,
        name: sec.GICS_name || "Unknown Sector",
        current_value: sectorValue,
        allocation_percent: calcWeight(sectorValue, totalValue),
        holding_count: holdingsInSector.length,
        color: `hsl(${(idx * 137.5) % 360}, 65%, 50%)` 
      } as SectorResult;
    })
    .filter(s => s.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  // 2. BEREKEN INDUSTRIEËN
  const safeIndustries = Array.isArray(dbIndustries) ? dbIndustries : [];
  
  const industryAllocation: IndustryResult[] = safeIndustries
    .map((ind) => {
      const holdingsInInd = holdings.filter(
        (h) => Number(h.asset_industries_id) === Number(ind.asset_industries_id)
      );
      
      const indValue = holdingsInInd.reduce(
        (sum, h) => sum + (Number(h.market_value) || 0), 
        0
      );
      
      // Zoek de bovenliggende sector op voor relatieve weging
      const parentSector = sectorAllocation.find(
        (s) => Number(s.id) === Number(ind.asset_sectors_id)
      );
      
      return {
        ...ind,
        id: ind.asset_industries_id,
        name: ind.description || "Unknown Industry",
        current_value: indValue,
        allocation_percent: calcWeight(indValue, totalValue), // Standaard veld uit interface
        allocation_total_percent: calcWeight(indValue, totalValue),
        allocation_sector_percent: calcWeight(indValue, parentSector?.current_value ?? 0),
        holding_count: holdingsInInd.length,
        color: "#94A3B8"
      } as IndustryResult;
    })
    .filter(i => i.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  return { sectorAllocation, industryAllocation };
};