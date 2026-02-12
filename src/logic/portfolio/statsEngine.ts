import { EnrichedAsset, EnrichedHolding, AssetSector, PortfolioStats } from "@/types";

/**
 * Berekent de samenvattende statistieken en KPI's voor het dashboard.
 */
export const calculateStats = (
  enrichedAssets: EnrichedAsset[],
  holdings: EnrichedHolding[],
  dbSectors: AssetSector[]
): PortfolioStats => {
  
  const activeHoldings = holdings.filter(h => h.quantity > 0);
  
  // 1. Financiële aggregaten
  const totalValue = activeHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCost = activeHoldings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // 2. Winnaars en Verliezers (Top Performer)
  // We sorteren op PnL percentage om de beste asset te vinden
  const sortedByPerformance = [...activeHoldings].sort((a, b) => b.pnlPercentage - a.pnlPercentage);
  const topPerformer = sortedByPerformance[0] || null;

  // 3. Diversificatie check (Herfindahl-Hirschman Index - HHI principe)
  // Hoe hoger de concentratie in één aandeel, hoe lager de diversificatie-score.
  const maxWeight = activeHoldings.length > 0 
    ? Math.max(...activeHoldings.map(h => (h.marketValue / totalValue) * 100)) 
    : 0;

  return {
    // Tellinge (Jouw originele logica)
    total_assets: activeHoldings.length,
    unique_markets: new Set(activeHoldings.map(h => h.markets_id)).size,
    unique_asset_classes: new Set(activeHoldings.map(h => h.asset_classes_id)).size,
    unique_sectors: new Set(activeHoldings.map(h => h.asset_sectors_id)).size,
    tracker_count: activeHoldings.filter(h => h.is_tracker).length,
    stock_count: activeHoldings.filter(h => !h.is_tracker).length,

    // Financiële KPI's (Nieuw)
    total_value: totalValue,
    total_pnl_absolute: totalPnL,
    total_pnl_percent: totalPnLPercent,
    
    // Performance insights
    top_performer_name: topPerformer ? topPerformer.full_name : "N/A",
    top_performer_ticker: topPerformer ? topPerformer.ticker : "",
    top_performer_pct: topPerformer ? topPerformer.pnlPercentage : 0,

    // Risico indicator
    concentration_risk: maxWeight > 25 ? 'High' : maxWeight > 10 ? 'Medium' : 'Low',
    highest_holding_weight: maxWeight
  };
};