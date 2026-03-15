import { Country, Region, EnrichedCountry, EnrichedRegion, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * We breiden de bestaande types uit voor intern gebruik in de engine.
 * Dit voorkomt 'as any' en geeft volledige autocomplete.
 */
interface CountryWithGeoMetrics extends EnrichedCountry {
  holding_count?: number;
  allocation_region_percent?: number;
}

interface RegionWithGeoMetrics extends EnrichedRegion {
  color: string;
  countries: CountryWithGeoMetrics[];
}

export const calculateGeoAllocation = (
  dbCountries: Country[] = [],
  dbRegions: Region[] = [],
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
): { regionAllocation: RegionWithGeoMetrics[], countryAllocation: EnrichedCountry[] } => {
  
  if (!dbCountries || !Array.isArray(dbCountries) || !Array.isArray(dbRegions)) {
    return { regionAllocation: [], countryAllocation: [] };
  }

  // 1. BEREKEN LANDEN
  const countryAllocation: CountryWithGeoMetrics[] = dbCountries
    .map((country) => {
      const holdingsInCountry = holdings.filter(
        (h) => Number(h.countries_id) === Number(country.countries_id)
      );
      
      const countryValue = holdingsInCountry.reduce(
        (sum, h) => sum + (Number(h.market_value) || 0), 
        0
      );
      
      return {
        ...country,
        id: country.countries_id,
        name: country.full_name || "Unknown Country",
        current_value: countryValue,
        allocation_percent: calcWeight(countryValue, totalValue),
        holding_count: holdingsInCountry.length,
      };
    })
    .filter(c => c.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  // 2. BEREKEN REGIO'S
  const regionAllocation: RegionWithGeoMetrics[] = dbRegions
    .map((reg, idx) => {
      const countriesInRegion = countryAllocation.filter(
        (c) => Number(c.regions_id) === Number(reg.regions_id)
      );
      
      const regionValue = countriesInRegion.reduce(
        (sum, c) => sum + c.current_value, 
        0
      );

      return {
        ...reg,
        id: reg.regions_id,
        name: reg.description || "Unknown Region",
        current_value: regionValue,
        allocation_percent: calcWeight(regionValue, totalValue),
        // We gebruiken de holding_count die we in stap 1 al berekend hebben
        holding_count: countriesInRegion.reduce((sum, c) => sum + (c.holding_count || 0), 0),
        color: `hsl(${(idx * 137) % 360}, 65%, 50%)`, 
        countries: countriesInRegion.map(c => ({
          ...c,
          allocation_region_percent: calcWeight(c.current_value, regionValue)
        }))
      };
    })
    .filter(r => r.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  return { regionAllocation, countryAllocation };
};