import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FavoritesScreen } from '../screens/Favorites/FavoritesScreen';
import { FavoritesStackParamList } from '../types/navigation';
import { COLORS } from '../utils/theme';

const Stack = createStackNavigator<FavoritesStackParamList>();

export const FavoritesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible:false,
        headerStyle: {
          backgroundColor: COLORS.accent2,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: COLORS.light1,
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