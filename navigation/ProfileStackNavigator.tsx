import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { SettingsScreen } from '../screens/Profile/SettingsScreen';
import { PrivacyPolicyScreen } from '../screens/Profile/PrivacyPolicyScreen';
import { ProfileStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC = () => {
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
        name="ProfileScreen" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
        options={{
          title: 'Privacy Policy',
        }}
      />
    </Stack.Navigator>
  );
};