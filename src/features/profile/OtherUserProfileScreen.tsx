// src/features/profile/OtherUserProfileScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainStack';
import OtherUserProfileCard from './OtherUserProfileCard';

type RouteProps = RouteProp<MainStackParamList, 'OtherUserProfile'>;

export default function OtherUserProfileScreen() {
  const { params } = useRoute<RouteProps>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <OtherUserProfileCard
        displayName={params.displayName}
        userName={params.userName}
        bio={params.bio}
        imageUrl={params.imageUrl}
        workouts={params.workouts}
        onWorkoutPress={(id) => {
          console.log('Workout pressed:', id);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
