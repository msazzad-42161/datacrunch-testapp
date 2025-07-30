import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookDetails } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  trigger: Notifications.CalendarTriggerInput | Notifications.TimeIntervalTriggerInput | null;
}

class NotificationService {
  private readonly PUSH_TOKEN_KEY = 'expo_push_token';
  private readonly NOTIFICATION_IDS_KEY = 'scheduled_notification_ids';

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission not granted for push notifications');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Get Expo push token
  async getPushToken(): Promise<string | null> {
    try {
      // Check if we have a stored token
      const storedToken = await AsyncStorage.getItem(this.PUSH_TOKEN_KEY);
      if (storedToken) {
        return storedToken;
      }

      if (!Device.isDevice) {
        console.warn('Must use physical device for push notifications');
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      if (!projectId) {
        console.warn('Project ID not found');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const token = tokenData.data;
      
      // Store the token
      await AsyncStorage.setItem(this.PUSH_TOKEN_KEY, token);
      
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Send local notification immediately
  async sendLocalNotification(notification: NotificationData): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  // Schedule local notification
  async scheduleLocalNotification(notification: ScheduledNotification): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: 'default',
        },
        trigger: notification.trigger,
      });

      // Store the notification ID for later management
      await this.storeNotificationId(notificationId);

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  // Schedule daily reading reminder
  async scheduleDailyReminder(hour: number = 19, minute: number = 0): Promise<string> {
    try {
      const notificationId = await this.scheduleLocalNotification({
        id: 'daily_reminder',
        title: '📚 Reading Time!',
        body: "Don't forget to spend some time with your favorite books today.",
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      throw error;
    }
  }

  // Schedule reading goal reminder
  async scheduleGoalReminder(): Promise<string> {
    try {
      // Schedule for Sunday at 10 AM
      const notificationId = await this.scheduleLocalNotification({
        id: 'goal_reminder',
        title: '🎯 Weekly Reading Goal',
        body: 'How are you doing with your reading goal this week?',
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          weekday: 1, // Sunday
          hour: 10,
          minute: 0,
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling goal reminder:', error);
      throw error;
    }
  }

  // Send book recommendation notification
  async sendBookRecommendation(book:BookDetails): Promise<string> {
    try {
      return await this.sendLocalNotification({
        title: '📖 New Book Recommendation',
        body: `Check out "${book?.title}" by ${book?.author_name}`,
        data: {
          type: 'book_recommendation',
          book
        },
      });
    } catch (error) {
      console.error('Error sending book recommendation:', error);
      throw error;
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await this.removeNotificationId(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(this.NOTIFICATION_IDS_KEY);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Store notification ID
  private async storeNotificationId(id: string): Promise<void> {
    try {
      const existingIds = await this.getStoredNotificationIds();
      const updatedIds = [...existingIds, id];
      await AsyncStorage.setItem(this.NOTIFICATION_IDS_KEY, JSON.stringify(updatedIds));
    } catch (error) {
      console.error('Error storing notification ID:', error);
    }
  }

  // Remove notification ID
  private async removeNotificationId(id: string): Promise<void> {
    try {
      const existingIds = await this.getStoredNotificationIds();
      const updatedIds = existingIds.filter(existingId => existingId !== id);
      await AsyncStorage.setItem(this.NOTIFICATION_IDS_KEY, JSON.stringify(updatedIds));
    } catch (error) {
      console.error('Error removing notification ID:', error);
    }
  }

  // Get stored notification IDs
  private async getStoredNotificationIds(): Promise<string[]> {
    try {
      const ids = await AsyncStorage.getItem(this.NOTIFICATION_IDS_KEY);
      return ids ? JSON.parse(ids) : [];
    } catch (error) {
      console.error('Error getting stored notification IDs:', error);
      return [];
    }
  }

  // Handle notification received while app is in foreground
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Handle notification response (user tapped notification)
  addNotificationResponseReceivedListener(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (hasPermission) {
        const token = await this.getPushToken();
        console.log('Push token:', token);
      }
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }
}

export const notificationService = new NotificationService();