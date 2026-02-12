import { Country, Region, EnrichedCountry, EnrichedRegion, EnrichedHolding } from "@/types";

export const calculateGeoAllocation = (
  dbCountries: Country[],
  dbRegions: Region[],
  holdings: EnrichedHolding[],
  totalValue: number
) => {
  const countryAllocation: EnrichedCountry[] = dbCountries.map((country) => {
    const holdingsInCountry = holdings.filter(h => h.countries_id === country.countries_id);
    const countryValue = holdingsInCountry.reduce((sum, h) => sum + h.marketValue, 0);
    
    return {
      ...country,
      id: country.countries_id,
      name: country.full_name,
      current_value: countryValue,
      allocation_total_percent: totalValue > 0 ? (countryValue / totalValue) * 100 : 0,
      allocation_region_percent: 0, 
      holding_count: holdingsInCountry.length
    };
  }).filter(c => c.current_value > 0);

  const regionAllocation: EnrichedRegion[] = dbRegions.map((reg) => {
    const countriesInRegion = countryAllocation.filter(c => c.regions_id === reg.regions_id);
    const regionValue = countriesInRegion.reduce((sum, c) => sum + c.current_value, 0);

    return {
      ...reg,
      id: reg.regions_id,
      name: reg.description,
      current_value: regionValue,
      allocation_percent: totalValue > 0 ? (regionValue / totalValue) * 100 : 0,
      holding_count: countriesInRegion.reduce((sum, c) => sum + c.holding_count, 0),
      countries: countriesInRegion.map(c => ({
        ...c,
        allocation_region_percent: regionValue > 0 ? (c.current_value / regionValue) * 100 : 0
      }))
    };
  }).filter(r => r.current_value > 0);

  return { regionAllocation, countryAllocation };
};