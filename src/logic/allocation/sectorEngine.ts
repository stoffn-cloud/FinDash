import { 
  AssetSector, AssetIndustry, EnrichedHolding, 
  EnrichedAssetSector, EnrichedAssetIndustry 
} from "@/types";
import { calcWeight } from "../core/math";

export const calculateSectorAllocation = (
  dbSectors: AssetSector[],
  dbIndustries: AssetIndustry[],
  holdings: EnrichedHolding[],
  totalValue: number
) => {
  // 1. Bereken Sectoren
  const sectorAllocation: EnrichedAssetSector[] = dbSectors.map((sec, idx) => {
    const holdingsInSector = holdings.filter(h => h.asset_sectors_id === sec.asset_sectors_id);
    const sectorValue = holdingsInSector.reduce((sum, h) => sum + h.marketValue, 0);
    
    return {
      ...sec,
      id: sec.asset_sectors_id,
      name: sec.GICS_name,
      current_value: sectorValue,
      allocation_percent: calcWeight(sectorValue, totalValue),
      holding_count: holdingsInSector.length,
      // Uitgebreider palet of dynamische kleur
      color: `hsl(${(idx * 137.5) % 360}, 70%, 50%)` 
    };
  }).filter(s => s.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  // 2. Bereken Industrieën (genest onder sectoren)
  const industryAllocation: EnrichedAssetIndustry[] = dbIndustries.map((ind) => {
    const holdingsInInd = holdings.filter(h => h.asset_industries_id === ind.asset_industries_id);
    const indValue = holdingsInInd.reduce((sum, h) => sum + h.marketValue, 0);
    const parentSector = sectorAllocation.find(s => s.id === ind.asset_sectors_id);
    
    return {
      ...ind,
      id: ind.asset_industries_id,
      name: ind.description,
      current_value: indValue,
      allocation_total_percent: calcWeight(indValue, totalValue),
      allocation_sector_percent: calcWeight(indValue, parentSector?.current_value ?? 0),
      holding_count: holdingsInInd.length,
      color: "#94A3B8"
    };
  }).filter(i => i.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  return { sectorAllocation, industryAllocation };
};