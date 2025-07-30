import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '../services/bookApi';
import { useBookStore } from '../store/bookStore';
import { AuthorDetails, Book, BookDetails } from '../types';

// Search books hook - improved with signal support and better enabled logic
export const useSearchBooks = (query: string, enabled = true) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: ({ signal }) => bookApi.searchBooks(query, 20, signal),
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

// Get book details hook - improved with signal support
export const useBookDetails = (workId: string | undefined) => {
  return useQuery({
    queryKey: ['books', 'details', workId],
    queryFn: ({ signal }) => bookApi.getBookDetails(workId!, signal),
    enabled: !!workId,
    staleTime: 30 * 60 * 1000, // 30 minutes - longer since book details don't change often
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Trending books hook - improved with signal support
export const useTrendingBooks = () => {
  return useQuery({
    queryKey: ['books', 'trending'],
    queryFn: ({ signal }) => bookApi.getTrendingBooks(signal),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Classic books hook - improved with signal support
export const useClassicBooks = () => {
  return useQuery({
    queryKey: ['books', 'classic'],
    queryFn: ({ signal }) => bookApi.getClassicBooks(signal),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get books by subject hook - improved with signal support and enabled check
export const useSubjectBooks = (subject: string | undefined) => {
  return useQuery({
    queryKey: ['books', 'subject', subject],
    queryFn: ({ signal }) => bookApi.getBooksBySubject(subject!, signal),
    enabled: !!subject && subject.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Author books hook - improved with signal support and better enabled check
export const useAuthorBooksDetailed = (authorId: string | undefined, limit: number = 50) => {
  return useQuery({
    queryKey: ['author', 'books-detailed', authorId, limit],
    queryFn: ({ signal }) => bookApi.getAuthorBestBooks(authorId!, limit, signal),
    enabled: !!authorId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Simple hook using the combined API method - eliminates race conditions entirely
export const useBookWithAuthors = (workId: string | undefined) => {
  return useQuery<{ book: BookDetails; authors: AuthorDetails[] }>({
    queryKey: ['book', 'with-authors', workId],
    queryFn: ({ signal }) => bookApi.getBookWithAuthors(workId!, signal),
    enabled: !!workId,
    staleTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Convenience hook that destructures the result for easier use
export const useBookAndAuthors = (workId: string | undefined) => {
  const query = useBookWithAuthors(workId);
  
  return {
    book: query.data?.book,
    authors: query.data?.authors,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    isFetching: query.isFetching, // Added for loading states during refetch
  };
};

// Improved mutations with better error handling and optimistic updates
export const useBookActions = () => {
  const queryClient = useQueryClient();
  const { addToFavorites, removeFromFavorites, toggleFavorite, isFavorite } = useBookStore();

  const addToFavoritesMutation = useMutation({
    mutationFn: async (book: Book) => {
      // Simulate API call if needed - add delay for realism
      await new Promise(resolve => setTimeout(resolve, 100));
      return book;
    },
    onMutate: async (book) => {
      // Optimistic update - add to favorites immediately
      addToFavorites(book);
      return { book };
    },
    onError: (error, book, context) => {
      // Rollback on error
      if (context?.book) {
        removeFromFavorites(context.book.key);
      }
      console.error('Failed to add to favorites:', error);
    },
    onSuccess: (book) => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (bookKey: string) => {
      // Simulate API call if needed
      await new Promise(resolve => setTimeout(resolve, 100));
      return bookKey;
    },
    onMutate: async (bookKey) => {
      // Optimistic update - remove from favorites immediately
      removeFromFavorites(bookKey);
      return { bookKey };
    },
    onError: (error, bookKey, context) => {
      // Note: Rolling back remove is complex since we need the full book object
      // You might want to store removed books temporarily for rollback
      console.error('Failed to remove from favorites:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return {
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    toggleFavorite,
    isFavorite,
    isAddingToFavorites: addToFavoritesMutation.isPending,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    addToFavoritesAsync: addToFavoritesMutation.mutateAsync, // For when you need to await
    removeFromFavoritesAsync: removeFromFavoritesMutation.mutateAsync,
  };
};