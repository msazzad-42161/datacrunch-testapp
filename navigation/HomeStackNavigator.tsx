import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { HomeStackParamList } from '../types/navigation';
import { BookListScreen } from '../screens/Home/BookListScreen';
import { COLORS } from '../utils/theme';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FC = () => {
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
          color:COLORS.light1
        },
        headerTintColor: COLORS.light1,
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          title: 'DataCrunch - BookApp',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="BookListScreen"
        component={BookListScreen}
        options={{
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};