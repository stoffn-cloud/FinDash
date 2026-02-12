import { Asset, EnrichedAsset, EnrichedHolding, RawHolding, OHLCVHistory } from "@/types";

export const enrichAssets = (
  dbAssets: Asset[],
  prices: OHLCVHistory[],
  dbMarkets: any[],
  dbClasses: any[],
  dbCurrencies: any[],
  dbIndustries: any[],
  dbCountries: any[]
): EnrichedAsset[] => {
  return dbAssets.map(asset => {
    const priceData = prices.find(p => p.ticker_id === asset.ticker_id);
    const market = dbMarkets.find(m => m.markets_id === asset.markets_id);
    const aClass = dbClasses.find(c => c.asset_classes_id === asset.asset_classes_id);

    return {
      ...asset,
      market_name: market?.full_name ?? "Unknown",
      asset_class_name: aClass?.asset_class ?? "Unknown",
      currency_code: "", // Koppel aan dbCurrencies indien nodig
      industry_name: "", 
      country_name: "",
      current_price: priceData?.close_price ?? 0,
      total_quantity: 0,
      total_market_value: 0,
      is_tracker: aClass?.asset_class.toLowerCase().includes('etf') ?? false,
      isin: asset.ISIN
    };
  });
};

export const enrichHoldings = (
  userHoldings: RawHolding[],
  enrichedAssets: EnrichedAsset[]
): EnrichedHolding[] => {
  return userHoldings.map(raw => {
    const asset = enrichedAssets.find(a => a.ticker === raw.ticker);
    const marketValue = raw.quantity * (asset?.current_price ?? 0);
    
    return {
      ...asset!,
      purchaseDate: raw.purchaseDate,
      purchasePrice: raw.purchasePrice,
      quantity: raw.quantity,
      costBasis: raw.quantity * raw.purchasePrice,
      marketValue
    };
  });
};