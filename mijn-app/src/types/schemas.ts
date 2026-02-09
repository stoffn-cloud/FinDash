import { z } from "zod";

// We gebruiken de enums voor striktere validatie
export const HoldingSchema = z.object({
  id: z.string(),
  name: z.string(),
  ticker: z.string(),
  quantity: z.number().default(0),
  price: z.number().default(0),
  beta: z.number().default(1.0),
  value: z.number().default(0),
  weight: z.number().default(0),
  return_ytd: z.number().default(0),
  volatility: z.number().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  sector: z.string().default("Other"),
  assetClass: z.string().default("Equities"),
});

export const AssetClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  current_value: z.number().default(0),
  allocation_percent: z.number().default(0),
  beta: z.number().default(1.0),
  expected_return: z.number().default(0),
  ytd_return: z.number().default(0),
  color: z.string(),
  holdings: z.array(HoldingSchema).default([]),
});

export const RiskMetricsSchema = z.object({
  beta: z.number().default(1.0),
  maxDrawdown: z.number().default(0),
  volatility: z.number().default(0),
  sharpeRatio: z.number().optional(),
});

export const PortfolioSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalValue: z.number().default(0),
  dailyChangePercent: z.number().default(0),
  ytdReturn: z.number().default(0),
  riskMetrics: RiskMetricsSchema,
  performanceHistory: z.array(z.any()).default([]),
  sectorAllocation: z.array(z.any()).default([]),
  currencyAllocation: z.array(z.any()).default([]),
  assetClasses: z.array(AssetClassSchema),
  lastUpdated: z.string().optional(),
});

// Infer types van de schema's voor gebruik in de app
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type AssetClass = z.infer<typeof AssetClassSchema>;
export type Holding = z.infer<typeof HoldingSchema>;