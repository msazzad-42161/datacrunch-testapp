import { Book, BookDetails, SearchResponse } from '../types';

const BASE_URL = 'https://openlibrary.org';

export const bookApi = {
  searchBooks: async (query: string, limit = 20): Promise<SearchResponse> => {
    const response = await fetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search books');
    }
    
    return response.json();
  },

  getBookDetails: async (workId: string): Promise<BookDetails> => {
    const response = await fetch(`${BASE_URL}/works/${workId}.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }
    
    return response.json();
  },

  getTrendingBooks: async (): Promise<SearchResponse> => {
    // Get trending books by searching for popular subjects
    const response = await fetch(
      `${BASE_URL}/search.json?subject=fiction&sort=rating&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending books');
    }
    
    return response.json();
  },
};