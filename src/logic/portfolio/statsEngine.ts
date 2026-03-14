import { EnrichedAsset, EnrichedHolding, AssetSector, PortfolioStats } from "@/types";

/**
 * Berekent de samenvattende statistieken en KPI's voor het dashboard.
 * FIX: Alle velden omgezet naar snake_case conform de nieuwe EnrichedHolding interface.
 */
export const calculateStats = (
  enrichedAssets: EnrichedAsset[],
  holdings: EnrichedHolding[],
  dbSectors: AssetSector[]
): PortfolioStats => {
  
  const activeHoldings = holdings.filter(h => h.quantity > 0);
  
  // 1. Financiële aggregaten (Gebruik snake_case velden)
  const totalValue = activeHoldings.reduce((sum, h) => sum + (h.market_value || 0), 0);
  const totalCost = activeHoldings.reduce((sum, h) => sum + (h.cost_basis || 0), 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // 2. Performance insights (pnl_percentage ipv pnlPercentage)
  const sortedByPerformance = [...activeHoldings].sort((a, b) => (b.pnl_percentage || 0) - (a.pnl_percentage || 0));
  const topPerformer = sortedByPerformance[0] || null;

  // 3. Diversificatie check (market_value ipv marketValue)
  const maxWeight = totalValue > 0 
    ? Math.max(...activeHoldings.map(h => ((h.market_value || 0) / totalValue) * 100)) 
    : 0;

  return {
    // Tellingen
    total_assets: activeHoldings.length,
    
    unique_markets: new Set(activeHoldings.map(h => (h as any).markets_id)).size,
    unique_asset_classes: new Set(activeHoldings.map(h => (h as any).asset_classes_id)).size,
    
    unique_sectors: new Set(
      activeHoldings
        .map(h => (h as any).sectors_id || (h as any).asset_sectors_id)
        .filter(id => id !== undefined && id !== null)
    ).size,

    tracker_count: activeHoldings.filter(h => h.is_tracker).length,
    stock_count: activeHoldings.filter(h => !h.is_tracker).length,

    // Financiële KPI's
    total_value: totalValue,
    total_pnl_absolute: totalPnL,
    total_pnl_percent: totalPnLPercent,
    
    // Top Performer (FIX: Verwijder velden die niet in PortfolioStats interface staan)
    top_performer_ticker: topPerformer ? (topPerformer as any).ticker || "" : "",
    top_performer_pct: topPerformer ? (topPerformer.pnl_percentage || 0) : 0,

    // Risico indicator
    concentration_risk: maxWeight > 25 ? 'High' : maxWeight > 10 ? 'Medium' : 'Low',
    highest_holding_weight: maxWeight
  };
};