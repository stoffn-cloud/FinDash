// src/logic/PerformanceCalc.ts

interface PerformanceMetrics {
  daily: string;
  monthly: string;
  yearly: string;
}

export const calculateReturns = (currentValue: number, prices: any): PerformanceMetrics => {
  // Helper om percentage te berekenen
  const getPct = (oldPrice: number) => 
    oldPrice ? ((currentValue - oldPrice) / oldPrice * 100).toFixed(2) : "0.00";

  return {
    daily: getPct(prices.lastClose),
    monthly: getPct(prices.monthAgo),
    yearly: getPct(prices.yearAgo),
  };
};

export const aggregatePerformance = (items: any[]) => {
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  
  // Gewogen gemiddelde berekenen
  const calcWeighted = (period: 'daily' | 'monthly' | 'yearly') => {
    const weightedSum = items.reduce((sum, item) => {
      const weight = item.value / totalValue;
      return sum + (parseFloat(item.returns[period]) * weight);
    }, 0);
    return weightedSum.toFixed(2);
  };

  return {
    daily: calcWeighted('daily'),
    monthly: calcWeighted('monthly'),
    yearly: calcWeighted('yearly'),
  };
};