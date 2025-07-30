import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { BookDetailsScreen } from '../screens/BookDetails/BookDetailsScreen';
import { RootStackParamList } from '../types/navigation';
import { notificationService } from '../services/notificationService';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const handleNotificationTap = (data: any, navigation: any) => {
  console.log('Notification data:', data);

  if (data?.type) {
    switch (data.type) {
      case 'book_recommendation':
        // Navigate to book details screen
        if (data.book) {
          navigation.navigate('BookDetails', { key: data.book.key, first_publish_year:data.book.first_publish_year });
        }
        break;
        
      // case 'daily_reminder':
      //   // Navigate to reading screen or library
      //   navigation.navigate('Library');
      //   break;
        
      // case 'goal_reminder':
      //   // Navigate to goals/progress screen
      //   navigation.navigate('ReadingGoals');
      //   break;
        
      default:
        // Default action - maybe go to home screen
        navigation.navigate('Home');
        break;
    }
  } else {
    // Handle notifications without specific type data
    navigation.navigate('Home');
  }
};
  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();

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