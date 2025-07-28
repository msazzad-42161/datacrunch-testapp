import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { SearchResultsScreen } from '../screens/Search/SearchResultsScreen';
import { SearchStackParamList } from '../types/navigation';

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackNavigator: React.FC = () => {
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
        name="SearchScreen" 
        component={SearchScreen}
        options={{
          title: 'Search Books',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen}
        options={{
          title: 'Search Results',
        }}
      />
    </Stack.Navigator>
  );
};