import { AuthorDetails, Book, BookDetails, SearchResponse } from '../types';
import { extractAuthorIds } from '../utils/helpers';

const BASE_URL = 'https://openlibrary.org';

// Add request cancellation support
const createAbortableRequest = (url: string, signal?: AbortSignal) => {
  return fetch(url, { signal });
};

export const bookApi = {
  searchBooks: async (query: string, limit = 20, signal?: AbortSignal): Promise<SearchResponse> => {
    const response = await createAbortableRequest(
      `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
      signal
    );
    
    if (!response.ok) {
      throw new Error('Failed to search books');
    }
    
    return response.json();
  },

  getBookDetails: async (workId: string, signal?: AbortSignal): Promise<BookDetails> => {
    const response = await createAbortableRequest(`${BASE_URL}/works/${workId}.json`, signal);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }
    
    return response.json();
  },

  getTrendingBooks: async (signal?: AbortSignal): Promise<SearchResponse> => {
    const response = await createAbortableRequest(
      `${BASE_URL}/search.json?q=trending_score_hourly_sum%3A%5B1+TO+%2A%5D+language%3Aeng&sort=trending`,
      signal
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending books');
    }
    
    return response.json();
  },

  getClassicBooks: async (signal?: AbortSignal): Promise<SearchResponse> => {
    const response = await createAbortableRequest(
      `${BASE_URL}/search.json?q=ddc%3A8%2A+first_publish_year%3A%5B%2A+TO+1950%5D+publish_year%3A%5B2000+TO+%2A%5D+NOT+public_scan_b%3Afalse+language%3Aeng&sort=trending`,
      signal
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch classic books');
    }
    
    return response.json();
  },

  getBooksBySubject: async (s: string, signal?: AbortSignal): Promise<SearchResponse> => {
    const subject = s.toLowerCase();
    const response = await createAbortableRequest(
      `${BASE_URL}/search.json?q=subject%3A${subject}+language%3Aeng&sort=trending&limit=20`,
      signal
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch books by subject');
    }
    
    return response.json();
  },

  getAuthorBestBooks: async (authorId: string, limit: number = 100, signal?: AbortSignal): Promise<Book[]> => {
    // Get both author details and works in parallel with proper cancellation
    const [authorResponse, worksResponse] = await Promise.all([
      createAbortableRequest(`${BASE_URL}/authors/${authorId}.json`, signal),
      createAbortableRequest(`${BASE_URL}/authors/${authorId}/works.json?limit=${limit}&sort=trending`, signal)
    ]);
    
    if (!authorResponse.ok || !worksResponse.ok) {
      throw new Error('Failed to fetch author data or works');
    }
    
    const [authorData, worksData] = await Promise.all([
      authorResponse.json(),
      worksResponse.json()
    ]);
    
    return worksData.entries
      .filter((entry: any) => entry.type.key === '/type/work')
      .map((work: any) => ({
        key: work.key,
        title: work.title,
        author_name: [authorData.name],
        first_publish_year: work.first_publish_year,
        cover_i: work.covers?.[0],
        isbn: work.isbn,
        subject: work.subjects,
        publisher: work.publishers,
        language: work.languages,
        number_of_pages_median: work.number_of_pages_median,
      } as Book))
      .filter((book: Book) => book.cover_i)
      .sort((a: Book, b: Book) => (a.first_publish_year || 0) - (b.first_publish_year || 0));
  },

  getAuthorDetails: async (authorId: string, signal?: AbortSignal): Promise<AuthorDetails> => {
    console.log('getAuthorDetails called with:', authorId);
    
    if (!authorId) {
      throw new Error('Author ID is required');
    }
    
    // authorId should already be clean (e.g., "OL7632574A")
    const response = await createAbortableRequest(`${BASE_URL}/authors/${authorId}.json`, signal);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch author details: ${response.status}`);
    }
    
    const authorData = await response.json();
    console.log('Author data received:', authorData);
    
    return authorData;
  },

  // Enhanced version with better error handling and race condition prevention
  fetchAllAuthorDetails: async function(
    authors: Array<{ author: { key: string }; type: { key: string } }> = [], 
    signal?: AbortSignal
  ): Promise<AuthorDetails[]> {
    console.log('fetchAllAuthorDetails called with:', authors);
    
    if (!authors?.length) {
      console.log('No authors, returning empty array');
      return [];
    }
  
    let authorIds: string[];
    
    try {
      authorIds = extractAuthorIds(authors);
      console.log('extractAuthorIds returned:', authorIds);
    } catch (error) {
      console.error('ERROR in extractAuthorIds:', error);
      return [];
    }
    
    if (authorIds.length === 0) {
      console.log('No author IDs extracted');
      return [];
    }
    
    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled(
      authorIds.map((id: string) => {
        console.log('Fetching author details for ID:', id);
        return this.getAuthorDetails(id, signal);
      })
    );
    
    // Filter out failed requests and return successful ones
    return results
      .filter((result): result is PromiseFulfilledResult<AuthorDetails> => {
        if (result.status === 'rejected') {
          console.error('Failed to get author details:', result.reason);
        }
        return result.status === 'fulfilled';
      })
      .map(result => result.value);
  },
  

  // New combined method for book + authors in one API call
  getBookWithAuthors: async function(
    workId: string, 
    signal?: AbortSignal
  ): Promise<{ book: BookDetails; authors: AuthorDetails[] }> {
    // First get book details
    const book = await this.getBookDetails(workId, signal);
    
    // Then get all authors
    const authors = book.authors ? await this.fetchAllAuthorDetails(book.authors, signal) : [];
    
    return { book, authors };
  },
};