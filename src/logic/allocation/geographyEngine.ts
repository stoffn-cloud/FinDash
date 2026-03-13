import { Country, Region, EnrichedCountry, EnrichedRegion, EnrichedHolding } from "@/types";
import { calcWeight } from "../core/math";

/**
 * Berekent de geografische verdeling (Landen & Regio's) van de portefeuille.
 * Inclusief verdedigingsmechanismen tegen undefined data.
 */
export const calculateGeoAllocation = (
  dbCountries: Country[] = [],     // Default naar lege array
  dbRegions: Region[] = [],        // Default naar lege array
  holdings: EnrichedHolding[] = [],
  totalValue: number = 0
) => {
  // 1. VEILIGHEIDSCHECK: Voorkom crashes bij ontbrekende database tabellen
  if (!dbCountries || !Array.isArray(dbCountries)) {
    return { regionAllocation: [], countryAllocation: [] };
  }

  // 2. BEREKEN LANDEN
  const countryAllocation: EnrichedCountry[] = dbCountries
    .map((country) => {
      // Gebruik 'as any' omdat countries_id in de verrijkte Asset-data zit
      const holdingsInCountry = holdings.filter(h => 
        (h as any).countries_id === country.countries_id
      );
      
      const countryValue = holdingsInCountry.reduce((sum, h) => sum + (h.marketValue || 0), 0);
      
      return {
        ...country,
        id: country.countries_id,
        name: country.full_name || "Unknown Country",
        current_value: countryValue,
        allocation_total_percent: calcWeight(countryValue, totalValue),
        allocation_region_percent: 0, // Wordt hieronder berekend
        holding_count: holdingsInCountry.length
      };
    })
    .filter(c => c.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  // 3. BEREKEN REGIO'S (Geaggregeerd op basis van de landen-lijst)
  const safeRegions = Array.isArray(dbRegions) ? dbRegions : [];

  const regionAllocation: EnrichedRegion[] = safeRegions
    .map((reg, idx) => {
      // Filter landen die tot deze regio behoren uit onze al berekende countryAllocation
      const countriesInRegion = countryAllocation.filter(c => c.regions_id === reg.regions_id);
      const regionValue = countriesInRegion.reduce((sum, c) => sum + c.current_value, 0);

      return {
        ...reg,
        id: reg.regions_id,
        name: reg.description || "Unknown Region",
        current_value: regionValue,
        allocation_percent: calcWeight(regionValue, totalValue),
        holding_count: countriesInRegion.reduce((sum, c) => sum + c.holding_count, 0),
        // Dynamische kleuren voor de wereldkaart of charts
        color: `hsl(${(idx * 145) % 360}, 60%, 45%)`, 
        countries: countriesInRegion.map(c => ({
          ...c,
          // Bereken hoe zwaar dit land weegt BINNEN zijn eigen regio
          allocation_region_percent: calcWeight(c.current_value, regionValue)
        }))
      };
    })
    .filter(r => r.current_value > 0)
    .sort((a, b) => b.current_value - a.current_value);

  return { regionAllocation, countryAllocation };
};