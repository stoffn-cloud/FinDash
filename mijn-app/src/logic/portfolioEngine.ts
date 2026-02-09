import { Portfolio, Holding, AssetClass } from "../types/schemas";

/**
 * Berekent alles door: Total Value, Asset Class verdeling, Gewichten, en Bèta.
 */
export const buildPortfolioFromAssets = (assets: any[]): Portfolio => {
  // 1. Voorbereiding: zorg dat we met de juiste veldnamen werken (amount uit mock vs quantity in types)
  const normalizedAssets: Holding[] = assets.map(a => ({
    ...a,
    quantity: a.amount || a.quantity || 0,
    price: a.currentPrice || a.price || 0,
    assetClass: a.assetClass || "Equities", // NASDAQ is meestal Equities
    sector: a.sector || "Technology",      // Default voor NASDAQ indien onbekend
    beta: a.beta ?? 1.0                    // Default bèta van de markt
  }));

  // 2. Bereken de totale waarde (de noemer)
  const totalPortfolioValue = normalizedAssets.reduce((sum, h) => sum + (h.quantity * h.price), 0);

  // 3. Groepeer assets per Asset Class
  const groups = normalizedAssets.reduce((acc, h) => {
    const className = h.assetClass || "Other";
    if (!acc[className]) acc[className] = [];
    acc[className].push(h);
    return acc;
  }, {} as Record<string, Holding[]>);

  // 4. Transformeer groepen naar AssetClass objecten
  const assetClasses: AssetClass[] = Object.entries(groups).map(([name, holdings], index) => {
    const classValue = holdings.reduce((sum, h) => sum + (h.quantity * h.price), 0);
    
    // Bereken gewogen Bèta van deze klasse
    const classBeta = holdings.reduce((sum, h) => {
      const weightInClass = classValue > 0 ? (h.quantity * h.price) / classValue : 0;
      return sum + ((h.beta ?? 1.0) * weightInClass);
    }, 0);

    // Update holdings met hun gewicht t.o.v. het TOTAAL
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
      color: getColorForClass(name),
      expected_return: 0,
      ytd_return: 0
    };
  });

  // 5. Bereken de totale Portfolio Bèta
  const totalPortfolioBeta = assetClasses.reduce((sum, ac) => {
    return sum + (ac.beta! * (ac.allocation_percent! / 100));
  }, 0);

  // 6. Bouw sector allocatie (Cruciaal voor je charts!)
  const sectorMap: Record<string, number> = {};
  normalizedAssets.forEach(h => {
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
    name: "FinDash Alpha Portfolio",
    totalValue: totalPortfolioValue,
    dailyChangePercent: 0,
    ytdReturn: 0,
    assetClasses,
    sectorAllocation,
    currencyAllocation: [], 
    performanceHistory: [],
    riskMetrics: {
      beta: Number(totalPortfolioBeta.toFixed(2)),
      volatility: 0,
      maxDrawdown: 0
    }
  };
};

function getColorForClass(name: string) {
  const colors: Record<string, string> = {
    "Equities": "#3B82F6",
    "Bonds & Fixed Income": "#8B5CF6",
    "Crypto Assets": "#F59E0B",
    "Cash & Equivalents": "#10B981",
    "Technology": "#3B82F6"
  };
  return colors[name] || "#94A3B8";
}