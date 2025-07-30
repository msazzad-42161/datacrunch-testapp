import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { SearchResultsScreen } from '../screens/Search/SearchResultsScreen';
import { SearchStackParamList } from '../types/navigation';
import { COLORS } from '../utils/theme';
import { useBookStore } from '../store/bookStore';

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackNavigator: React.FC = () => {
  const {searchQuery} = useBookStore()
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
        name="SearchScreen" 
        component={SearchScreen}
        options={{
          headerShown:false
        }}
      />
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen}
        options={{
          title: searchQuery,
        }}
      />
    </Stack.Navigator>
  );
};