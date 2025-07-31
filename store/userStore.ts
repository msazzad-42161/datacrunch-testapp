import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { notificationService } from '../services/notificationService';

interface UserStore {
  // State
  user: User | null;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderSeconds: number; // Changed from dailyReminderTime
  dailyReminderNotificationId: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotifications: () => void;
  
  // Daily Reminder Actions
  toggleDailyReminder: () => Promise<void>;
  setDailyReminderSeconds: (seconds: number) => Promise<void>; // Changed from setDailyReminderTime
  initializeDailyReminder: () => Promise<void>;
  
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
// Initial state
user: null,
theme: 'light',
notificationsEnabled: true,
dailyReminderEnabled: false,
dailyReminderSeconds: 30, // Changed from dailyReminderTime object
dailyReminderNotificationId: null,

      // Basic Actions
      setUser: (user) => set({ user }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      setTheme: (theme) => set({ theme }),

      toggleNotifications: async () => {
        const state = get();
        const newNotificationsEnabled = !state.notificationsEnabled;
        
        if (!newNotificationsEnabled) {
          // If disabling notifications, cancel ALL notifications
          await notificationService.cancelAllNotifications();
          set({ 
            notificationsEnabled: newNotificationsEnabled,
            dailyReminderEnabled: false,
            dailyReminderNotificationId: null 
          });
        } else {
          set({ notificationsEnabled: newNotificationsEnabled });
          
          // If enabling notifications and daily reminder was previously enabled
          if (newNotificationsEnabled && state.dailyReminderEnabled) {
            await get().initializeDailyReminder();
          }
        }
      },

      // Daily Reminder Actions
      toggleDailyReminder: async () => {
        const state = get();
        const newDailyReminderState = !state.dailyReminderEnabled;
        
        try {
          if (newDailyReminderState && state.notificationsEnabled) {
            // Schedule daily reminder
            const notificationId = await notificationService.scheduleDailyReminder(
              state.dailyReminderSeconds // Changed from hour, minute
            );
            
            set({
              dailyReminderEnabled: true,
              dailyReminderNotificationId: notificationId,
            });
          } else {
            // Cancel daily reminder
            if (state.dailyReminderNotificationId) {
              await notificationService.cancelNotification(state.dailyReminderNotificationId);
            }
            
            set({
              dailyReminderEnabled: false,
              dailyReminderNotificationId: null,
            });
          }
        } catch (error) {
          console.error('Error toggling daily reminder:', error);
        }
      },

      setDailyReminderSeconds: async (seconds: number) => {
        const state = get();
        
        try {
          // Update the seconds in state first
          set({
            dailyReminderSeconds: seconds,
          });
      
          // If daily reminder is currently enabled, reschedule it
          if (state.dailyReminderEnabled && state.notificationsEnabled) {
            // Cancel existing notification
            if (state.dailyReminderNotificationId) {
              await notificationService.cancelNotification(state.dailyReminderNotificationId);
            }
      
            // Schedule with new seconds
            const notificationId = await notificationService.scheduleDailyReminder(seconds);
            
            set({
              dailyReminderNotificationId: notificationId,
            });
          }
        } catch (error) {
          console.error('Error setting daily reminder seconds:', error);
        }
      },

      initializeDailyReminder: async () => {
        const state = get();
        
        if (!state.notificationsEnabled || !state.dailyReminderEnabled) return;
      
        try {
          // Initialize the notification service
          await notificationService.initialize();
      
          // Schedule daily reminder
          const notificationId = await notificationService.scheduleDailyReminder(
            state.dailyReminderSeconds // Changed from hour, minute
          );
          
          set({
            dailyReminderNotificationId: notificationId,
          });
        } catch (error) {
          console.error('Error initializing daily reminder:', error);
        }
      },

      logout: async () => {
        const state = get();
        
        // Cancel daily reminder before logout
        if (state.dailyReminderNotificationId) {
          await notificationService.cancelNotification(state.dailyReminderNotificationId);
        }
        
        set({
          user: null,
          dailyReminderEnabled: false,
          dailyReminderNotificationId: null,
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);