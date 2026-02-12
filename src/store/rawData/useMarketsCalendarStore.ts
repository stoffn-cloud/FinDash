import { create } from 'zustand';
import { MarketCalendar } from '@/types';

// We verrijken het type met de joins uit je Prisma query
export type CalendarWithDetails = MarketCalendar & {
  markets: {
    full_name: string;
    markets_abbreviation: string;
  };
  date_dim: {
    day_name: string;
    month_name: string;
    is_weekend: boolean;
  };
};

interface MarketsCalendarState {
  calendarData: CalendarWithDetails[];
  isLoading: boolean;
  error: string | null;
  fetchCalendar: (limit?: number) => Promise<void>;
}

export const useMarketsCalendarStore = create<MarketsCalendarState>((set) => ({
  calendarData: [],
  isLoading: false,
  error: null,

  fetchCalendar: async (limit = 100) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/markets/calendar?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Kalendergegevens laden mislukt: ${response.statusText}`);
      }

      const data = await response.json();
      
      set({ 
        calendarData: data, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error("❌ Markets Calendar Store Error:", error);
      set({ 
        error: error.message || "Kon kalender niet laden", 
        isLoading: false 
      });
    }
  },
}));