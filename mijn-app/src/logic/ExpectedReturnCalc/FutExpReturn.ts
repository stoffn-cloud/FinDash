export const calculateFutureReturn = (assets: any[]) => {
  if (!assets || assets.length === 0) return 0;

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  // We berekenen het gewogen gemiddelde van de expert-verwachtingen
  const weightedFutureReturn = assets.reduce((acc, asset) => {
    const weight = asset.value / totalValue;
    
    // We zoeken naar 'expertForecast' in je data, anders default naar 8%
    const forecast = asset.expertForecast || 0.08; 
    
    return acc + (forecast * weight);
  }, 0);

  return weightedFutureReturn;
};