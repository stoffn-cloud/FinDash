import { EnrichedAsset, EnrichedHolding, AssetSector, PortfolioStats } from "@/types";

/**
 * Berekent de samenvattende statistieken en KPI's voor het dashboard.
 * Gebruikt strikt de genormaliseerde data uit de voorgaande engine-stappen.
 */
export const calculateStats = (
  enrichedAssets: EnrichedAsset[],
  holdings: EnrichedHolding[],
  dbSectors: AssetSector[]
): PortfolioStats => {
  
  // Filter holdings die daadwerkelijk een positie hebben
  const activeHoldings = holdings.filter(h => (h.quantity || 0) > 0);
  
  // 1. Financiële aggregaten (Gebruik gegarandeerde snake_case numbers)
  const totalValue = activeHoldings.reduce((sum, h) => sum + (h.market_value || 0), 0);
  const totalCost = activeHoldings.reduce((sum, h) => sum + (h.cost_basis || 0), 0);
  
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // 2. Performance insights 
  // We sorteren op de berekende pnl_percentage uit de holdingsEngine
  const sortedByPerformance = [...activeHoldings].sort((a, b) => 
    (b.pnl_percentage || 0) - (a.pnl_percentage || 0)
  );
  const topPerformer = sortedByPerformance[0] || null;

  // 3. Risico & Diversificatie
  const maxWeight = totalValue > 0 
    ? Math.max(...activeHoldings.map(h => ((h.market_value || 0) / totalValue) * 100)) 
    : 0;

  // 4. Unieke tellingen (Gebruik de IDs uit de verrijkte data)
  const uniqueMarkets = new Set(activeHoldings.map(h => h.markets_id)).size;
  const uniqueClasses = new Set(activeHoldings.map(h => h.asset_classes_id)).size;
  
  // Sectoren kunnen via asset_sectors_id of sectors_id binnenkomen
  const uniqueSectors = new Set(
    activeHoldings
      .map(h => h.asset_sectors_id || (h as any).sectors_id)
      .filter(id => id !== undefined && id !== null && id !== 0)
  ).size;

  return {
    // Tellingen
    total_assets: activeHoldings.length,
    unique_markets: uniqueMarkets,
    unique_asset_classes: uniqueClasses,
    unique_sectors: uniqueSectors,

    // Tracker vs Stock ratio
    tracker_count: activeHoldings.filter(h => h.is_tracker).length,
    stock_count: activeHoldings.filter(h => !h.is_tracker).length,

    // Financiële KPI's (Hoofdgetallen voor de tiles)
    total_value: totalValue,
    total_pnl_absolute: totalPnL,
    total_pnl_percent: totalPnLPercent,
    
    // Top Performer
    top_performer_ticker: topPerformer ? (topPerformer.ticker || topPerformer.symbol || "") : "N/A",
    top_performer_pct: topPerformer ? (topPerformer.pnl_percentage || 0) : 0,

    // Risico indicator
    concentration_risk: maxWeight > 25 ? 'High' : maxWeight > 10 ? 'Medium' : 'Low',
    highest_holding_weight: maxWeight
  };
};