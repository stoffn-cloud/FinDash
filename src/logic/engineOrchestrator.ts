import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, Portfolio, 
  OHLCVHistory, RawHolding 
} from "../types";

// Importeer de nieuwe modulaire engines
import { enrichAssets } from "./portfolio/assetEngine";
import { enrichUserHoldings } from "./holdings/holdingsEngine";
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
import { calculateCurrencyExposure } from "./allocation/currencyEngine";
import { calculateStats } from "./portfolio/statsEngine";

export const calculatePortfolioSnapshot = (
  dbAssets: Asset[],
  dbAssetClasses: AssetClass[],
  dbSectors: AssetSector[],
  dbIndustries: AssetIndustry[],
  dbCurrencies: Currency[],
  dbRegions: Region[],
  dbCountries: Country[],
  dbMarkets: Market[],
  userHoldings: RawHolding[], // Je 'defaultPortfolio'
  prices: OHLCVHistory[],
  snapshotDate: string = '2025-01-31'
): Portfolio => {

  // STAP 1: Catalogus verrijken (Koppelt alle SQL ID's aan namen)
  const enrichedAssets = enrichAssets(
    dbAssets, 
    prices, 
    dbMarkets, 
    dbAssetClasses, 
    dbCurrencies, 
    dbIndustries, 
    dbCountries
  );

  // STAP 2: Holdings verrijken (De basis van je bezit)
  const holdings = enrichUserHoldings(userHoldings, enrichedAssets);

  // STAP 3: Totale waarde bepalen (nodig voor alle percentages)
  const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);

  // STAP 4: Allocaties berekenen (De Tabs in je dashboard)
  const assetAllocation = calculateClassAllocation(dbAssetClasses, dbCurrencies, holdings, totalValue);
  const { sectorAllocation, industryAllocation } = calculateSectorAllocation(dbSectors, dbIndustries, holdings, totalValue);
  const { regionAllocation, countryAllocation } = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
  const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue);
  const currencyExposure = calculateCurrencyExposure(dbCurrencies, holdings, totalValue);

  // STAP 5: Statistieken (Bovenste rij kaarten)
  const stats = calculateStats(enrichedAssets, holdings, dbSectors);

  // STAP 6: De finale return
  return {
    id: "main-portfolio-snapshot",
    name: "Mijn Vermogen",
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
};