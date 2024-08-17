import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { devtools } from 'react-zustand-devtools';

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

export const useFavoritesStore = create<FavoritesState>(
  devtools(
    (persist as MyPersist)(
      (set, get) => ({
        favorites: [],
        addFavorite: (symbol: string) =>
          set((state: FavoritesState) => ({
            favorites: [...state.favorites, symbol]
          })),
        removeFavorite: (symbol: string) =>
          set((state: FavoritesState) => ({
            favorites: state.favorites.filter((fav) => fav !== symbol)
          })),
        isFavorite: (symbol: string) => get().favorites.includes(symbol)
      }),
      {
        name: 'user-favorites' // Nom de la clé dans localStorage
      }
    )
  )
);
