import { deafaultPortfolio } from "../data/constants/defaultHolding";
import { 
  PortfolioItem, 
  EnrichedHolding, 
  Portfolio, 
  AssetClass, 
  EnrichedAssetClass,
  AssetSector,
  EnrichedAssetSector,
  AssetIndustry,
  EnrichedAssetIndustry,
  Currency,
  EnrichedCurrency,
  Region,
  EnrichedRegion,
  Country,
  EnrichedCountry,
  Market,
  EnrichedMarket,
  Asset,
  EnrichedAsset,
  PortfolioStats
} from "../types";

export const calculatePortfolioSnapshot = (
  dbMetadata: PortfolioItem[],   
  dbAssetClasses: AssetClass[],  
  dbSectors: AssetSector[],
  dbIndustries: AssetIndustry[],
  dbCurrencies: Currency[],
  dbRegions: Region[],
  dbCountries: Country[],
  dbMarkets: Market[],
  dbAssets: Asset[],
  snapshotDate: string = '2025-01-31'
): Portfolio => {
  
  // 1. Verrijk de individuele holdings
  const enrichedHoldings: EnrichedHolding[] = deafaultPortfolio.map((holding) => {
    const sqlMatch = dbMetadata.find((m) => m.ticker === holding.ticker);
    const currentPrice = sqlMatch?.price ?? 0;
    const marketValue = holding.quantity * currentPrice;
    const costBasis = holding.quantity * (holding.purchasePrice ?? 0);

    return {
      ...(sqlMatch || {}), 
      ticker: holding.ticker,
      quantity: holding.quantity,
      purchaseDate: holding.purchaseDate,
      purchasePrice: holding.purchasePrice,
      currentPrice,
      marketValue,
      costBasis,
    } as EnrichedHolding;
  });

  // 2. Totaalwaarde berekenen
  const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.marketValue, 0);

  // HULPFUNCTIE voor Currency Exposure
  const getCurrencyExposure = (holdings: EnrichedHolding[]): EnrichedCurrency[] => {
    const setTotal = holdings.reduce((sum, h) => sum + h.marketValue, 0);
    return dbCurrencies.map(curr => {
      const valueInCurr = holdings
        .filter(h => h.currency === curr.ISO_code)
        .reduce((sum, h) => sum + h.marketValue, 0);
      
      return {
        ...curr,
        id: curr.currencies_id,
        current_value: valueInCurr,
        allocation_percent: setTotal > 0 ? (valueInCurr / setTotal) * 100 : 0
      };
    }).filter(c => c.current_value > 0);
  };

  // 3. Asset Allocation
  const assetAllocation: EnrichedAssetClass[] = dbAssetClasses.map((ac, idx) => {
    const holdingsInClass = enrichedHoldings.filter(h => h.asset_class === ac.asset_class);
    const classValue = holdingsInClass.reduce((sum, h) => sum + h.marketValue, 0);

    return {
      ...ac,
      id: ac.asset_classes_id,
      name: ac.asset_class,
      current_value: classValue,
      allocation_percent: totalValue > 0 ? (classValue / totalValue) * 100 : 0,
      assets: holdingsInClass,
      currencyExposure: getCurrencyExposure(holdingsInClass),
      color: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"][idx % 6],
    };
  });

  // 4. Sector Allocation
  const sectorAllocation: EnrichedAssetSector[] = dbSectors.map((sec, idx) => {
    const holdingsInSector = enrichedHoldings.filter(h => h.sector === sec.GICS_name);
    const sectorValue = holdingsInSector.reduce((sum, h) => sum + h.marketValue, 0);
    return {
      ...sec,
      id: sec.asset_sectors_id,
      name: sec.GICS_name,
      current_value: sectorValue,
      allocation_percent: totalValue > 0 ? (sectorValue / totalValue) * 100 : 0,
      holding_count: holdingsInSector.length,
      color: ["#6366F1", "#EC4899", "#8B5CF6", "#F43F5E", "#10B981"][idx % 5]
    };
  });

  // 5. Industry Allocation
  const industryAllocation: EnrichedAssetIndustry[] = dbIndustries.map((ind) => {
    const holdingsInInd = enrichedHoldings.filter(h => h.industry === ind.description);
    const indValue = holdingsInInd.reduce((sum, h) => sum + h.marketValue, 0);
    const parentSector = sectorAllocation.find(s => s.asset_sectors_id === ind.asset_sectors_id);
    
    return {
      ...ind,
      id: ind.asset_industries_id,
      name: ind.description,
      current_value: indValue,
      allocation_total_percent: totalValue > 0 ? (indValue / totalValue) * 100 : 0,
      allocation_sector_percent: (parentSector?.current_value ?? 0) > 0 ? (indValue / parentSector!.current_value) * 100 : 0,
      holding_count: holdingsInInd.length,
      color: "#94A3B8"
    };
  });

  // 6. Globale Currency Exposure
  const currencyExposure = getCurrencyExposure(enrichedHoldings);

  // 7. GEOGRAFISCHE BEREKENING (Landen & Regio's gecombineerd)
  
  // Eerst: Alle landen berekenen
  const countryAllocation: EnrichedCountry[] = dbCountries.map((country) => {
    const holdingsInCountry = enrichedHoldings.filter(
      (h) => h.country === country.full_name || h.country === country.ISO_code
    );
    const countryValue = holdingsInCountry.reduce((sum, h) => sum + h.marketValue, 0);
    
    return {
      ...country,
      id: country.countries_id,
      name: country.full_name,
      current_value: countryValue,
      allocation_total_percent: totalValue > 0 ? (countryValue / totalValue) * 100 : 0,
      allocation_region_percent: 0, // Wordt hieronder in de regio-loop verfijnd
      holding_count: holdingsInCountry.length
    };
  }).filter(c => c.current_value > 0);

  // Daarna: Regio's berekenen en de landen eraan koppelen
  const regionAllocation: EnrichedRegion[] = dbRegions.map((reg) => {
    const countriesInThisRegion = countryAllocation.filter(c => c.regions_id === reg.regions_id);
    const regionValue = countriesInThisRegion.reduce((sum, c) => sum + c.current_value, 0);

    // Update de weging van het land BINNEN de regio
    const countriesWithRegionalWeight = countriesInThisRegion.map(c => ({
      ...c,
      allocation_region_percent: regionValue > 0 ? (c.current_value / regionValue) * 100 : 0
    }));

    return {
      ...reg,
      id: reg.regions_id,
      name: reg.description,
      current_value: regionValue,
      allocation_percent: totalValue > 0 ? (regionValue / totalValue) * 100 : 0,
      holding_count: countriesWithRegionalWeight.reduce((sum, c) => sum + c.holding_count, 0),
      countries: countriesWithRegionalWeight // Nu aanwezig!
    };
  }).filter(r => r.current_value > 0);

// 9. Market Allocation
  const marketAllocation: EnrichedMarket[] = dbMarkets.map((m) => {
    // We matchen op de 'market' kolom in je PortfolioItem/dbMetadata
    const holdingsInMarket = enrichedHoldings.filter(
      (h) => h.market === m.full_name || h.market === m.markets_abbreviation
    );

    const marketValue = holdingsInMarket.reduce((sum, h) => sum + h.marketValue, 0);

    return {
      ...m,
      id: m.markets_id,
      name: m.full_name,
      current_value: marketValue,
      allocation_percent: totalValue > 0 ? (marketValue / totalValue) * 100 : 0,
      holding_count: holdingsInMarket.length
    };
  }).filter(market => market.current_value > 0);

// --- 10. ASSET ENRICHMENT & STATS ---

  // We mappen over dbAssets omdat deze de relationele ID's bevat (markets_id, etc.)
  const enrichedAssets: EnrichedAsset[] = dbAssets.map((asset) => {
    const market = dbMarkets.find(m => m.markets_id === asset.markets_id);
    const assetClass = dbAssetClasses.find(ac => ac.asset_classes_id === asset.asset_classes_id);
    const currency = dbCurrencies.find(c => c.currencies_id === asset.currencies_id);
    const industry = dbIndustries.find(i => i.asset_industries_id === asset.asset_industries_id);
    const country = dbCountries.find(co => co.countries_id === asset.countries_id);

    // Metadata ophalen uit de flat list (dbMetadata) voor de prijs
    const metadata = dbMetadata.find((m) => m.ticker === asset.ticker);
    const currentPrice = metadata?.price ?? 0;

    // Koppelen aan de gebruikersportefeuille
    const userHolding = deafaultPortfolio.find((h) => h.ticker === asset.ticker);
    const quantity = userHolding?.quantity ?? 0;
    const marketValue = quantity * currentPrice;

    const isTracker = assetClass?.asset_class.toLowerCase().includes('etf') || 
                      assetClass?.asset_class.toLowerCase().includes('tracker');

    return {
      ...asset,
      market_name: market?.full_name ?? 'Unknown',
      asset_class_name: assetClass?.asset_class ?? 'Unknown',
      currency_code: currency?.ISO_code ?? '???',
      industry_name: industry?.description ?? 'Unknown',
      country_name: country?.full_name ?? 'Unknown',
      current_price: currentPrice,
      total_quantity: quantity,
      total_market_value: marketValue,
      is_tracker: isTracker,
      isin: asset.ISIN || metadata?.isin || null
    } as EnrichedAsset;
  });

  // Bereken de samenvattende statistieken
  const stats: PortfolioStats = {
    total_assets: enrichedAssets.filter(a => a.total_quantity > 0).length,
    unique_markets: new Set(enrichedAssets.filter(a => a.total_quantity > 0).map(a => a.markets_id)).size,
    unique_asset_classes: new Set(enrichedAssets.filter(a => a.total_quantity > 0).map(a => a.asset_classes_id)).size,
    unique_sectors: new Set(dbSectors.map(s => s.asset_sectors_id)).size,
    tracker_count: enrichedAssets.filter(a => a.is_tracker && a.total_quantity > 0).length,
    stock_count: enrichedAssets.filter(a => !a.is_tracker && a.total_quantity > 0).length,
  };

  // --- 11. FINALE RETURN ---
  return {
    id: "main-portfolio-snapshot",
    name: "Mijn Vermogen",
    holdings: enrichedHoldings,
    assetAllocation,
    sectorAllocation,
    industryAllocation,
    currencyExposure,
    regionAllocation,
    countryAllocation,
    marketAllocation,
    enrichedAssets, // Belangrijk: toevoegen aan return
    stats,          // Belangrijk: toevoegen aan return
    totalValue,
    lastUpdated: snapshotDate
  };
};