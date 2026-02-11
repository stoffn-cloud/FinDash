import { db } from "../db"; // Jouw database connectie
import { calculatePortfolioSnapshot } from "../../logic/portfolioEngine";
import { 
  Asset, AssetClass, AssetIndustry, AssetSector, 
  Country, Currency, Market, PortfolioItem, Region 
} from "../../types";

export const getFullPortfolioData = async () => {
  try {
    // We halen alle 9 bronnen tegelijkertijd op
    const [
      dbMetadata,
      dbAssetClasses,
      dbSectors,
      dbIndustries,
      dbCurrencies,
      dbRegions,
      dbCountries,
      dbMarkets,
      dbAssets
    ] = await Promise.all([
      db.query<PortfolioItem[]>("SELECT * FROM portfolio_metadata"),
      db.query<AssetClass[]>("SELECT * FROM asset_classes"),
      db.query<AssetSector[]>("SELECT * FROM asset_sectors"),
      db.query<AssetIndustry[]>("SELECT * FROM asset_industries"),
      db.query<Currency[]>("SELECT * FROM currencies"),
      db.query<Region[]>("SELECT * FROM regions"),
      db.query<Country[]>("SELECT * FROM countries"),
      db.query<Market[]>("SELECT * FROM markets"),
      db.query<Asset[]>("SELECT * FROM assets")
    ]);

    // De engine verwerkt alle rauwe data tot één overzichtelijk Portfolio object
    const portfolioSnapshot = calculatePortfolioSnapshot(
      dbMetadata,
      dbAssetClasses,
      dbSectors,
      dbIndustries,
      dbCurrencies,
      dbRegions,
      dbCountries,
      dbMarkets,
      dbAssets,
      new Date().toISOString().split('T')[0] // Vandaag als snapshot date
    );

    return portfolioSnapshot;
  } catch (error) {
    console.error("Fout bij het ophalen van portfolio data:", error);
    throw new Error("Could not fetch complete portfolio data");
  }
};