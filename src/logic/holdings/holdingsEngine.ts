import { RawHolding, EnrichedAsset, EnrichedHolding } from "@/types";
import { calcPnL, calcWeight } from "../core/math";

/**
 * Koppelt persoonlijke transacties aan marktdata en berekent de actuele waarde en winst/verlies.
 * Deze engine vormt de basis voor alle weergaven in het dashboard.
 */
export const enrichHoldings = (
  userHoldings: RawHolding[] = [],
  enrichedAssets: EnrichedAsset[] = [],
  portfolioTotalValue: number = 0
): EnrichedHolding[] => {
  
  if (!userHoldings || !Array.isArray(userHoldings)) return [];

  return userHoldings.map((holding) => {
    // 1. Zoek de bijbehorende verrijkte asset data
    const asset = enrichedAssets.find((a) => Number(a.ticker_id) === Number(holding.ticker_id));
    
    // 2. Data opschonen (Numbers forceren om NaN te voorkomen)
    const currentPrice = Number(asset?.current_price) || 0;
    const qty = Number(holding.quantity) || 0;
    const purchasePrice = Number(holding.purchase_price) || 0;

    // 3. Financiële berekeningen (consequent snake_case)
    const market_value = qty * currentPrice;
    const cost_basis = qty * purchasePrice;
    
    // Gebruik de core math helper voor consistente PnL berekening
    const { absolute, percentage } = calcPnL(market_value, cost_basis);

    // 4. Bouw het EnrichedHolding object zonder 'as any'
    const enriched: EnrichedHolding = {
      // Begin met asset metadata (indien gevonden, anders lege placeholders)
      ...(asset ?? ({} as EnrichedAsset)),
      
      // Specifieke holding data (overschrijft eventuele asset defaults)
      id: holding.id ?? 0,
      ticker_id: holding.ticker_id,
      quantity: qty,
      purchase_date: holding.purchase_date,
      purchase_price: purchasePrice,
      
      // Berekende waarden
      market_value,
      cost_basis,
      pnl_absolute: absolute,
      pnl_percentage: percentage,
      
      // Bereken weging t.o.v. het totaal als dat beschikbaar is
      weight: calcWeight(market_value, portfolioTotalValue),
      
      // UI Aliases (altijd vullen voor betrouwbare weergave in tabellen)
      symbol: asset?.ticker ?? "N/A",
      name: asset?.full_name ?? "Unknown Asset"
    };

    return enriched;
  });
};