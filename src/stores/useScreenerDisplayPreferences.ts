import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScreenerDisplayPreferencesState {
  itemsPerPage: number;
  filter: string;
  categoryFilter?: string;
  categoryName?: string;
  setItemsPerPage: (items?: number) => void;
  setCategoryFilter: (category?: string) => void;
}

export const useScreenerDisplayPreferences = create(
  persist<ScreenerDisplayPreferencesState>(
    (set) => ({
      itemsPerPage: 20,
      filter: 'market_cap',
      categoryFilter: undefined,
      setItemsPerPage: (items) => set({ itemsPerPage: items }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
    }),
    {
      name: 'screener-display-preferences' // Key name in localStorage
      // Optionally, you can provide additional configurations like versioning, etc.
    }
  )
);
