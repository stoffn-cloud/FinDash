/**
 * Berekent de gewogen toekomstige return op basis van gebruikersinput per asset class.
 * @param assets - De lijst met assets in het portfolio
 * @param futExInputs - De Record met percentages per asset class vanuit het dashboard
 */
export const calculateFutureReturn = (
  assets: any[], 
  futExInputs: Record<string, number> = {}
) => {
  if (!assets || assets.length === 0) return 0;

  const totalValue = assets.reduce((sum: number, a: any) => sum + a.value, 0);

  const weightedFutureReturn = assets.reduce((acc: number, asset: any) => {
    const weight = asset.value / totalValue;
    
    // 1. Check of de gebruiker een specifieke verwachting heeft ingevuld voor deze klasse
    // 2. Zo niet, check of er een expertForecast in de asset data zit
    // 3. Als laatste fallback gebruiken we 5% (0.05)
    const userValue = futExInputs[asset.assetClass];
    const forecast = userValue !== undefined 
      ? userValue / 100  // Omzetten van bijv. 7.5 naar 0.075
      : (asset.expertForecast || 0.05);
    
    return acc + (forecast * weight);
  }, 0);

  return weightedFutureReturn;
};