import { portfolioStore } from "./portfolioStore";

// We maken een universele "nep" client die altijd jouw data teruggeeft
export const base44 = {
  // Dit simuleert de data-ophaler die je dashboard gebruikt
  useQuery: (key: any) => {
    console.log("Dashboard vraagt data op voor:", key);
    return {
      data: portfolioStore.getPortfolio(),
      isLoading: false,
      error: null,
      refetch: () => portfolioStore.fetchLivePrices()
    };
  },
  
  // Mocht de code directe API-calls doen (async/await)
  get: async (path: string) => {
    return portfolioStore.getPortfolio();
  }
};