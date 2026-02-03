import { Weight } from "lucide-react";
import { z } from "zod";

export const HoldingSchema = z.object({
  name: z.string(),
  ticker: z.string(),
  quantity: z.number(), // Verplicht: hoeveel stuks heb je?
  price: z.number(), // Verplicht: wat is de huidige koers?
  value: z.number(),
  weight: z.number(),
  return_ytd: z.number().optional(),
  volatility: z.number().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  sector: z.string().optional(),
});

export const AssetClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  current_value: z.number(),
  allocation_percent: z.number(),
  expected_return: z.number(),
  ytd_return: z.number(),
  color: z.string(),
  holdings: z.array(HoldingSchema).optional(),
});

export const RiskMetricsSchema = z.object({
  beta: z.number().optional().default(1),
  maxDrawdown: z.number().optional().default(0),
  volatility: z.number().optional().default(0),
  sharpeRatio: z.number().optional(),
  var95: z.number().optional(),
});

export const PerformancePointSchema = z.object({
  date: z.string(),
  portfolioValue: z.number(),
  benchmarkValue: z.number(),
});

export const SectorAllocationSchema = z.object({
  name: z.string(),
  percentage: z.number(),
});

export const CurrencyAllocationSchema = z.object({
  code: z.string(),
  percentage: z.number(),
  value: z.number(),
});

export const TransactionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  date: z.string().optional(),
  type: z.enum(["buy", "sell", "dividend", "deposit", "withdrawal", "fee"]),
  asset_name: z.string().optional(),
  ticker: z.string().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
  total_amount: z.number(),
});

export const PortfolioSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalValue: z.number(),
  dailyChangePercent: z.number().optional().default(0),
  ytdReturn: z.number().optional().default(0),
  riskMetrics: RiskMetricsSchema.optional(),
  performanceHistory: z.array(PerformancePointSchema).optional().default([]),
  sectorAllocation: z.array(SectorAllocationSchema).optional().default([]),
  currencyAllocation: z.array(CurrencyAllocationSchema).optional().default([]),
  assetClasses: z.array(AssetClassSchema),
  transactions: z.array(TransactionSchema).optional().default([]),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;
export type AssetClass = z.infer<typeof AssetClassSchema>;
export type Holding = z.infer<typeof HoldingSchema>;
