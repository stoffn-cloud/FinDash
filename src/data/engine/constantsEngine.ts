import { DefaultHolding } from "@/data/constants/defaultHolding";
import { Prisma } from "@prisma/client";

type AssetWithHistory = Prisma.assetsGetPayload<{
  include: {
    OHLCV_history: { select: { date_id: true; close_price: true } };
    asset_industries: true;
    countries: true;
  };
}>;

export const processSnapshot = (
  defaultHoldings: DefaultHolding[],
  dbData: AssetWithHistory[],
  snapshotDate: string
) => {
  // 1. Verrijk de individuele holdings
  const processedHoldings = defaultHoldings.map((def) => {
    const asset = dbData.find((a) => a.ticker_id === def.ticker_id);
    if (!asset) return null;

    const currentPrice = Number(asset.OHLCV_history?.[0]?.close_price || 0);
    const quantity = Number(def.quantity);
    const purchasePrice = Number(def.purchasePrice || 0);
    const marketValue = quantity * currentPrice;
    const costBasis = quantity * purchasePrice;

    return {
      id: asset.ticker_id,
      ticker: asset.ticker,
      name: asset.full_name,
      sector: asset.asset_industries?.description || "Unknown",
      country: asset.countries?.full_name || "Unknown",
      asset_class: "Equity", // Default voor nu
      quantity,
      purchase_price: purchasePrice,
      current_price: currentPrice,
      current_value: marketValue, // Cruciaal veld voor de charts
      costBasis,
      pnlAbsolute: marketValue - costBasis,
      pnlPercentage: costBasis > 0 ? ((marketValue - costBasis) / costBasis) * 100 : 0,
    };
  });

  const cleanHoldings = processedHoldings.filter((h): h is NonNullable<typeof h> => h !== null);
  const totalValue = cleanHoldings.reduce((sum, h) => sum + h.current_value, 0);

  // --- 2. AGGREGATIE: Bereken Sector Verdeling ---
  const sectorMap = new Map<string, any>();
  cleanHoldings.forEach(h => {
    const existing = sectorMap.get(h.sector) || { 
      name: h.sector, 
      current_value: 0, 
      holding_count: 0,
      color: "#3B82F6" // We kunnen later dynamische kleuren toevoegen
    };
    existing.current_value += h.current_value;
    existing.holding_count += 1;
    sectorMap.set(h.sector, existing);
  });

  const sectorAllocation = Array.from(sectorMap.values()).map(s => ({
    ...s,
    allocation_percent: totalValue > 0 ? (s.current_value / totalValue) * 100 : 0
  }));

  // --- 3. AGGREGATIE: Bereken Asset Class Verdeling ---
  const assetAllocation = [{
    id: 1,
    name: "Equity",
    current_value: totalValue,
    allocation_percent: 100,
    color: "#3B82F6",
    assets: cleanHoldings // De tabel wil soms de onderliggende assets zien
  }];

  // --- 4. RETURN: Het complete Portfolio object ---
  return {
    holdings: cleanHoldings,
    totalValue,
    // Deze twee keys zorgen dat je charts en tabellen data krijgen
    sectorAllocation, 
    assetAllocation,
    stats: {
      total_assets: cleanHoldings.length,
      unique_sectors: sectorAllocation.length,
      total_value: totalValue,
      stock_count: cleanHoldings.length,
      tracker_count: 0,
      unique_markets: new Set(cleanHoldings.map(h => h.country)).size,
    },
    lastUpdated: snapshotDate,
  };
};