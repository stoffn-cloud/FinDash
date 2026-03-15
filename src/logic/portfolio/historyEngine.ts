import { EnrichedHolding, OHLCVHistory, PortfolioHistoryPoint } from "@/types";

/**
 * Berekent de historische waarde van de gehele portefeuille over een tijdlijn.
 * Gebruikt een 'Daily Bucket' benadering voor maximale accuraatheid.
 */
export const calculatePortfolioHistory = (
  holdings: EnrichedHolding[] = [], 
  allPrices: OHLCVHistory[] = []
): PortfolioHistoryPoint[] => {
  // 1. VEILIGHEIDSCHECK
  if (!holdings.length || !allPrices.length) return [];

  const history: PortfolioHistoryPoint[] = [];

  try {
    // 2. PRIJS LOOKUP MAP
    // We gebruiken ticker_id en date_id als unieke sleutel voor razendsnelle toegang.
    const priceMap = new Map<string, number>();
    allPrices.forEach(p => {
      const dateKey = p.date_id.split('T')[0]; // Zorg voor YYYY-MM-DD formaat
      priceMap.set(`${p.ticker_id}-${dateKey}`, Number(p.close_price) || 0);
    });

    // 3. BEREIK BEPALEN
    // Start bij de oudste aankoop, eindig op de laatste datum in de prijs-dataset (of vandaag)
    const sortedPurchaseDates = holdings
      .map(h => h.purchase_date)
      .filter(Boolean)
      .sort();
      
    const startDateStr = sortedPurchaseDates[0] || "2025-01-01";
    
    // Dynamisch eindpunt: pak de allerlaatste datum uit je prijs-dataset
    const allAvailableDates = Array.from(new Set(allPrices.map(p => p.date_id.split('T')[0]))).sort();
    const endDateStr = allAvailableDates[allAvailableDates.length - 1] || startDateStr;

    // 4. TIJDLIJN GENEREREN
    // We lopen alleen door datums waar we daadwerkelijk prijzen voor hebben
    const timelineDates = allAvailableDates.filter(d => d >= startDateStr && d <= endDateStr);

    // 5. HISTORIE OPBOUWEN
    let lastKnownTotal = 0;

    timelineDates.forEach(dateStr => {
      let dailyTotal = 0;
      let hasAssetsOnThisDate = false;

      holdings.forEach(holding => {
        // Tel de holding alleen mee als deze op of voor deze datum gekocht is
        if (holding.purchase_date <= dateStr) {
          const price = priceMap.get(`${holding.ticker_id}-${dateStr}`);
          
          // Fallback strategie: 
          // 1. Prijs uit de DB op die dag
          // 2. Als die ontbreekt: de aankoopprijs (om de lijn niet naar 0 te laten vallen)
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

    // 6. DEBUG LOG (Alleen in dev)
    if (history.length === 1) {
      console.warn("⚠️ History Engine genereerde slechts 1 datapunt. Check of purchase_dates en price dates_id's matchen.");
    }

  } catch (err) {
    console.error("❌ Kritieke fout in History Engine:", err);
  }

  return history;
};