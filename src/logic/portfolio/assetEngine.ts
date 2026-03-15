import { 
  Asset, 
  EnrichedAsset, 
  EnrichedHolding, 
  RawHolding, 
  OHLCVHistory,
  Market,
  AssetClass,
  Currency,
  AssetIndustry,
  Country
} from "@/types";
import { calcPnL } from "../core/math";

/**
 * Verrijkt de basis Assets met meta-data en prijzen.
 */
export const enrichAssets = (
  dbAssets: Asset[] = [],
  prices: OHLCVHistory[] = [],
  dbMarkets: Market[] = [],
  dbClasses: AssetClass[] = [],
  dbCurrencies: Currency[] = [],
  dbIndustries: AssetIndustry[] = [],
  dbCountries: Country[] = []
): EnrichedAsset[] => {
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
      // 1. SNAKE_CASE: asset_sectors_id is nu de standaard
      asset_sectors_id: asset.asset_sectors_id || (asset as any).sectors_id || 0,
      
      market_name: market?.full_name ?? "Unknown Market",
      asset_class_name: aClass?.asset_class ?? "Unknown Class",
      currency_code: currency?.ISO_code ?? "EUR",
      industry_name: industry?.description ?? "Unknown Industry",
      country_name: country?.full_name ?? "Unknown Country",
      
      // 2. NUMBERS: Forceer string-prijzen naar echte getallen
      current_price: Number(priceData?.close_price) || 0,
      
      total_quantity: 0,
      total_market_value: 0,
      is_tracker: aClass?.asset_class?.toLowerCase()?.includes('etf') || 
                  aClass?.asset_class?.toLowerCase()?.includes('tracker') || false,
    } as EnrichedAsset;
  });
};

/**
 * Verrijkt de persoonlijke holdings.
 */
export const enrichHoldings = (
  userHoldings: RawHolding[] = [],
  enrichedAssets: EnrichedAsset[] = []
): EnrichedHolding[] => {
  if (!userHoldings || !Array.isArray(userHoldings)) return [];

  return userHoldings.map(raw => {
    const asset = enrichedAssets.find(a => a.ticker_id === raw.ticker_id);
    
    // Basis waarden (Numbers!)
    const currentPrice = asset?.current_price ?? 0;
    const qty = Number(raw.quantity) || 0;
    const pPrice = Number(raw.purchase_price) || 0;
    
    // Berekeningen (Snake_case!)
    const market_value = qty * currentPrice;
    const cost_basis = qty * pPrice;
    const { absolute, percentage } = calcPnL(market_value, cost_basis);

    // 3. DATES: Fix voor de 'instanceof' error (TS code 2358)
    // We casten naar 'unknown' om TS te laten checken of het stiekem toch een Date object is
    const rawDate = raw.purchase_date;
    const purchase_date = (rawDate as unknown) instanceof Date 
        ? (rawDate as unknown as Date).toISOString().split('T')[0] 
        : String(rawDate || "").split('T')[0] || "2026-01-01";

    return {
      ...(asset as EnrichedAsset),
      
      id: raw.id ?? 0, 
      quantity: qty,
      purchase_date,
      purchase_price: pPrice,
      
      cost_basis,
      market_value,
      pnl_absolute: absolute,
      pnl_percentage: percentage,
      weight: 0, 
      
      symbol: asset?.ticker ?? "???",
      name: asset?.full_name ?? "Unknown"
    } as EnrichedHolding;
  });
};