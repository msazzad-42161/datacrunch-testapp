import { useQuery } from '@tanstack/react-query';
import { bookApi } from '../services/bookApi';
import { AuthorDetails, BookDetails } from '../types';

export const useAuthorDetails = (authorId: string | undefined) => {
  return useQuery<AuthorDetails>({
    queryKey: ['author', 'details', authorId],
    queryFn: () => bookApi.getAuthorDetails(authorId!),
    enabled: !!authorId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useAllAuthorDetails = (
  authors: Array<{ author: { key: string }; type: { key: string } }> | undefined
) => {
  return useQuery<AuthorDetails[]>({
    queryKey: ['authors', 'details', 'all', authors?.map(a => a.author.key).sort().join(',')],
    queryFn: ({ signal }) => bookApi.fetchAllAuthorDetails(authors!, signal),
    enabled: !!authors && authors.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};