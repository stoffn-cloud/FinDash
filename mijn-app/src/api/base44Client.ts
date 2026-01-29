import { mockPortfolio } from "./mockData";

// We maken een universele "nep" client die altijd jouw data teruggeeft
export const base44 = {
  // Dit simuleert de data-ophaler die je dashboard gebruikt
  useQuery: (key) => {
    console.log("Dashboard vraagt data op voor:", key);
    return {
      data: mockPortfolio,
      isLoading: false,
      error: null,
      refetch: () => console.log("Refetch aangeroepen")
    };
  },
  
  // Mocht de code directe API-calls doen (async/await)
  get: async (path) => {
    return mockPortfolio;
  }
};