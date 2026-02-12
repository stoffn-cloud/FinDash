import { db } from "../db"; 
import { calculatePortfolioSnapshot } from "../../logic/engineOrchestrator";
import { RowDataPacket } from "mysql2";
import { 
  Asset, AssetClass, AssetSector, AssetIndustry, 
  Country, Currency, Market, Region, DefaultHolding 
} from "../../types";

export const getFullPortfolioData = async (userHoldings: DefaultHolding[]) => {
  try {
    const [
      [dbAssets],
      [dbAssetClasses],
      [dbSectors],
      [dbIndustries],
      [dbCurrencies],
      [dbRegions],
      [dbCountries],
      [dbMarkets]
    ] = await Promise.all([
      db.query<Asset[] & RowDataPacket[]>("SELECT * FROM assets"),
      db.query<AssetClass[] & RowDataPacket[]>("SELECT * FROM asset_classes"),
      db.query<AssetSector[] & RowDataPacket[]>("SELECT * FROM asset_sectors"),
      db.query<AssetIndustry[] & RowDataPacket[]>("SELECT * FROM asset_industries"),
      db.query<Currency[] & RowDataPacket[]>("SELECT * FROM currencies"),
      db.query<Region[] & RowDataPacket[]>("SELECT * FROM regions"),
      db.query<Country[] & RowDataPacket[]>("SELECT * FROM countries"),
      db.query<Market[] & RowDataPacket[]>("SELECT * FROM markets")
    ]);

    // De engine combineert de MySQL stamdata met je hardcoded holdings
    return calculatePortfolioSnapshot(
      dbAssets,
      dbAssetClasses,
      dbSectors,
      dbIndustries,
      dbCurrencies,
      dbRegions,
      dbCountries,
      dbMarkets,
      userHoldings, // Direct uit defaultHolding.ts
      []            // Prices (optioneel, indien OHLCV_history nog niet gekoppeld is)
    );
  } catch (error) {
    console.error("❌ Database/Engine Error:", error);
    throw error;
  }
};