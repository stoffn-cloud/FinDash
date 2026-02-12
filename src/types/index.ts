import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Currency, Region, Country, Market, RawHolding,
  Portfolio, EnrichedHolding
} from "@/types";

// Importeer de sub-engines (die we hierna gaan vullen)
import { enrichAssets, enrichHoldings } from "./portfolio/assetEngine";
import { calculateClassAllocation } from "./allocation/classEngine";
import { calculateGeoAllocation } from "./allocation/geographyEngine";
import { calculateSectorAllocation } from "./allocation/sectorEngine";
import { calculateMarketAllocation } from "./allocation/marketEngine";
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
  userHoldings: RawHolding[], // Jouw persoonlijke aankopen
  dbMetadata: any[],          // De prijzen uit OHLCV_history
  snapshotDate: string = new Date().toISOString().split('T')[0]
): Portfolio => {

  // 1. Verrijk de basis: Assets en persoonlijke Holdings
  // Deze stap is cruciaal omdat de andere engines deze verrijkte data nodig hebben
  const enrichedAssets = enrichAssets(dbAssets, dbMetadata, dbMarkets, dbAssetClasses, dbCurrencies, dbIndustries, dbCountries);
  const holdings = enrichHoldings(userHoldings, enrichedAssets);

  // 2. Bereken de totale waarde van de portefeuille
  const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);

  // 3. Delegeer allocatie-berekeningen aan sub-engines
  const assetAllocation = calculateClassAllocation(dbAssetClasses, holdings, totalValue);
  const sectorAllocation = calculateSectorAllocation(dbSectors, holdings, totalValue);
  const industryAllocation = calculateSectorAllocation(dbSectors, holdings, totalValue); // Of eigen industryEngine
  const { regionAllocation, countryAllocation } = calculateGeoAllocation(dbCountries, dbRegions, holdings, totalValue);
  const marketAllocation = calculateMarketAllocation(dbMarkets, holdings, totalValue);
  
  // 4. Bereken statistieken (trackers vs stocks, etc.)
  const stats = calculateStats(enrichedAssets);

  // 5. De finale return die voldoet aan het 'Enriched' contract
  return {
    id: "main-portfolio-snapshot",
    name: "Mijn Vermogen",
    holdings,
    assetAllocation,
    sectorAllocation,
    industryAllocation: [], // Wordt gevuld door sectorEngine of industryEngine
    currencyExposure: [],   // Wordt gevuld door currencyEngine
    regionAllocation,
    countryAllocation,
    marketAllocation,
    enrichedAssets,
    stats,
    totalValue,
    lastUpdated: snapshotDate
  };
};