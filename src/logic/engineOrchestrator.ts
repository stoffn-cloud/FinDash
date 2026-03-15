"use client";

import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, Portfolio, 
  OHLCVHistory, EnrichedHolding, RawHolding,
  RawHoldingSchema,
  OHLCVHistorySchema,
  AssetSchema
} from "../types";

// Engines ... (imports blijven gelijk)
import { enrichAssets } from "./portfolio/assetEngine";
import { enrichHoldings } from "./holdings/holdingsEngine";
import { calculateStats } from "./portfolio/statsEngine";
import { calculatePortfolioHistory } from "./portfolio/historyEngine"; 

// Allocation Engines ... (imports blijven gelijk)
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
import { calculateCurrencyExposure } from "./allocation/currencyEngine";

const prepareRawInput = (holdings: any[]): RawHolding[] => {
  if (!holdings || !Array.isArray(holdings)) return [];
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
  userHoldings: any[] = [], 
  prices: OHLCVHistory[] = [],
  snapshotDate: string = new Date().toISOString().split('T')[0]
): Portfolio => {

  try {
    // --- 1. DATA INSPECTIE (Hulp bij de 1-datapunt bug) ---
    if (process.env.NODE_ENV === 'development') {
      const uniqueDates = Array.from(new Set(prices.map(p => String(p.date_id).split('T')[0])));
      console.group("🧪 Orchestrator Data Audit");
      console.log("Inkomende Prijzen (totaal):", prices.length);
      console.log("Unieke Datums in Prijzen:", uniqueDates.length);
      if (uniqueDates.length > 0) {
        console.log("Datum Bereik Prijzen:", uniqueDates.sort()[0], "tot", uniqueDates.sort()[uniqueDates.length - 1]);
      }
      console.log("Inkomende Holdings:", userHoldings.length);
      if (userHoldings.length > 0) {
        console.log("Eerste Holding Aankoopdatum:", userHoldings[0].purchase_date || userHoldings[0].purchaseDate);
      }
      console.groupEnd();
    }

    // 2. INPUT VOORBEREIDING & VALIDATIE
    const rawInput = prepareRawInput(userHoldings);
    const validatedPrices = (prices || []).map(p => OHLCVHistorySchema.parse(p));
    const validatedAssets = (dbAssets || []).map(a => AssetSchema.parse(a));

    // 3. ENRICHMENT STAGE
    const enrichedAssets = enrichAssets(
      validatedAssets, 
      validatedPrices, 
      dbMarkets, 
      dbAssetClasses, 
      dbCurrencies, 
      dbIndustries, 
      dbCountries
    ) || [];

    const intermediateHoldings = enrichHoldings(rawInput, enrichedAssets) || [];
    const totalValue = intermediateHoldings.reduce((sum, h) => sum + (Number(h.market_value) || 0), 0);

    const holdings: EnrichedHolding[] = intermediateHoldings.map((h) => ({
      ...h,
      weight: totalValue > 0 ? ((Number(h.market_value) || 0) / totalValue) * 100 : 0
    }));

    // 4. ALLOCATION STAGE
    const assetAllocation = calculateClassAllocation(dbAssetClasses, dbCurrencies, holdings, totalValue) || [];
    const sectorData = calculateSectorAllocation(dbSectors, dbIndustries, holdings, totalValue);
    const geoData = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
    const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue) || [];
    const currencyExposure = calculateCurrencyExposure(dbCurrencies, holdings, totalValue) || [];

    // 5. HISTORY & STATS STAGE
    // Hier gaat het mis als validatedPrices maar 1 datum bevat per ticker!
    const history = calculatePortfolioHistory(holdings, validatedPrices) || [];
    const stats = calculateStats(enrichedAssets, holdings, dbSectors);

    // 6. DEBUG LOGGING (Het resultaat)
    if (process.env.NODE_ENV === 'development') {
      console.group("🕵️ Portfolio Engine Heartbeat");
      console.log("History Points berekend:", history.length);
      if (history.length === 1) {
        console.warn("🚩 WAARSCHUWING: Maar 1 historisch punt. Controleer of je SQL query wel alle datums ophaalt!");
      }
      console.groupEnd();
    }

    return {
      id: `snapshot-${snapshotDate}`,
      name: "Mijn Portfolio",
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