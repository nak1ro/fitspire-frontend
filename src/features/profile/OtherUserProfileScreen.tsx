import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainStack';
import OtherUserProfileCard from './OtherUserProfileCard';
import { useTheme } from '../../ui/theme/ThemeProvider';
import { log } from '../../utils/logger';

type RouteProps = RouteProp<MainStackParamList, 'OtherUserProfile'>;

export default function OtherUserProfileScreen() {
  const { params } = useRoute<RouteProps>();
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.bg }}
      contentContainerStyle={styles.container}
    >
      <OtherUserProfileCard
        displayName={params.displayName}
        userName={params.userName}
        bio={params.bio}
        imageUrl={params.imageUrl}
        workouts={params.workouts}
        onWorkoutPress={(id) => {
          log.app.debug('Workout pressed', { id });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
