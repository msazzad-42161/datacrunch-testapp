import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/book';

// Storage keys
export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
  READING_HISTORY: 'reading_history',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC: 'last_sync',
  OFFLINE_BOOKS: 'offline_books',
} as const;

export interface ReadingHistoryEntry {
  book: Book;
  readAt: string;
  rating?: number;
  review?: string;
}

export interface UserPreferences {
  notifications: {
    dailyReminder: boolean;
    recommendations: boolean;
    goalAchievements: boolean;
    reminderTime: string; // Format: "HH:mm"
  };
  readingGoal: {
    booksPerYear: number;
    currentProgress: number;
  };
  favoriteGenres: string[];
  displayPreferences: {
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark' | 'auto';
    showCovers: boolean;
  };
}

class StorageService {
  // Generic storage methods
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing item with key ${key}:`, error);
      throw new Error(`Failed to store ${key}`);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving item with key ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key ${key}:`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  // Favorites management
  async getFavorites(): Promise<Book[]> {
    return (await this.getItem<Book[]>(STORAGE_KEYS.FAVORITES)) || [];
  }

  async addToFavorites(book: Book): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.key === book.key);
      
      if (!isAlreadyFavorite) {
        favorites.push(book);
        await this.setItem(STORAGE_KEYS.FAVORITES, favorites);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  async removeFromFavorites(bookKey: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(book => book.key !== bookKey);
      await this.setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  async isFavorite(bookKey: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(book => book.key === bookKey);
    } catch (error) {
      console.error('Error checking if book is favorite:', error);
      return false;
    }
  }

  // Recent searches management
  async getRecentSearches(): Promise<string[]> {
    return (await this.getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES)) || [];
  }

  async addRecentSearch(query: string): Promise<void> {
    try {
      const recentSearches = await this.getRecentSearches();
      const filteredSearches = recentSearches.filter(search => search !== query);
      const updatedSearches = [query, ...filteredSearches].slice(0, 10); // Keep only last 10
      await this.setItem(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
    } catch (error) {
      console.error('Error adding recent search:', error);
      throw error;
    }
  }

  async clearRecentSearches(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  }

  // Reading history management
  async getReadingHistory(): Promise<ReadingHistoryEntry[]> {
    return (await this.getItem<ReadingHistoryEntry[]>(STORAGE_KEYS.READING_HISTORY)) || [];
  }

  async addToReadingHistory(entry: ReadingHistoryEntry): Promise<void> {
    try {
      const history = await this.getReadingHistory();
      // Remove existing entry if it exists
      const filteredHistory = history.filter(item => item.book.key !== entry.book.key);
      // Add new entry at the beginning
      const updatedHistory = [entry, ...filteredHistory];
      await this.setItem(STORAGE_KEYS.READING_HISTORY, updatedHistory);
    } catch (error) {
      console.error('Error adding to reading history:', error);
      throw error;
    }
  }

  async updateReadingHistoryEntry(bookKey: string, updates: Partial<ReadingHistoryEntry>): Promise<void> {
    try {
      const history = await this.getReadingHistory();
      const updatedHistory = history.map(entry => 
        entry.book.key === bookKey ? { ...entry, ...updates } : entry
      );
      await this.setItem(STORAGE_KEYS.READING_HISTORY, updatedHistory);
    } catch (error) {
      console.error('Error updating reading history entry:', error);
      throw error;
    }
  }

  // User preferences management
  async getUserPreferences(): Promise<UserPreferences> {
    const defaultPreferences: UserPreferences = {
      notifications: {
        dailyReminder: true,
        recommendations: true,
        goalAchievements: true,
        reminderTime: '19:00',
      },
      readingGoal: {
        booksPerYear: 24,
        currentProgress: 0,
      },
      favoriteGenres: [],
      displayPreferences: {
        fontSize: 'medium',
        theme: 'auto',
        showCovers: true,
      },
    };

    return (await this.getItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES)) || defaultPreferences;
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = { ...currentPreferences, ...updates };
      await this.setItem(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Theme management
  async getTheme(): Promise<'light' | 'dark' | 'auto'> {
    return (await this.getItem<'light' | 'dark' | 'auto'>(STORAGE_KEYS.THEME)) || 'auto';
  }

  async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Onboarding status
  async isOnboardingCompleted(): Promise<boolean> {
    return (await this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED)) || false;
  }

  async setOnboardingCompleted(): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
  }

  // Offline books management
  async getOfflineBooks(): Promise<Book[]> {
    return (await this.getItem<Book[]>(STORAGE_KEYS.OFFLINE_BOOKS)) || [];
  }

  async addOfflineBook(book: Book): Promise<void> {
    try {
      const offlineBooks = await this.getOfflineBooks();
      const isAlreadyOffline = offlineBooks.some(offline => offline.key === book.key);
      
      if (!isAlreadyOffline) {
        offlineBooks.push(book);
        await this.setItem(STORAGE_KEYS.OFFLINE_BOOKS, offlineBooks);
      }
    } catch (error) {
      console.error('Error adding offline book:', error);
      throw error;
    }
  }

  async removeOfflineBook(bookKey: string): Promise<void> {
    try {
      const offlineBooks = await this.getOfflineBooks();
      const updatedBooks = offlineBooks.filter(book => book.key !== bookKey);
      await this.setItem(STORAGE_KEYS.OFFLINE_BOOKS, updatedBooks);
    } catch (error) {
      console.error('Error removing offline book:', error);
      throw error;
    }
  }

  // Sync management
  async getLastSyncTime(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.LAST_SYNC);
  }

  async updateLastSyncTime(): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  // Storage usage info
  async getStorageInfo(): Promise<{ usedSpace: number; availableKeys: string[] }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return {
        usedSpace: totalSize,
        availableKeys: [...keys], // Create a mutable copy
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { usedSpace: 0, availableKeys: [] };
    }
  }

  // Bulk operations
  async bulkSet(items: Array<[string, any]>): Promise<void> {
    try {
      const stringifiedItems: Array<[string, string]> = items.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(stringifiedItems);
    } catch (error) {
      console.error('Error in bulk set:', error);
      throw error;
    }
  }

  async bulkGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const items = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      items.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error in bulk get:', error);
      return {};
    }
  }
}

export const storageService = new StorageService();