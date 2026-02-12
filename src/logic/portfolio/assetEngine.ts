import { Asset, EnrichedAsset, EnrichedHolding, RawHolding, OHLCVHistory } from "@/types";
import { calcPnL } from "../core/math";

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
    // 1. Zoek de koppelingen op basis van ID's
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
      
      // Deze velden worden vaak geaggregeerd in de statsEngine, 
      // maar we zetten ze hier alvast op 0 als veilige startwaarde.
      total_quantity: 0,
      total_market_value: 0,
      
      // Logica voor trackers (ETF's)
      is_tracker: aClass?.asset_class.toLowerCase().includes('etf') || 
                  aClass?.asset_class.toLowerCase().includes('tracker') || false,
      isin: asset.ISIN
    };
  });
};

/**
 * Verrijkt de persoonlijke holdings (transacties)
 */
export const enrichHoldings = (
  userHoldings: RawHolding[],
  enrichedAssets: EnrichedAsset[]
): EnrichedHolding[] => {
  return userHoldings.map(raw => {
    // Gebruik ticker_id voor een betrouwbare match met de database
    const asset = enrichedAssets.find(a => a.ticker_id === raw.ticker_id);
    
    const currentPrice = asset?.current_price ?? 0;
    const marketValue = raw.quantity * currentPrice;
    
    // Consistentie met je RawHolding veldnamen (bijv. purchase_price uit MySQL)
    const costPrice = raw.purchase_price ?? 0;
    const costBasis = raw.quantity * costPrice;

    // Bereken PnL via de math helper voor consistentie
    const { absolute, percentage } = calcPnL(marketValue, costBasis);

    return {
      // Gebruik type assertion of spread met fallback om undefined te voorkomen
      ...(asset as EnrichedAsset),
      quantity: raw.quantity,
      purchaseDate: raw.purchase_date,
      purchasePrice: costPrice,
      currentPrice: currentPrice,
      marketValue,
      costBasis,
      pnlAbsolute: absolute,
      pnlPercentage: percentage,
      weight: 0 // Wordt berekend in de Orchestrator
    };
  });
};