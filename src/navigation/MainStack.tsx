// navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/home/HomeScreen';
import LoginScreen from '../features/auth/LoginScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import OtherUserProfileScreen from '../features/profile/OtherUserProfileScreen';

export type WorkoutItem = {
  id: string;
  title: string;
  durationMinutes: number;
  likes: number;
};

export type MainStackParamList = {
  Home: undefined;
  // Note: Login is NOT part of MainStack in most setups.
  // Keep it only if you intentionally show Login inside the main app.
  // Recommended: remove this line and keep Login inside AuthStack.
  // Login: undefined;
  Profile: undefined;
  OtherUserProfile: {
    displayName: string;
    userName: string;
    bio: string;
    imageUrl?: string | null;
    workouts: WorkoutItem[];
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* If you want Login only in AuthStack, remove the next line entirely */}
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfileScreen}
        options={{ title: 'User Profile' }}
      />
    </Stack.Navigator>
  );
}
