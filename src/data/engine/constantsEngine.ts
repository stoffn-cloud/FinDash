import { DefaultHolding, RawHolding, Asset } from "@/types";

/**
 * Vertaalt menselijke 'DefaultHoldings' naar machine-leesbare 'RawHoldings'.
 * Het zoekt de ticker_id op in de lijst met assets uit de database.
 */
export const translateDefaultToRaw = (
  defaultHoldings: DefaultHolding[],
  dbAssets: Asset[]
): RawHolding[] => {
  return defaultHoldings.map((def) => {
    // Zoek de asset in de database die matcht met de ticker string
    const asset = dbAssets.find((a) => a.ticker === def.ticker);

    if (!asset) {
      console.warn(`⚠️ Kon geen ticker_id vinden voor ticker: ${def.ticker}. Check je database.`);
    }

    return {
      ticker_id: asset?.ticker_id ?? 0, // Hier halen we het ID op
      quantity: def.quantity,
      purchase_price: def.purchasePrice ?? 0,
      purchase_date: def.purchaseDate,
    };
  });
};