import { RawHolding, EnrichedAsset, EnrichedHolding } from "@/types";

/**
 * Dit vervangt de oude getEnrichedHoldings.
 * Het koppelt de defaultPortfolio (RawHolding) aan de reeds verrijkte assets.
 */
export const enrichUserHoldings = (
  userHoldings: RawHolding[],
  enrichedAssets: EnrichedAsset[]
): EnrichedHolding[] => {
  return userHoldings.map((holding) => {
    // We zoeken nu in enrichedAssets (waar de prijs al in zit!)
    const assetMetadata = enrichedAssets.find((a) => a.ticker === holding.ticker);
    
    const currentPrice = assetMetadata?.current_price ?? 0;
    const marketValue = holding.quantity * currentPrice;
    const costBasis = holding.quantity * (holding.purchasePrice ?? 0);

    return {
      ...(assetMetadata as EnrichedAsset),
      quantity: holding.quantity,
      purchaseDate: holding.purchaseDate,
      purchasePrice: holding.purchasePrice,
      currentPrice, // komt overeen met je interface
      marketValue,
      costBasis,
      gainLoss: marketValue - costBasis,
      gainLossPercent: costBasis > 0 ? ((marketValue - costBasis) / costBasis) * 100 : 0
    };
  });
};