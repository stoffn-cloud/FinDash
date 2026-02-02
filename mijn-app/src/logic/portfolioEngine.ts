// src/logic/portfolioEngine.ts
import { calculateHistoricalReturn } from "./ExpectedReturnCalc/HistExpReturn";
import { calculateFutureReturn } from "./ExpectedReturnCalc/FutExpReturn";
import { calculatePastReturns } from "./PastReturnCalc/RealizedReturn";

// 1. Definieer Types om 'any' te vervangen
export interface Asset {
  name: string;
  assetClass: string;
  value: number;
  historicalPrices?: {
    lastClose?: number;
    monthAgo?: number;
    yearAgo?: number;
  };
  expertForecast?: number;
}

export interface PortfolioData {
  name: string;
  assets: Asset[];
  [key: string]: any; // Voor overige velden uit de mockData
}

// Helper om rendement te berekenen met type-safety
const calcPct = (current: number, historical: number | undefined): number => 
  historical ? ((current - historical) / historical) * 100 : 0;

export const processPortfolioData = (
  rawPortfolio: PortfolioData, 
  futExInputs: Record<string, number> = {}
) => {
  // Check of de data bestaat
  if (!rawPortfolio || !rawPortfolio.assets) {
    return null; 
  }

  try {
    const assets = rawPortfolio.assets;
    const totalValue = assets.reduce((sum: number, a: Asset) => sum + a.value, 0);

    // 1. BEREKENING PER ASSET
    const processedAssets = assets.map((a: Asset) => {
      const h = a.historicalPrices || {};
      return {
        ...a,
        returns: {
          d: calcPct(a.value, h.lastClose),
          m: calcPct(a.value, h.monthAgo),
          y: calcPct(a.value, h.yearAgo)
        }
      };
    });

    // 2. BEREKENING PER ASSET CLASS (GEWOGEN)
    const assetClassNames: string[] = Array.from(new Set(processedAssets.map((a) => a.assetClass)));
    
    const performanceByClass = assetClassNames.map(className => {
      const classAssets = processedAssets.filter((a) => a.assetClass === className);
      const classValue = classAssets.reduce((sum, a) => sum + a.value, 0);
      
      const weightedReturn = (period: 'd' | 'm' | 'y'): number => 
        classAssets.reduce((acc, a) => {
          const assetReturn = (a.returns as Record<string, number>)[period];
          return acc + (assetReturn * (a.value / classValue));
        }, 0);

      return {
        className,
        value: classValue,
        returns: {
          d: weightedReturn('d').toFixed(2),
          m: weightedReturn('m').toFixed(2),
          y: weightedReturn('y').toFixed(2)
        }
      };
    });

    // 3. PORTFOLIO TOTAAL PERFORMANCE
    const portfolioReturns = {
      d: processedAssets.reduce((acc: number, a) => acc + (a.returns.d * (a.value / totalValue)), 0).toFixed(2),
      m: processedAssets.reduce((acc: number, a) => acc + (a.returns.m * (a.value / totalValue)), 0).toFixed(2),
      y: processedAssets.reduce((acc: number, a) => acc + (a.returns.y * (a.value / totalValue)), 0).toFixed(2),
    };

    // 4. EXTERNE CALCULATORS
    const pastPerformance = calculatePastReturns(assets);
    const historicalExp = calculateHistoricalReturn(assets);
    const futureExpRaw = calculateFutureReturn(assets, futExInputs);

    return {
      ...rawPortfolio,
      assets: processedAssets,
      assetClasses: assetClassNames,
      performanceByClass,
      summary: {
        totalValue,
        realizedReturnPct: pastPerformance?.portfolioTotal?.percentageReturn ?? "0.00",
        futExpPct: (futureExpRaw * 100).toFixed(2),
        sentiment: futureExpRaw > historicalExp ? "Optimistic" : "Conservative",
        performance: portfolioReturns
      },
      analytics: {
        past: pastPerformance,
        projections: {
          historical: (historicalExp * 100).toFixed(2),
          future: (futureExpRaw * 100).toFixed(2)
        }
      }
    };
  } catch (error) {
    console.error("Fout in PortfolioEngine:", error);
    return null;
  }
};