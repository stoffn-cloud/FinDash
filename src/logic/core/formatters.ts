import { Currency } from "@/types";

/**
 * --- VALUTA & WISSELKOERSEN ---
 */

/**
 * Zet een waarde om naar de basisvaluta (standaard EUR).
 * Gebruikt de formule: Waarde / Wisselkoers.
 * Bijv: $108 / 1.08 (EUR/USD rate) = €100.
 */
export const normalizeCurrency = (
  value: number, 
  fromCurrency: string, 
  fxRates: Record<string, number>,
  targetCurrency: string = 'EUR'
): number => {
  if (!value || isNaN(value)) return 0;
  if (fromCurrency === targetCurrency) return value;
  
  const rate = fxRates[fromCurrency];
  // Als de rate ontbreekt, geven we de originele waarde terug maar loggen een waarschuwing
  if (!rate) {
    console.warn(`Missing FX rate for: ${fromCurrency}`);
    return value;
  }
  
  return value / rate;
};

/**
 * --- GETALLEN & PERCENTAGES ---
 */

/**
 * Formatteert een getal als een leesbaar percentage.
 * Bijv: 0.1234 -> "12.34%"
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return "0.00%";
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatteert een bedrag voor weergave in de UI.
 * Bijv: 1250000 -> "1.25M" of "1.250.000,00"
 */
export const formatCompactNumber = (value: number): string => {
  return Intl.NumberFormat('nl-BE', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};

/**
 * --- DATUM FORMATTERING ---
 * Cruciaal voor het voorkomen van "Invalid Date" in de grafieken.
 */

/**
 * Zorgt voor een consistente YYYY-MM-DD string, ongeacht de input.
 */
export const formatDateSafe = (date: any): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    // Fallback als de datum echt corrupt is
    return "2026-01-01"; 
  }
  
  return d.toISOString().split('T')[0];
};

/**
 * --- TEXT & UI FORMATTERING ---
 */

/**
 * Maakt een string 'UI-ready' (bijv. van snake_case naar Capitalized)
 * Bijv: "equity_fund" -> "Equity Fund"
 */
export const capitalizeLabel = (str: string): string => {
  if (!str) return "";
  return str
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};