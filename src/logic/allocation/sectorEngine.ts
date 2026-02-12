import { AssetSector, AssetIndustry, EnrichedHolding, EnrichedAssetSector, EnrichedAssetIndustry } from "@/types";

export const calculateSectorAllocation = (
  dbSectors: AssetSector[],
  dbIndustries: AssetIndustry[],
  holdings: EnrichedHolding[],
  totalValue: number
) => {
  const sectorAllocation: EnrichedAssetSector[] = dbSectors.map((sec, idx) => {
    const holdingsInSector = holdings.filter(h => h.asset_sectors_id === sec.asset_sectors_id);
    const sectorValue = holdingsInSector.reduce((sum, h) => sum + h.marketValue, 0);
    return {
      ...sec,
      id: sec.asset_sectors_id,
      name: sec.GICS_name,
      current_value: sectorValue,
      allocation_percent: totalValue > 0 ? (sectorValue / totalValue) * 100 : 0,
      holding_count: holdingsInSector.length,
      color: ["#6366F1", "#EC4899", "#8B5CF6"][idx % 3]
    };
  }).filter(s => s.current_value > 0);

  const industryAllocation: EnrichedAssetIndustry[] = dbIndustries.map((ind) => {
    const holdingsInInd = holdings.filter(h => h.asset_industries_id === ind.asset_industries_id);
    const indValue = holdingsInInd.reduce((sum, h) => sum + h.marketValue, 0);
    const parentSector = sectorAllocation.find(s => s.id === ind.asset_sectors_id);
    
    return {
      ...ind,
      id: ind.asset_industries_id,
      name: ind.description,
      current_value: indValue,
      allocation_total_percent: totalValue > 0 ? (indValue / totalValue) * 100 : 0,
      allocation_sector_percent: (parentSector?.current_value ?? 0) > 0 ? (indValue / parentSector!.current_value) * 100 : 0,
      holding_count: holdingsInInd.length,
      color: "#94A3B8"
    };
  }).filter(i => i.current_value > 0);

  return { sectorAllocation, industryAllocation };
};