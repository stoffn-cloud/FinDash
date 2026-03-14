"use client";

import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, Portfolio, 
  OHLCVHistory, EnrichedHolding, RawHolding,
  DefaultHolding 
} from "../types";

import { DEFAULT_HOLDINGS } from "@/data/constants/defaultHolding"; 

// Engines
import { enrichAssets } from "./portfolio/assetEngine";
import { enrichUserHoldings } from "./holdings/holdingsEngine"; 
import { calculateStats } from "./portfolio/statsEngine";
import { calculatePortfolioHistory } from "./portfolio/historyEngine"; 

// Allocation Engines
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
import { calculateCurrencyExposure } from "./allocation/currencyEngine";

/**
 * ADAPTER: Mapt input naar RawHolding.
 */
const prepareRawInput = (holdings: DefaultHolding[]): RawHolding[] => {
  return holdings.map((h, index) => {
    const ticker_id = Number(h.ticker_id);
    const quantity = Number(h.quantity) || 0;
    const pPrice = Number(h.purchase_price) || Number((h as any).purchasePrice) || 0;
    const pDate = h.purchase_date || (h as any).purchaseDate || "2025-01-01";

    return {
      id: index + 1,
      ticker_id,
      quantity,
      purchase_price: pPrice, 
      purchase_date: pDate,   
      purchasePrice: pPrice,  
      purchaseDate: pDate     
    } as RawHolding;
  });
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
    const activeInput = userHoldings.length > 0 ? userHoldings : (DEFAULT_HOLDINGS as any);
    const rawInput = prepareRawInput(activeInput).filter(h => h.ticker_id > 0);

    const enrichedAssets = enrichAssets(dbAssets, prices, dbMarkets, dbAssetClasses, dbCurrencies, dbIndustries, dbCountries) || [];
    const intermediateHoldings = enrichUserHoldings(rawInput, enrichedAssets) || [];

    const totalValue = intermediateHoldings.reduce((sum: number, h: EnrichedHolding) => sum + (h.market_value || 0), 0);

    const holdings: EnrichedHolding[] = intermediateHoldings.map((h) => ({
      ...h,
      weight: totalValue > 0 ? ((h.market_value || 0) / totalValue) * 100 : 0
    }));

    // Allocaties
    const assetAllocation = calculateClassAllocation(dbAssetClasses, dbCurrencies, holdings, totalValue) || [];
    const sectorData = calculateSectorAllocation(dbSectors, dbIndustries, holdings, totalValue);
    const geoData = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
    const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue) || [];
    const currencyExposure = calculateCurrencyExposure(dbCurrencies, holdings, totalValue) || [];

    const history = calculatePortfolioHistory(holdings, prices) || [];
    const stats = calculateStats(enrichedAssets, holdings, dbSectors);

    return {
      id: `snapshot-${snapshotDate}`,
      name: userHoldings.length > 0 ? "Mijn Portfolio" : "Demo Portfolio",
      holdings,
      assetAllocation,
      sectorAllocation: sectorData?.sectorAllocation || [],
      industryAllocation: sectorData?.industryAllocation || [],
      currencyExposure: currencyExposure,
      regionAllocation: geoData?.regionAllocation || [],
      countryAllocation: geoData?.countryAllocation || [],
      marketAllocation,
      // VERWIJDERD: enrichedAssets (bestaat niet in Portfolio type)
      history,           
      stats,
      totalValue,
      lastUpdated: snapshotDate
    };
  } catch (error) {
    console.error("❌ Kritieke fout in Portfolio Orchestrator:", error);
    return {
      id: "error",
      name: "Error",
      holdings: [],
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
      lastUpdated: snapshotDate
    } as Portfolio;
  }
};