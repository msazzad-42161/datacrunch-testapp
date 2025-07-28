import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '../services/bookApi';
import { useBookStore } from '../store/bookStore';
import { Book } from '../types';

// Search books hook
export const useSearchBooks = (query: string, enabled = true) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => bookApi.searchBooks(query),
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get book details hook
export const useBookDetails = (workId: string) => {
  return useQuery({
    queryKey: ['books', 'details', workId],
    queryFn: () => bookApi.getBookDetails(workId),
    enabled: !!workId,
  });
};

// Trending books hook
export const useTrendingBooks = () => {
  return useQuery({
    queryKey: ['books', 'trending'],
    queryFn: bookApi.getTrendingBooks,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Custom hook that combines React Query with Zustand
export const useBookActions = () => {
  const queryClient = useQueryClient();
  const { addToFavorites, removeFromFavorites, toggleFavorite, isFavorite } = useBookStore();

  const addToFavoritesMutation = useMutation({
    mutationFn: async (book: Book) => {
      // Simulate API call if needed
      return Promise.resolve(book);
    },
    onSuccess: (book) => {
      addToFavorites(book);
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return {
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    isAddingToFavorites: addToFavoritesMutation.isPending,
  };
};