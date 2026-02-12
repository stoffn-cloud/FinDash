import { Currency } from "@/types";

/**
 * Zet een waarde om naar de basisvaluta (bijv. EUR)
 */
export const normalizeToEUR = (
  value: number, 
  fromCurrency: string, 
  fxRates: Record<string, number>
): number => {
  if (fromCurrency === 'EUR') return value;
  const rate = fxRates[fromCurrency];
  return rate ? value / rate : value; // Deelt door de koers (bijv. 1.08 voor USD)
};