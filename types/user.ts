import { Book } from "./book";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
    preferences?: {
      favoriteGenres: string[];
      readingGoal?: number;
      notifications: {
        dailyReminder: boolean;
        newRecommendations: boolean;
        goalAchievements: boolean;
      };
    };
  }
  
  export interface UserProfile extends User {
    bio?: string;
    location?: string;
    booksRead: number;
    currentlyReading: Book[];
    readingStats: {
      totalBooks: number;
      totalPages: number;
      averageRating: number;
    };
  }