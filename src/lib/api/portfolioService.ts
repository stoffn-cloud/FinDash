import { db } from "../db"; 
import { calculatePortfolioSnapshot } from "../../logic/engineOrchestrator";
import { RowDataPacket } from "mysql2"; // Belangrijk voor TypeScript
import { 
  Asset, AssetClass, AssetIndustry, AssetSector, 
  Country, Currency, Market, PortfolioItem, Region 
} from "../../types";

export const getFullPortfolioData = async () => {
  try {
    // We gebruiken [rows] om alleen de data te pakken en de 'fields' metadata te negeren
    // We casten de resultaten naar de juiste types die RowDataPacket extenden
    const [
      [dbHoldings], // Veranderd van portfolio_metadata naar holdings (of assets)
      [dbAssetClasses],
      [dbSectors],
      [dbIndustries],
      [dbCurrencies],
      [dbRegions],
      [dbCountries],
      [dbMarkets],
      [dbAssets]
    ] = await Promise.all([
      db.query<PortfolioItem[] & RowDataPacket[]>("SELECT * FROM holdings"), 
      db.query<AssetClass[] & RowDataPacket[]>("SELECT * FROM asset_classes"),
      db.query<AssetSector[] & RowDataPacket[]>("SELECT * FROM asset_sectors"),
      db.query<AssetIndustry[] & RowDataPacket[]>("SELECT * FROM asset_industries"),
      db.query<Currency[] & RowDataPacket[]>("SELECT * FROM currencies"),
      db.query<Region[] & RowDataPacket[]>("SELECT * FROM regions"),
      db.query<Country[] & RowDataPacket[]>("SELECT * FROM countries"),
      db.query<Market[] & RowDataPacket[]>("SELECT * FROM markets"),
      db.query<Asset[] & RowDataPacket[]>("SELECT * FROM assets")
    ]);

    // De engine verwerkt alle data
    const portfolioSnapshot = calculatePortfolioSnapshot(
      dbHoldings,
      dbAssetClasses,
      dbSectors,
      dbIndustries,
      dbCurrencies,
      dbRegions,
      dbCountries,
      dbMarkets,
      dbAssets,
      new Date().toISOString().split('T')[0]
    );

    return portfolioSnapshot;
  } catch (error) {
    console.error("Fout bij het ophalen van portfolio data:", error);
    throw new Error("Could not fetch complete portfolio data");
  }
};