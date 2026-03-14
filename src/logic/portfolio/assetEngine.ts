import { Asset, EnrichedAsset, EnrichedHolding, RawHolding, OHLCVHistory } from "@/types";
import { calcPnL } from "../core/math";

/**
 * Verrijkt de basis Assets met meta-data en prijzen.
 */
export const enrichAssets = (
  dbAssets: Asset[] = [],
  prices: OHLCVHistory[] = [],
  dbMarkets: any[] = [],
  dbClasses: any[] = [],
  dbCurrencies: any[] = [],
  dbIndustries: any[] = [],
  dbCountries: any[] = []
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
      // Sector mapping (voor robuustheid kijken we naar beide mogelijke veldnamen)
      sectors_id: (asset as any).sectors_id || (asset as any).asset_sectors_id || 0,
      asset_sectors_id: (asset as any).asset_sectors_id || (asset as any).sectors_id || 0,
      
      market_name: market?.full_name ?? "Unknown Market",
      asset_class_name: aClass?.asset_class ?? "Unknown Class",
      currency_code: currency?.ISO_code ?? "EUR",
      industry_name: industry?.description ?? "Unknown Industry",
      country_name: country?.full_name ?? "Unknown Country",
      current_price: Number(priceData?.close_price) || 0,
      total_quantity: 0,
      total_market_value: 0,
      is_tracker: aClass?.asset_class?.toLowerCase()?.includes('etf') || 
                  aClass?.asset_class?.toLowerCase()?.includes('tracker') || false,
      isin: asset.ISIN || null
    } as EnrichedAsset;
  });
};

/**
 * Verrijkt de persoonlijke holdings (transacties).
 * Deze functie fungeert als de vertaler tussen RawHolding (Input) en EnrichedHolding (Output).
 */
export const enrichHoldings = (
  userHoldings: RawHolding[] = [],
  enrichedAssets: EnrichedAsset[] = []
): EnrichedHolding[] => {
  if (!userHoldings || !Array.isArray(userHoldings)) return [];

  return userHoldings.map(raw => {
    const asset = enrichedAssets.find(a => a.ticker_id === raw.ticker_id);
    
    // 1. Haal data uit RawHolding (gebruik camelCase zoals in je interface staat)
    const currentPrice = asset?.current_price ?? 0;
    const qty = Number(raw.quantity) || 0;
    
    // De adapter in de orchestrator vult purchasePrice in, dus dat gebruiken we hier
    const pPrice = Number(raw.purchasePrice || (raw as any).purchase_price || 0);
    
    // 2. Berekeningen
    const market_value = qty * currentPrice;
    const cost_basis = qty * pPrice;
    const { absolute, percentage } = calcPnL(market_value, cost_basis);

    // 3. Datum formatteer-logica
    const rawDate = raw.purchaseDate || (raw as any).purchase_date;
    const purchase_date = rawDate instanceof Date 
        ? rawDate.toISOString().split('T')[0] 
        : String(rawDate || "2025-01-01").split('T')[0];

    // 4. Return het object exact volgens de EnrichedHolding interface (snake_case)
    return {
      ...(asset as EnrichedAsset),
      
      id: raw.id ?? 0, 
      quantity: qty,
      
      // Mappen naar snake_case voor consistentie in de rest van de app
      purchase_date: purchase_date,
      purchase_price: pPrice,
      cost_basis: cost_basis,
      market_value: market_value,
      pnl_absolute: absolute,
      pnl_percentage: percentage,
      weight: 0 
    } as EnrichedHolding;
  });
};