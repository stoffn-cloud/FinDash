import { Country, Region, EnrichedCountry, EnrichedRegion, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

export const calculateGeoAllocation = (
  dbCountries: Country[],
  dbRegions: Region[],
  holdings: EnrichedHolding[],
  totalValue: number
) => {
  // 1. Bereken Landen (Platte lijst voor directe toegang)
  const countryAllocation: EnrichedCountry[] = dbCountries.map((country) => {
    const holdingsInCountry = holdings.filter(h => h.countries_id === country.countries_id);
    const countryValue = holdingsInCountry.reduce((sum, h) => sum + h.marketValue, 0);
    
    return {
      ...country,
      id: country.countries_id,
      name: country.full_name,
      current_value: countryValue,
      allocation_total_percent: calcWeight(countryValue, totalValue),
      allocation_region_percent: 0, // Wordt hieronder in de regio-stap geüpdatet
      holding_count: holdingsInCountry.length
    };
  })
  .filter(c => c.current_value > 0)
  .sort((a, b) => b.current_value - a.current_value);

  // 2. Bereken Regio's (Geaggregeerde lijst met geneste landen)
  const regionAllocation: EnrichedRegion[] = dbRegions.map((reg, idx) => {
    const countriesInRegion = countryAllocation.filter(c => c.regions_id === reg.regions_id);
    const regionValue = countriesInRegion.reduce((sum, c) => sum + c.current_value, 0);

    return {
      ...reg,
      id: reg.regions_id,
      name: reg.description,
      current_value: regionValue,
      allocation_percent: calcWeight(regionValue, totalValue),
      holding_count: countriesInRegion.reduce((sum, c) => sum + c.holding_count, 0),
      color: `hsl(${(idx * 60) % 360}, 65%, 45%)`, // Unieke kleur per regio
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