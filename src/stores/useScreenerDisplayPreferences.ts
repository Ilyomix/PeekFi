import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  itemsPerPage: number;
  cardsPerRow: number;
  setItemsPerPage: (value: number) => void;
  setCardsPerRow: (value: number) => void;
}

export const useScreenerDisplayPreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      itemsPerPage: 25, // Valeur par défaut
      cardsPerRow: 4, // Valeur par défaut
      setItemsPerPage: (value) => set({ itemsPerPage: value }),
      setCardsPerRow: (value) => set({ cardsPerRow: value })
    }),
    {
      name: 'user-screnner-display-preferences'
    }
  )
);
