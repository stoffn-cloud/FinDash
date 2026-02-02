export const calculatePastReturns = (assets: any[]) => {
  if (!assets || assets.length === 0) return null;

  const resultsByTicker: any = {};
  const resultsByClass: any = {};
  
  let totalValue = 0;
  let totalCost = 0;

  assets.forEach((asset) => {
    // 1. Individuele Ticker Berekening
    const currentVal = asset.value;
    const costBasis = asset.costBasis || currentVal; // Fallback als data ontbreekt
    const absoluteReturn = currentVal - costBasis;
    const percentageReturn = (absoluteReturn / costBasis) * 100;

    resultsByTicker[asset.ticker] = {
      name: asset.name,
      absoluteReturn,
      percentageReturn: percentageReturn.toFixed(2),
      isPositive: absoluteReturn >= 0
    };

    // 2. Groeperen per Asset Class (bijv. Equity, Crypto, Cash)
    if (!resultsByClass[asset.assetClass]) {
      resultsByClass[asset.assetClass] = { value: 0, cost: 0 };
    }
    resultsByClass[asset.assetClass].value += currentVal;
    resultsByClass[asset.assetClass].cost += costBasis;

    // 3. Totaal Portfolio
    totalValue += currentVal;
    totalCost += costBasis;
  });

  // Verwerk de Asset Class totalen naar percentages
  const processedClasses = Object.keys(resultsByClass).map(className => {
    const { value, cost } = resultsByClass[className];
    const absReturn = value - cost;
    return {
      className,
      absoluteReturn: absReturn,
      percentageReturn: ((absReturn / cost) * 100).toFixed(2),
      totalValue: value
    };
  });

  // 4. Eindresultaat
  const totalAbsReturn = totalValue - totalCost;
  
  return {
    byTicker: resultsByTicker,
    byClass: processedClasses,
    portfolioTotal: {
      currentValue: totalValue,
      costBasis: totalCost,
      absoluteReturn: totalAbsReturn,
      percentageReturn: ((totalAbsReturn / totalCost) * 100).toFixed(2)
    }
  };
};