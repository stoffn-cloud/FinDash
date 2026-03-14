import { EnrichedHolding, OHLCVHistory, PortfolioHistoryPoint } from "@/types";

export const calculatePortfolioHistory = (
  holdings: EnrichedHolding[], 
  allPrices: OHLCVHistory[]
): PortfolioHistoryPoint[] => {
  // 1. Veiligheidscheck
  if (!holdings?.length || !allPrices?.length) {
    console.warn("⚠️ [History Engine] Onvoldoende data voor historie:", { 
      holdings: holdings?.length, 
      prices: allPrices?.length 
    });
    return [];
  }

  const history: PortfolioHistoryPoint[] = [];

  try {
    // 2. Map prijzen voor snelle lookup
    // We normaliseren de datum naar YYYY-MM-DD om tijdverschillen te elimineren
    const priceMap = new Map<string, number>();
    allPrices.forEach(p => {
      if (p.date_id && p.ticker_id) {
        const dateKey = p.date_id.split('T')[0];
        priceMap.set(`${p.ticker_id}-${dateKey}`, Number(p.close_price));
      }
    });

    // 3. Unieke datums sorteren
    const uniqueDates = Array.from(
      new Set(
        allPrices
          .filter(p => p.date_id)
          .map(p => p.date_id.split('T')[0])
      )
    ).sort();

    // 4. Bereken de waarde van de portfolio per dag
    uniqueDates.forEach(dateStr => {
      let dailyTotal = 0;
      let hasDataForThisDay = false;

      holdings.forEach(holding => {
        if (!holding.ticker_id) return;

        // MATCHING FIX: We gebruiken nu de snake_case namen uit onze nieuwe EnrichedHolding interface
        const price = priceMap.get(`${holding.ticker_id}-${dateStr}`);
        
        // Zorg voor een zuivere YYYY-MM-DD vergelijking
        const pDate = holding.purchase_date 
          ? String(holding.purchase_date).split('T')[0] 
          : "1970-01-01";

        // Alleen meetellen als de holding op of na de aankoopdatum valt
        if (pDate <= dateStr) {
          // Als we voor deze dag geen specifieke prijs hebben, gebruiken we de aankoopprijs
          const currentPrice = price !== undefined ? price : (Number(holding.purchase_price) || 0);
          const qty = Number(holding.quantity) || 0;
          
          dailyTotal += (qty * currentPrice);
          hasDataForThisDay = true;
        }
      });

      // Alleen punten toevoegen waar we echt assets in bezit hadden
      if (hasDataForThisDay && dailyTotal > 0) {
        history.push({
          date: dateStr,
          total_value: Number(dailyTotal.toFixed(2))
        });
      }
    });

  } catch (err) {
    console.error("❌ Fout tijdens historie berekening:", err);
    return [];
  }

  return history;
};