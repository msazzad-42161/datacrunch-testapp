import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FavoritesScreen } from '../screens/Favorites/FavoritesScreen';
import { FavoritesStackParamList } from '../types/navigation';

const Stack = createStackNavigator<FavoritesStackParamList>();

export const FavoritesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible:false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen 
        name="FavoritesScreen" 
        component={FavoritesScreen}
        options={{
          title: 'My Favorites',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};