import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { BookDetailsScreen } from '../screens/BookDetails/BookDetailsScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
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
            headerShown: true,
            headerTitle: 'Book Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};