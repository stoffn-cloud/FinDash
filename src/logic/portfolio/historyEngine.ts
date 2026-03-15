import { EnrichedHolding, OHLCVHistory, PortfolioHistoryPoint } from "@/types";

/**
 * Berekent de historische waarde van de gehele portefeuille over een tijdlijn.
 */
export const calculatePortfolioHistory = (
  holdings: EnrichedHolding[] = [], 
  allPrices: OHLCVHistory[] = []
): PortfolioHistoryPoint[] => {
  if (!holdings.length || !allPrices.length) return [];

  const history: PortfolioHistoryPoint[] = [];

  try {
    // 1. PRIJS LOOKUP MAP
    const priceMap = new Map<string, number>();
    allPrices.forEach(p => {
      const dateKey = p.date_id.split('T')[0];
      priceMap.set(`${p.ticker_id}-${dateKey}`, Number(p.close_price) || 0);
    });

    // 2. BEREIK BEPALEN
    const sortedPurchaseDates = holdings
      .map(h => h.purchase_date)
      .filter(Boolean)
      .sort();
      
    const startDateStr = sortedPurchaseDates[0] || "2025-01-01";
    
    const allAvailableDates = Array.from(new Set(allPrices.map(p => p.date_id.split('T')[0]))).sort();
    const endDateStr = allAvailableDates[allAvailableDates.length - 1] || startDateStr;

    // --- START DEBUG LOGS ---
    console.group("🔍 History Engine Deep Scan");
    console.log("Aantal unieke prijsdatums in DB:", new Set(allPrices.map(p => p.date_id)).size);
    console.log("Eerste prijsdatum in dataset:", allPrices[0]?.date_id);
    console.log("Laatste prijsdatum in dataset:", allPrices[allPrices.length - 1]?.date_id);
    console.log("Startdatum berekening (oudste aankoop):", startDateStr);
    console.log("Gefilterde Tijdlijn Lengte:", allAvailableDates.filter(d => d >= startDateStr && d <= endDateStr).length);
    console.groupEnd();
    // --- EIND DEBUG LOGS ---

    // 3. TIJDLIJN GENEREREN
    const timelineDates = allAvailableDates.filter(d => d >= startDateStr && d <= endDateStr);

    let lastKnownTotal = 0;

    timelineDates.forEach(dateStr => {
      let dailyTotal = 0;
      let hasAssetsOnThisDate = false;

      holdings.forEach(holding => {
        if (holding.purchase_date <= dateStr) {
          const price = priceMap.get(`${holding.ticker_id}-${dateStr}`);
          
          const effectivePrice = (price !== undefined && price > 0) 
            ? price 
            : (Number(holding.purchase_price) || 0);

          dailyTotal += (Number(holding.quantity) * effectivePrice);
          hasAssetsOnThisDate = true;
        }
      });

      if (hasAssetsOnThisDate) {
        lastKnownTotal = dailyTotal;
        history.push({
          date: dateStr,
          total_value: Number(dailyTotal.toFixed(2))
        });
      }
    });

    if (history.length === 1) {
      console.warn("⚠️ History Engine genereerde slechts 1 datapunt. Check of purchase_dates en price dates_id's matchen.");
    }

  } catch (err) {
    console.error("❌ Kritieke fout in History Engine:", err);
  }

  return history;
};