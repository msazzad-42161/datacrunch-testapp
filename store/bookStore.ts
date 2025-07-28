import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/book';

interface BookStore {
  // State
  favorites: Book[];
  searchQuery: string;
  recentSearches: string[];
  
  // Actions
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (bookKey: string) => void;
  toggleFavorite: (book: Book) => void;
  isFavorite: (bookKey: string) => boolean;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      searchQuery: '',
      recentSearches: [],

      // Actions
      addToFavorites: (book) =>
        set((state) => ({
          favorites: [...state.favorites, book],
        })),

      removeFromFavorites: (bookKey) =>
        set((state) => ({
          favorites: state.favorites.filter((book) => book.key !== bookKey),
        })),

      toggleFavorite: (book) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some((fav) => fav.key === book.key);
        
        if (isAlreadyFavorite) {
          get().removeFromFavorites(book.key);
        } else {
          get().addToFavorites(book);
        }
      },

      isFavorite: (bookKey) => {
        const { favorites } = get();
        return favorites.some((book) => book.key === bookKey);
      },

      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((search) => search !== query),
          ].slice(0, 10), // Keep only last 10 searches
        })),

      clearRecentSearches: () =>
        set({ recentSearches: [] }),
    }),
    {
      name: 'book-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        recentSearches: state.recentSearches,
      }),
    }
  )
);