import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/home/HomeScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import OtherUserProfileScreen from '../features/profile/OtherUserProfileScreen';

export type WorkoutItem = {
  id: string;
  title: string;
  durationMinutes: number;
  avgBpm: number;
};

export type MainStackParamList = {
  Home: undefined;
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfileScreen}
        options={{ title: 'User Profile' }}
      />
    </Stack.Navigator>
  );
}
