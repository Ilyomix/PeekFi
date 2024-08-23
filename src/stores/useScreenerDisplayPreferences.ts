import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  itemsPerPage: number;
  cardsPerRow: number;
  filter: string;
  setItemsPerPage: (value: number) => void;
  setCardsPerRow: (value: number) => void;
  setFilter: (value: string) => void;
}

export const useScreenerDisplayPreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      itemsPerPage: 25, // Default value
      cardsPerRow: 4, // Default value
      filter: 'market_cap_desc', // Default filter value
      setItemsPerPage: (value) => set({ itemsPerPage: value }),
      setCardsPerRow: (value) => set({ cardsPerRow: value }),
      setFilter: (value) => set({ filter: value })
    }),
    {
      name: 'user-screener-display-preferences' // Storage key
    }
  )
);
