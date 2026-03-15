"use client";

import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, Portfolio, 
  OHLCVHistory, EnrichedHolding, RawHolding,
  DefaultHolding,
  RawHoldingSchema,
  OHLCVHistorySchema,
  AssetSchema
} from "../types";

import { DEFAULT_HOLDINGS } from "@/data/constants/defaultHolding"; 

// Engines
import { enrichAssets } from "./portfolio/assetEngine";
import { enrichHoldings } from "./holdings/holdingsEngine";
import { calculateStats } from "./portfolio/statsEngine";
import { calculatePortfolioHistory } from "./portfolio/historyEngine"; 

// Allocation Engines
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
import { calculateCurrencyExposure } from "./allocation/currencyEngine";

/**
 * Filtert en valideert de ruwe input van de gebruiker.
 */
const prepareRawInput = (holdings: (DefaultHolding | RawHolding)[]): RawHolding[] => {
  return holdings
    .map((h) => {
      try {
        return RawHoldingSchema.parse(h);
      } catch (err) {
        console.warn("⚠️ Ongeldige holding overgeslagen:", h, err);
        return null;
      }
    })
    .filter((h): h is RawHolding => h !== null && Number(h.ticker_id) > 0);
};

export const calculatePortfolioSnapshot = (
  dbAssets: Asset[] = [],
  dbAssetClasses: AssetClass[] = [],
  dbSectors: AssetSector[] = [],
  dbIndustries: AssetIndustry[] = [],
  dbCurrencies: Currency[] = [],
  dbRegions: Region[] = [],
  dbCountries: Country[] = [],
  dbMarkets: Market[] = [],
  userHoldings: DefaultHolding[] = [], 
  prices: OHLCVHistory[] = [],
  snapshotDate: string = new Date().toISOString().split('T')[0]
): Portfolio => {

  try {
    // 1. INPUT VOORBEREIDING
    // We casten naar de bekende types in plaats van 'any'
    const inputToProcess = userHoldings.length > 0 
      ? userHoldings 
      : (DEFAULT_HOLDINGS as DefaultHolding[]);
    
    const rawInput = prepareRawInput(inputToProcess);
    
    // 2. DATA VALIDATIE & NORMALISATIE
    const validatedPrices = (prices || []).map(p => OHLCVHistorySchema.parse(p));
    const validatedAssets = (dbAssets || []).map(a => AssetSchema.parse(a));

    // 3. ENRICHMENT STAGE
    // Stap A: Verrijk de basis assets met prijzen en metadata
    const enrichedAssets = enrichAssets(
      validatedAssets, 
      validatedPrices, 
      dbMarkets, 
      dbAssetClasses, 
      dbCurrencies, 
      dbIndustries, 
      dbCountries
    ) || [];

    // Stap B: Verrijk de holdings (koppeling asset + user data)
    // De weging wordt binnen enrichHoldings berekend als we totalValue later weten, 
    // maar we berekenen eerst de absolute waarden.
    const intermediateHoldings = enrichHoldings(rawInput, enrichedAssets) || [];

    // Stap C: Bereken het portfolio totaal
    const totalValue = intermediateHoldings.reduce((sum, h) => sum + (Number(h.market_value) || 0), 0);

    // Stap D: Werk de wegingen bij in de definitieve holdings lijst
    const holdings: EnrichedHolding[] = intermediateHoldings.map((h) => ({
      ...h,
      weight: totalValue > 0 ? ((Number(h.market_value) || 0) / totalValue) * 100 : 0
    }));

    // 4. ALLOCATION STAGE (De "snijders")
    const assetAllocation = calculateClassAllocation(dbAssetClasses, dbCurrencies, holdings, totalValue) || [];
    const sectorData = calculateSectorAllocation(dbSectors, dbIndustries, holdings, totalValue);
    const geoData = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
    const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue) || [];
    const currencyExposure = calculateCurrencyExposure(dbCurrencies, holdings, totalValue) || [];

    // 5. HISTORY & STATS STAGE
    const history = calculatePortfolioHistory(holdings, validatedPrices) || [];
    const stats = calculateStats(enrichedAssets, holdings, dbSectors);

    // 6. DEBUG LOGGING
    if (process.env.NODE_ENV === 'development') {
      console.group("🕵️ Portfolio Engine Heartbeat");
      console.log("Total Value:", totalValue);
      console.log("Holdings Count:", holdings.length);
      console.log("History Points:", history.length);
      if (history.length > 0) {
        console.log("Date Range:", history[0].date, "to", history[history.length - 1].date);
      }
      console.groupEnd();
    }

    // 7. RESULTAAT SAMENSTELLEN
    return {
      id: `snapshot-${snapshotDate}`,
      name: userHoldings.length > 0 ? "Mijn Portfolio" : "Demo Portfolio",
      holdings,
      enrichedAssets, 
      assetAllocation,
      sectorAllocation: sectorData?.sectorAllocation || [],
      industryAllocation: sectorData?.industryAllocation || [],
      currencyExposure,
      currencyAllocation: currencyExposure, 
      regionAllocation: geoData?.regionAllocation || [],
      countryAllocation: geoData?.countryAllocation || [],
      marketAllocation,
      history,           
      stats,
      totalValue,
      lastUpdated: snapshotDate
    };

  } catch (error) {
    console.error("❌ Kritieke fout in Portfolio Orchestrator:", error);
    return createEmptyPortfolio(snapshotDate);
  }
};

/**
 * Fallback functie in geval van fouten.
 */
const createEmptyPortfolio = (date: string): Portfolio => ({
  id: "error",
  name: "Error",
  holdings: [],
  enrichedAssets: [],
  assetAllocation: [],
  sectorAllocation: [],
  industryAllocation: [],
  currencyExposure: [],
  regionAllocation: [],
  countryAllocation: [],
  marketAllocation: [],
  history: [],           
  stats: {} as any,
  totalValue: 0,
  lastUpdated: date
});