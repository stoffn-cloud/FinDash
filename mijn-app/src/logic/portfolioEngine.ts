// src/logic/portfolioEngine.ts
import { calculateHistoricalReturn } from "./ExpectedReturnCalc/HistExpReturn";
import { calculateFutureReturn } from "./ExpectedReturnCalc/FutExpReturn";
import { calculatePastReturns } from "./PastReturnCalc/RealizedReturn"; // Nieuwe import

export const processPortfolioData = (rawPortfolio: any, futExInputs: Record<string, number> = {}) => {
  if (!rawPortfolio || !rawPortfolio.assets) return null;

  // Realized Returns (Wat er IS gebeurd)
  const pastPerformance = calculatePastReturns(rawPortfolio.assets);
  
  // Expected Returns (Wat we VERWACHTEN)
  const historicalExp = calculateHistoricalReturn(rawPortfolio.assets);
  const futureExp = calculateFutureReturn(rawPortfolio.assets);

  return {
    ...rawPortfolio,
    
    // De 'Quick Glance' voor de bovenkant van je scherm
    summary: {
      totalValue: pastPerformance?.portfolioTotal.currentValue,
      realizedReturnPct: pastPerformance?.portfolioTotal.percentageReturn,
      isPositive: (pastPerformance?.portfolioTotal?.absoluteReturn ?? 0) >= 0,
      futureTarget: (futureExp * 100).toFixed(2)
    },

    // De gedetailleerde lagen voor de tabs
    analytics: {
      past: pastPerformance,
      projections: {
        historical: (historicalExp * 100).toFixed(2),
        future: (futureExp * 100).toFixed(2)
      }
    }
  };
};