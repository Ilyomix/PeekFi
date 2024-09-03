import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { devtools } from 'react-zustand-devtools';

/**
 * Interface for the Favorites state.
 */
interface FavoritesState {
  favorites: string[];
  addFavorite: (symbol: string) => void;
  removeFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
}

type MyPersist = (
  config: StateCreator<FavoritesState>,
  options: PersistOptions<FavoritesState>
) => StateCreator<FavoritesState>;

/**
 * Custom hook to manage user favorites using Zustand.
 */
export const useFavoritesStore = create<FavoritesState>(
  devtools(
    (persist as MyPersist)(
      (set, get) => ({
        favorites: [],

        /**
         * Adds a symbol to the favorites list.
         * @param {string} symbol - The symbol to add to favorites.
         */
        addFavorite: (symbol: string) =>
          set((state: FavoritesState) => ({
            favorites: [...state.favorites, symbol]
          })),

        /**
         * Removes a symbol from the favorites list.
         * @param {string} symbol - The symbol to remove from favorites.
         */
        removeFavorite: (symbol: string) =>
          set((state: FavoritesState) => ({
            favorites: state.favorites.filter((fav) => fav !== symbol)
          })),

        /**
         * Checks if a symbol is in the favorites list.
         * @param {string} symbol - The symbol to check.
         * @returns {boolean} - True if the symbol is in the favorites list, false otherwise.
         */
        isFavorite: (symbol: string) => get().favorites.includes(symbol)
      }),
      {
        name: 'user-favorites' // Key name in localStorage
      }
    )
  )
);
