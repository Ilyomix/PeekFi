import { create } from 'zustand';

interface ScreenerDisplayPreferencesState {
  itemsPerPage: number;
  filter: string;
  categoryFilter?: string;
  categoryName?: string;
  setItemsPerPage: (items?: number) => void;
  setCategoryFilter: (category?: string) => void;
}

export const useScreenerDisplayPreferences =
  create<ScreenerDisplayPreferencesState>((set) => ({
    itemsPerPage: 20,
    filter: 'market_cap',
    categoryFilter: undefined,
    setItemsPerPage: (items) => set({ itemsPerPage: items }),
    setCategoryFilter: (category) => set({ categoryFilter: category })
  }));
