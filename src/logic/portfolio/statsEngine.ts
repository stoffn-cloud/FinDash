import { EnrichedAsset, EnrichedHolding, AssetSector, PortfolioStats } from "@/types";

/**
 * Berekent de samenvattende statistieken voor het portfolio dashboard.
 */
export const calculateStats = (
  enrichedAssets: EnrichedAsset[],
  holdings: EnrichedHolding[],
  dbSectors: AssetSector[]
): PortfolioStats => {
  
  // We kijken alleen naar assets die je daadwerkelijk in bezit hebt
  const activeHoldings = holdings.filter(h => h.quantity > 0);

  return {
    // Totaal aantal unieke posities
    total_assets: activeHoldings.length,

    // Gebruik een Set voor het tellen van unieke ID's (geen dubbelingen)
    unique_markets: new Set(activeHoldings.map(h => h.markets_id)).size,
    
    unique_asset_classes: new Set(activeHoldings.map(h => h.asset_classes_id)).size,
    
    // Sectoren tellen we op basis van de actieve holdings
    unique_sectors: new Set(activeHoldings.map(h => h.asset_sectors_id)).size,

    // Specifieke instrument-types tellen op basis van de 'is_tracker' flag
    tracker_count: activeHoldings.filter(h => h.is_tracker).length,
    
    stock_count: activeHoldings.filter(h => !h.is_tracker).length,
  };
};