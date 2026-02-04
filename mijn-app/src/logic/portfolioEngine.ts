import { Portfolio, Holding, AssetClass } from "../types/schemas";

/**
 * Bouwt een volledig Portfolio object op basis van een platte lijst met assets.
 * Berekent: Total Value, Asset Class verdeling, Gewichten, en Bèta.
 */
export const buildPortfolioFromAssets = (assets: Holding[]): Portfolio => {
  // 1. Bereken de totale waarde van het hele portfolio (de noemer)
  const totalPortfolioValue = assets.reduce((sum, h) => sum + (h.quantity * h.price), 0);

  // 2. Groepeer assets per Asset Class
  const groups = assets.reduce((acc, h) => {
    const className = h.assetClass || "Other";
    if (!acc[className]) acc[className] = [];
    acc[className].push(h);
    return acc;
  }, {} as Record<string, Holding[]>);

  // 3. Transformeer groepen naar AssetClass objecten
  const assetClasses: AssetClass[] = Object.entries(groups).map(([name, holdings], index) => {
    const classValue = holdings.reduce((sum, h) => sum + (h.quantity * h.price), 0);
    
    // Bereken gewogen Bèta van deze specifieke klasse
    const classBeta = holdings.reduce((sum, h) => {
      const weightInClass = classValue > 0 ? (h.quantity * h.price) / classValue : 0;
      return sum + ((h.beta ?? 1.0) * weightInClass);
    }, 0);

    // Update de individuele holdings met hun gewicht t.o.v. het TOTAAL
    const updatedHoldings = holdings.map(h => ({
      ...h,
      value: h.quantity * h.price,
      weight: totalPortfolioValue > 0 ? ((h.quantity * h.price) / totalPortfolioValue) * 100 : 0
    }));

    return {
      id: `ac-${index}`,
      name: name as any,
      current_value: classValue,
      allocation_percent: totalPortfolioValue > 0 ? (classValue / totalPortfolioValue) * 100 : 0,
      beta: classBeta,
      holdings: updatedHoldings,
      color: getColorForClass(name), // Dynamische kleur
      expected_return: 0,
      ytd_return: 0
    };
  });

  // 4. Bereken de totale Portfolio Bèta
  const totalPortfolioBeta = assetClasses.reduce((sum, ac) => {
    return sum + (ac.beta! * (ac.allocation_percent! / 100));
  }, 0);

  // 5. Bouw sector allocatie (voor de charts)
  const sectorMap: Record<string, number> = {};
  assets.forEach(h => {
    const s = h.sector || "Other";
    sectorMap[s] = (sectorMap[s] || 0) + (h.quantity * h.price);
  });

  const sectorAllocation = Object.entries(sectorMap).map(([name, value]) => ({
    name: name as any,
    percentage: totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0,
    value
  }));

  return {
    id: "generated-portfolio",
    name: "Dynamic Alpha Portfolio",
    totalValue: totalPortfolioValue,
    dailyChangePercent: 0,
    ytdReturn: 0,
    assetClasses,
    sectorAllocation,
    currencyAllocation: [], 
    performanceHistory: [],
    transactions: [],
    riskMetrics: {
      beta: Number(totalPortfolioBeta.toFixed(2)),
      volatility: 0,
      maxDrawdown: 0
    }
  };
};

// Hulpmiddel voor kleuren
function getColorForClass(name: string) {
  const colors: Record<string, string> = {
    "Equities": "#3B82F6",
    "Bonds & Fixed Income": "#8B5CF6",
    "Crypto Assets": "#F59E0B",
    "Cash & Equivalents": "#10B981"
  };
  return colors[name] || "#94A3B8";
}