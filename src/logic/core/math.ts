/**
 * Basis berekeningen voor de gehele engine
 */
export const calcWeight = (value: number, total: number): number => 
  total > 0 ? (value / total) * 100 : 0;

export const calcPnL = (currentValue: number, costBasis: number) => {
  const absolute = currentValue - costBasis;
  const percentage = costBasis > 0 ? (absolute / costBasis) * 100 : 0;
  return { absolute, percentage };
};

export const formatCurrency = (value: number, currency = 'EUR') => {
  return new Intl.NumberFormat('nl-BE', { style: 'currency', currency }).format(value);
};