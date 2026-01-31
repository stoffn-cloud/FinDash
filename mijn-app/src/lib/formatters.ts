/**
 * Robust formatting utilities for the Quantum Alpha Portfolio Terminal.
 * Handles edge cases like NaN, null, and undefined by providing safe fallbacks.
 */

/**
 * Formats a number as USD currency.
 * @param value The numeric value to format
 * @param compact Whether to use compact notation (e.g., $1.2M)
 */
export const formatCurrency = (value: number | null | undefined, compact = true): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "$0";
  }

  const num = Number(value);

  if (compact) {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Formats a number as a percentage string.
 * @param value The numeric value to format (e.g., 8.45)
 * @param showPlus Whether to prefix positive numbers with a '+' sign
 * @param decimals Number of decimal places
 */
export const formatPercentage = (
  value: number | null | undefined,
  showPlus = false,
  decimals = 2
): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "0.00%";
  }

  const num = Number(value);
  const sign = showPlus && num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(decimals)}%`;
};

/**
 * Safely formats a number with fixed decimals.
 */
export const formatNumber = (
  value: number | null | undefined,
  decimals = 2,
  fallback = "0.00"
): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return fallback;
  }
  return Number(value).toFixed(decimals);
};
