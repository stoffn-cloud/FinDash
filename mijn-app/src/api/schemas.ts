import { z } from "zod";

export const HoldingSchema = z.object({
  name: z.string(),
  ticker: z.string(),
  weight: z.number(),
  value: z.number(),
  return_ytd: z.number().optional(),
  volatility: z.number().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
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

export const PortfolioSchema = z.object({
  name: z.string(),
  totalValue: z.number(),
  dailyChangePercent: z.number().optional().default(0),
  ytdReturn: z.number().optional().default(0),
  riskMetrics: RiskMetricsSchema.optional(),
  performanceHistory: z.array(PerformancePointSchema).optional().default([]),
  sectorAllocation: z.array(SectorAllocationSchema).optional().default([]),
  currencyAllocation: z.array(CurrencyAllocationSchema).optional().default([]),
  assetClasses: z.array(AssetClassSchema),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;
export type AssetClass = z.infer<typeof AssetClassSchema>;
export type Holding = z.infer<typeof HoldingSchema>;
