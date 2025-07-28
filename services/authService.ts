import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

// Simulate auth API endpoints
const AUTH_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Mock API for demo

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  // Simulate login API call
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, this would be server-side
      if (credentials.email === 'demo@bookshelf.com' && credentials.password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'Demo User',
          email: credentials.email,
          avatar: undefined,
          createdAt: new Date().toISOString(),
          preferences: {
            favoriteGenres: ['Fiction', 'Mystery'],
            readingGoal: 24,
            notifications: {
              dailyReminder: true,
              newRecommendations: true,
              goalAchievements: true,
            },
          },
        };

        const token = 'mock_jwt_token_' + Date.now();
        
        // Store auth data
        await this.storeAuthData(mockUser, token);
        
        return { user: mockUser, token };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Login failed: ' + (error as Error).message);
    }
  }

  // Simulate register API call
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user creation
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        avatar: undefined,
        createdAt: new Date().toISOString(),
        preferences: {
          favoriteGenres: [],
          readingGoal: 12,
          notifications: {
            dailyReminder: true,
            newRecommendations: true,
            goalAchievements: true,
          },
        },
      };

      const token = 'mock_jwt_token_' + Date.now();
      
      // Store auth data
      await this.storeAuthData(newUser, token);
      
      return { user: newUser, token };
    } catch (error) {
      throw new Error('Registration failed: ' + (error as Error).message);
    }
  }

  // Store authentication data
  async storeAuthData(user: User, token: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.TOKEN_KEY, token],
        [this.USER_KEY, JSON.stringify(user)],
      ]);
    } catch (error) {
      throw new Error('Failed to store auth data');
    }
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
    } catch (error) {
      throw new Error('Failed to logout');
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const currentUser = await this.getStoredUser();
      if (!currentUser) {
        throw new Error('No user found');
      }

      const updatedUser = { ...currentUser, ...updates };
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update profile: ' + (error as Error).message);
    }
  }

  // Validate token (simulate API call)
  async validateToken(token: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock validation - in real app, this would verify with server
      return token.startsWith('mock_jwt_token_');
    } catch (error) {
      return false;
    }
  }

  // Refresh token (simulate API call)
  async refreshToken(): Promise<string | null> {
    try {
      const currentToken = await this.getToken();
      if (!currentToken) return null;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newToken = 'mock_jwt_token_' + Date.now();
      await AsyncStorage.setItem(this.TOKEN_KEY, newToken);
      
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
}

export const authService = new AuthService();