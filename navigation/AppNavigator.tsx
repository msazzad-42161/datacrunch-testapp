import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { BookDetailsScreen } from '../screens/BookDetails/BookDetailsScreen';
import { RootStackParamList } from '../types/navigation';
import { notificationService } from '../services/notificationService';
import { useUserStore } from '../store/userStore';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const {initializeDailyReminder} = useUserStore()
  const handleNotificationTap = (data: any, navigation: any) => {
    console.log('Notification data:', data);
  
    if (data?.type) {
      switch (data.type) {
        case 'book_recommendation':
          // Navigate to book details screen
          if (data.book) {
            navigation.navigate('BookDetails', { 
              key: data.book.key, 
              first_publish_year: data.book.first_publish_year 
            });
          }
          break;
          
        case 'daily_reminder': // Changed from SchedulableTriggerInputTypes.TIME_INTERVAL
          // Navigate to Home tab
          navigation.navigate('Main', {
            screen: 'Search'
          });
          break;
          
        case 'book_added_to_favorite':
          // Navigate to Favorites tab
          navigation.navigate('Main', {
            screen: 'Favorites'
          });
          break;
          
        default:
          // Default action - go to home tab
          navigation.navigate('Main', {
            screen: 'Home'
          });
          break;
      }
    } else {
      // Handle notifications without specific type data
      navigation.navigate('Main', {
        screen: 'Home'
      });
    }
  };
  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();
    initializeDailyReminder();

    // Handle notification taps
    const subscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        
        const { notification } = response;
        const { data } = notification.request.content;
        
        // Handle different types of notifications based on data
        handleNotificationTap(data, navigation);
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.remove();
  }, []);
  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="BookDetails" 
          component={BookDetailsScreen}
          options={{
            headerShown: false,
            headerTitle: 'Book Details',
          }}
        />
      </Stack.Navigator>
  );
};