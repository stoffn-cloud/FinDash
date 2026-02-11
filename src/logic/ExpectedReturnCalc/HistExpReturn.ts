export const calculateHistoricalReturn = (assets: any[]) => {
  if (!assets || assets.length === 0) return 0;

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  // We berekenen het gewogen gemiddelde van historische returns
  const weightedHistReturn = assets.reduce((acc, asset) => {
    const weight = asset.value / totalValue;
    // Gebruik data uit mockData of een default van 7% (marktgemiddelde)
    const annualReturn = asset.historicalAnnualReturn || 0.07; 
    return acc + (annualReturn * weight);
  }, 0);

  return weightedHistReturn;
};