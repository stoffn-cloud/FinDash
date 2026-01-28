// Tijdelijke oplossing om de Base44 foutmelding te stoppen
export const base44 = {
  useQuery: () => ({ data: null, isLoading: false, error: null }),
  get: async () => ({}),
  // Voeg hier andere functies toe als de terminal erom vraagt
};