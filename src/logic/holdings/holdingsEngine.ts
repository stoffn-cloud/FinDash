import { RawHolding, EnrichedAsset, EnrichedHolding } from "@/types";
import { calcPnL } from "../core/math";

/**
 * Koppelt je transacties aan de reeds verrijkte assets.
 */
export const enrichUserHoldings = (
  userHoldings: RawHolding[],
  enrichedAssets: EnrichedAsset[]
): EnrichedHolding[] => {
  return userHoldings.map((holding) => {
    // 1. Zoek op ID
    const asset = enrichedAssets.find((a) => a.ticker_id === holding.ticker_id);
    
    // 2. Berekeningen
    const currentPrice = asset?.current_price ?? 0;
    const marketValue = holding.quantity * currentPrice;
    
    // We gebruiken purchase_price uit de RawHolding (input)
    const avgPrice = holding.purchase_price ?? 0;
    const costBasis = holding.quantity * avgPrice;

    // 3. PnL
    const { absolute, percentage } = calcPnL(marketValue, costBasis);

    // We bouwen het object op zodat het EXACT matcht met de EnrichedHolding interface
    return {
      ...(asset as EnrichedAsset), 
      
      // Persoonlijke data (Let op: snake_case velden!)
      total_quantity: holding.quantity, // Matcht met EnrichedAsset interface
      purchase_date: holding.purchase_date,
      purchase_price: avgPrice,
      
      // Berekende velden voor de UI
      marketValue,
      costBasis,
      pnlAbsolute: absolute,
      pnlPercentage: percentage,
      
      // Extra veld nodig voor EnrichedHolding interface
      weight: 0 
    };
  });
};