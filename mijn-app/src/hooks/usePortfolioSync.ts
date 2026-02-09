// src/hooks/usePortfolioSync.ts
import { useState, useEffect, useCallback } from 'react';
import { mockPortfolio, PortfolioItem } from '../data/constants/mockPortfolio';

export const usePortfolioSync = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Definieer hier al je tabbladen
  const SHEET_SOURCES = [
    'https://docs.google.com/spreadsheets/d/e/1a_1ZHYG8pLbwX5zIwI5O-_Dt8KqjXEk1H2G_8dtBUNo/pub?gid=0&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/1a_1ZHYG8pLbwX5zIwI5O-_Dt8KqjXEk1H2G_8dtBUNo/pub?gid=1234567&single=true&output=csv',
    // Voeg hier extra tabbladen toe
  ];

  const syncData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Start alle requests tegelijkertijd (Parallel fetching)
      const requests = SHEET_SOURCES.map(url => fetch(url).then(res => res.text()));
      const csvResults = await Promise.all(requests);

      const priceMap: Record<string, number> = {};
      const TARGET_DATE = "2026-02-03";

      // 2. Verwerk elk resultaat en vul de priceMap aan
      csvResults.forEach(csvText => {
        const rows = csvText.split('\n').map(row => row.split(','));
        rows.forEach(columns => {
          if (columns.length < 3) return;
          const [date, ticker, price] = columns.map(c => c?.trim());
          if (date === TARGET_DATE) {
            priceMap[ticker] = parseFloat(price);
          }
        });
      });

      // 3. Merge met mockPortfolio
      const enriched = mockPortfolio.map((item: PortfolioItem) => ({
        ...item,
        currentPrice: priceMap[item.ticker] || 0,
        totalValue: item.amount * (priceMap[item.ticker] || 0),
      }));

      setAssets(enriched);
    } catch (error) {
      console.error("Multi-sheet Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { syncData(); }, [syncData]);

  return { assets, isLoading, refresh: syncData };
};