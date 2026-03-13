"use client";

import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, Portfolio, 
  OHLCVHistory, EnrichedHolding, RawHolding,
  DefaultHolding 
} from "../types";

import { DEFAULT_HOLDINGS } from "@/data/constants/defaultHolding"; 

// 1. Core Engines
import { enrichAssets } from "./portfolio/assetEngine";
import { enrichUserHoldings } from "./holdings/holdingsEngine"; 
import { calculateStats } from "./portfolio/statsEngine";

// 2. Allocation Engines
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
import { calculateCurrencyExposure } from "./allocation/currencyEngine";

/**
 * DE ADAPTER: Zorgt dat de input voldoet aan het RawHolding type.
 */
const prepareRawInput = (holdings: DefaultHolding[]): RawHolding[] => {
  return holdings.map((h, index) => ({
    // Forceer id naar number voor TypeScript compatibiliteit
    id: Number((h as any).id) || index + 1, 
    ticker_id: Number(h.ticker_id),
    quantity: Number(h.quantity),
    purchasePrice: Number(h.purchasePrice),
    purchaseDate: h.purchaseDate,
  }));
};

export const calculatePortfolioSnapshot = (
  dbAssets: Asset[],
  dbAssetClasses: AssetClass[],
  dbSectors: AssetSector[],
  dbIndustries: AssetIndustry[],
  dbCurrencies: Currency[],
  dbRegions: Region[],
  dbCountries: Country[],
  dbMarkets: Market[],
  userHoldings: DefaultHolding[] = [], 
  prices: OHLCVHistory[],
  snapshotDate: string = new Date().toISOString().split('T')[0]
): Portfolio => {

  try {
    // STAP 0: Bepaal actieve data en filter ongeldige (ticker_id 0) records eruit
    const activeInput = userHoldings.length > 0 ? userHoldings : DEFAULT_HOLDINGS;
    
    // Belangrijk: We verwerken alleen holdings die gekoppeld zijn aan een echt instrument (ID > 0)
    const rawInput = prepareRawInput(activeInput).filter(h => h.ticker_id > 0);

    // STAP 1: Assets verrijken
    const enrichedAssets = enrichAssets(
      dbAssets, prices, dbMarkets, dbAssetClasses, 
      dbCurrencies, dbIndustries, dbCountries
    ) || [];

    // STAP 2: Holdings verrijken
    const intermediateHoldings = enrichUserHoldings(rawInput, enrichedAssets) || [];

    // STAP 3: Totale waarde
    const totalValue = intermediateHoldings.reduce((sum: number, h: EnrichedHolding) => sum + (h.marketValue || 0), 0);

    // STAP 4: Weights toevoegen & ID fix voor TypeScript (EnrichedHolding[] type)
    const holdings: EnrichedHolding[] = intermediateHoldings.map((h, index) => {
      const originalId = h.id || rawInput[index]?.id;
      
      return {
        ...h,
        // TypeScript FIX: id moet strikt een number zijn. 
        // We gebruiken een hoog getal als fallback om strings te vermijden.
        id: typeof originalId === 'number' ? originalId : (999000 + index),
        weight: totalValue > 0 ? ((h.marketValue || 0) / totalValue) * 100 : 0
      };
    });

    // STAP 5: Allocaties berekenen
    const assetAllocation = calculateClassAllocation(dbAssetClasses, dbCurrencies, holdings, totalValue) || [];
    const sectorData = calculateSectorAllocation(dbSectors, dbIndustries, holdings, totalValue);
    const geoData = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
    const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue) || [];
    const currencyExposure = calculateCurrencyExposure(dbCurrencies, holdings, totalValue) || [];

    const sectorAllocation = sectorData?.sectorAllocation || [];
    const industryAllocation = sectorData?.industryAllocation || [];
    const regionAllocation = geoData?.regionAllocation || [];
    const countryAllocation = geoData?.countryAllocation || [];

    // STAP 6: Stats
    const stats = calculateStats(enrichedAssets, holdings, dbSectors);

    // DEBUG LOG
    console.log("📊 Snapshot Result:", {
      totalHoldings: holdings.length,
      totalAssets: enrichedAssets.length,
      portfolioValue: totalValue
    });

    return {
      id: `snapshot-${snapshotDate}`,
      name: userHoldings.length > 0 ? "Mijn Portfolio" : "Demo Portfolio",
      holdings,
      assetAllocation,
      sectorAllocation,
      industryAllocation,
      currencyExposure,
      regionAllocation,
      countryAllocation,
      marketAllocation,
      enrichedAssets, 
      stats,
      totalValue,
      lastUpdated: snapshotDate
    };
  } catch (error) {
    console.error("❌ Kritieke fout in Portfolio Orchestrator:", error);
    // Veilige fallback return bij fouten
    return {
      id: "error",
      name: "Error loading portfolio",
      holdings: [],
      assetAllocation: [],
      sectorAllocation: [],
      industryAllocation: [],
      currencyExposure: [],
      regionAllocation: [],
      countryAllocation: [],
      marketAllocation: [],
      enrichedAssets: [],
      stats: {} as any,
      totalValue: 0,
      lastUpdated: snapshotDate
    };
  }
};