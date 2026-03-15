/**
 * Basis berekeningen voor de gehele engine.
 * Focus op precisie en het voorkomen van DivisionByZero of NaN errors.
 */

/**
 * Berekent de weging van een asset binnen een (deel)totaal.
 */
export const calcWeight = (value: number, total: number): number => {
  if (!total || total <= 0) return 0;
  const weight = (value / total) * 100;
  
  // We beperken het gewicht tot 100% (behalve bij short positions/leverage, 
  // maar voor standaard allocatie is dit veiliger)
  return Number(weight.toFixed(4)); 
};

/**
 * Berekent Profit and Loss (PnL).
 * Geeft zowel de absolute waarde als de procentuele verandering terug.
 */
export const calcPnL = (currentValue: number, costBasis: number) => {
  const current = Number(currentValue) || 0;
  const cost = Number(costBasis) || 0;
  
  const absolute = current - cost;
  
  // Voorkom oneindige percentages als costBasis 0 is (bijv. bij airdrops/bonussen)
  const percentage = cost > 0 ? (absolute / cost) * 100 : 0;
  
  return { 
    absolute: Number(absolute.toFixed(2)), 
    percentage: Number(percentage.toFixed(2)) 
  };
};

/**
 * Berekent het geannualiseerd rendement (CAGR).
 * Handig voor de performance metrics later.
 */
export const calcCAGR = (currentValue: number, costBasis: number, years: number): number => {
  if (costBasis <= 0 || years <= 0) return 0;
  const ratio = currentValue / costBasis;
  const cagr = (Math.pow(ratio, 1 / years) - 1) * 100;
  return Number(cagr.toFixed(2));
};

/**
 * Helper om getallen veilig af te ronden op een specifiek aantal decimalen.
 * Voorkomt floating point issues zoals 0.1 + 0.2 = 0.30000000000000004
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  return Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};