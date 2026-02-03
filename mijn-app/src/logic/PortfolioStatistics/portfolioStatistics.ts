// src/logic/portfolioStatistics.ts
import { Portfolio } from "../../types/schemas";

export interface PortfolioStats {
  totalValueFormatted: string;
  ytdReturnFormatted: string;
  isPositive: boolean;
  riskLevel: "Low" | "Moderate" | "High";
  riskColor: string;
  topSector: string;
}

/**
 * Zet de ruwe berekende portfolio data om in statistieken 
 * die direct door de UI gebruikt kunnen worden.
 */
export const getPortfolioStatistics = (portfolio: Portfolio): PortfolioStats => {
  // 1. Valuta Formatter
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // 2. Risico Analyse
  const vol = portfolio.riskMetrics?.volatility || 0;
  let riskLevel: "Low" | "Moderate" | "High" = "Moderate";
  let riskColor = "text-amber-500";

  if (vol < 10) {
    riskLevel = "Low";
    riskColor = "text-emerald-500";
  } else if (vol > 20) {
    riskLevel = "High";
    riskColor = "text-red-500";
  }

  // 3. Zoek de grootste sector (als voorbeeld van aggregatie)
  const topSector = [...portfolio.sectorAllocation].sort((a, b) => b.percentage - a.percentage)[0]?.name || "N/A";

  return {
    totalValueFormatted: currencyFormatter.format(portfolio.totalValue),
    ytdReturnFormatted: `${portfolio.ytdReturn > 0 ? '+' : ''}${portfolio.ytdReturn}%`,
    isPositive: portfolio.ytdReturn >= 0,
    riskLevel,
    riskColor,
    topSector,
  };
};