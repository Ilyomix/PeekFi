import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  itemsPerPage: number;
  filter: string;
  setItemsPerPage: (value: number) => void;
  setFilter: (value: string) => void;
}

/**
 * useScreenerDisplayPreferences - A Zustand store to manage user preferences for the screener display.
 *
 * @returns {PreferencesState} The state and actions to manage screener display preferences.
 */
export const useScreenerDisplayPreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      itemsPerPage: 25,
      filter: 'market_cap_desc',

      setItemsPerPage: (value) => set(() => ({ itemsPerPage: value })),
      setFilter: (value) => set(() => ({ filter: value }))
    }),
    {
      name: 'user-screener-display-preferences'
    }
  )
);
