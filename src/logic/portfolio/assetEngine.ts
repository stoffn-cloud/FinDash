import { Asset, EnrichedAsset, EnrichedHolding, RawHolding, OHLCVHistory } from "@/types";
import { calcPnL } from "../core/math";

export const enrichAssets = (
  dbAssets: Asset[] = [], // Veiligheid: altijd een array
  prices: OHLCVHistory[] = [],
  dbMarkets: any[] = [],
  dbClasses: any[] = [],
  dbCurrencies: any[] = [],
  dbIndustries: any[] = [],
  dbCountries: any[] = []
): EnrichedAsset[] => {
  // Harde check om de "map of undefined" crash te voorkomen
  if (!dbAssets || !Array.isArray(dbAssets)) return [];

  return dbAssets.map(asset => {
    const priceData = prices.find(p => p.ticker_id === asset.ticker_id);
    const market = dbMarkets.find(m => m.markets_id === asset.markets_id);
    const aClass = dbClasses.find(c => c.asset_classes_id === asset.asset_classes_id);
    const currency = dbCurrencies.find(c => c.currencies_id === asset.currencies_id);
    const industry = dbIndustries.find(i => i.asset_industries_id === asset.asset_industries_id);
    const country = dbCountries.find(c => c.countries_id === asset.countries_id);

    return {
      ...asset,
      market_name: market?.full_name ?? "Unknown Market",
      asset_class_name: aClass?.asset_class ?? "Unknown Class",
      currency_code: currency?.ISO_code ?? "EUR",
      industry_name: industry?.description ?? "Unknown Industry",
      country_name: country?.full_name ?? "Unknown Country",
      current_price: priceData?.close_price ?? 0,
      total_quantity: 0,
      total_market_value: 0,
      is_tracker: aClass?.asset_class?.toLowerCase()?.includes('etf') || 
                  aClass?.asset_class?.toLowerCase()?.includes('tracker') || false,
      isin: asset.ISIN
    };
  });
};

/**
 * Verrijkt de persoonlijke holdings (transacties)
 */
export const enrichHoldings = (
  userHoldings: RawHolding[] = [],
  enrichedAssets: EnrichedAsset[] = []
): EnrichedHolding[] => {
  if (!userHoldings || !Array.isArray(userHoldings)) return [];

  return userHoldings.map(raw => {
    const asset = enrichedAssets.find(a => a.ticker_id === raw.ticker_id);
    
    const currentPrice = asset?.current_price ?? 0;
    const marketValue = raw.quantity * currentPrice;
    
    const costPrice = raw.purchasePrice ?? 0; 
    const costBasis = raw.quantity * costPrice;

    const { absolute, percentage } = calcPnL(marketValue, costBasis);

    return {
      // 1. Neem alle data van de Asset (naam, sector, etc.)
      ...(asset as EnrichedAsset),
      
      // 2. VOEG DIT TOE: Het unieke ID van de transactie zelf!
      // Dit lost de "Property 'id' is missing" error op.
      id: raw.id ?? 0, 

      // 3. De specifieke transactiegegevens
      quantity: Number(raw.quantity) || 0,
purchaseDate: raw.purchaseDate instanceof Date 
        ? raw.purchaseDate.toISOString().split('T')[0] 
        : String(raw.purchaseDate),

      purchasePrice: costPrice,
      currentPrice: currentPrice,
      marketValue,
      costBasis,
      pnlAbsolute: absolute,
      pnlPercentage: percentage,
      weight: 0 
    };
  });
};