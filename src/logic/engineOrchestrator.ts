import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, Portfolio, 
  OHLCVHistory, EnrichedHolding, RawHolding,
  // Zorg dat deze in je types bestand staat met 'export'
  DefaultHolding 
} from "../types";

// 1. Controleer of deze paden exact kloppen met je mappenstructuur
import { enrichAssets } from "./portfolio/assetEngine";
import { enrichUserHoldings } from "./holdings/holdingsEngine"; 
import { calculateStats } from "./portfolio/statsEngine";

// 2. De allocatie imports (die ontbraken in je foutmelding)
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
import { calculateCurrencyExposure } from "./allocation/currencyEngine";

/**
 * DE ADAPTER: Vertaalt Ticker Strings (Hardcoded) naar Ticker IDs (Database)
 */
const translateDefaultToRaw = (
  defaultHoldings: DefaultHolding[],
  dbAssets: Asset[]
): RawHolding[] => {
  return defaultHoldings.map((def) => {
    const asset = dbAssets.find((a) => a.ticker === def.ticker);
    return {
      ticker_id: asset?.ticker_id ?? 0,
      quantity: def.quantity,
      purchase_price: def.purchasePrice ?? 0,
      purchase_date: def.purchaseDate,
    };
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
  userHoldings: DefaultHolding[], 
  prices: OHLCVHistory[],
  snapshotDate: string = new Date().toISOString().split('T')[0]
): Portfolio => {

  try {
    // STAP 0: Vertalen naar RawHoldings (Ticker -> ID)
    const rawInput = translateDefaultToRaw(userHoldings, dbAssets);

    // STAP 1: Assets verrijken
    const enrichedAssets = enrichAssets(
      dbAssets, prices, dbMarkets, dbAssetClasses, 
      dbCurrencies, dbIndustries, dbCountries
    );

    // STAP 2: Holdings verrijken
    const rawHoldings = enrichUserHoldings(rawInput, enrichedAssets);

    // STAP 3: Totale waarde
    const totalValue = rawHoldings.reduce((sum: number, h: EnrichedHolding) => sum + h.marketValue, 0);

    // STAP 4: Weights toevoegen
    const holdings = rawHoldings.map((h: EnrichedHolding) => ({
      ...h,
      weight: totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0
    }));

    // STAP 5: Allocaties berekenen
    const assetAllocation = calculateClassAllocation(dbAssetClasses, dbCurrencies, holdings, totalValue);
    const { sectorAllocation, industryAllocation } = calculateSectorAllocation(dbSectors, dbIndustries, holdings, totalValue);
    const { regionAllocation, countryAllocation } = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
    const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue);
    const currencyExposure = calculateCurrencyExposure(dbCurrencies, holdings, totalValue);

    // STAP 6: Stats
    const stats = calculateStats(enrichedAssets, holdings, dbSectors);

    return {
      id: `snapshot-${snapshotDate}`,
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
  } catch (error) {
    console.error("❌ Kritieke fout in Portfolio Orchestrator:", error);
    throw error;
  }
};