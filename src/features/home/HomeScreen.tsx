import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useAuthStore } from '@/features/auth/hooks';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Avatar, Header, FAB } from '../../common/ui';
import { StatCard } from './components/StatCard';
import { ChallengeCard } from './components/ChallengeCard';
import { WorkoutPostCard } from './components/WorkoutPostCard';
import { log } from '../../utils/logger';
import { Bell, Dumbbell, PenLine } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

// Mock data
const mockStats = {
  streak: 7,
  weeklyWorkouts: { completed: 4, total: 5 },
  weeklyMinutes: 245,
};

const mockChallenges = [
  { id: '1', title: '30-Day Cardio Challenge', progress: 0.65, daysRemaining: 11 },
  { id: '2', title: 'Weekly Strength Training', progress: 0.8, daysRemaining: 2 },
];

const mockWorkouts = [
  { id: '1', userName: 'Sarah Johnson', workoutType: 'gym' as const, workoutTitle: 'Upper Body Strength', timestamp: '2 hours ago', duration: 60, calories: 320, sets: 4, reps: 12, likes: 24, comments: 5 },
  { id: '2', userName: 'Mike Chen', workoutType: 'running' as const, workoutTitle: 'Morning 5K Run', timestamp: '4 hours ago', duration: 28, calories: 280, likes: 18, comments: 3 },
  { id: '3', userName: 'Emma Wilson', workoutType: 'yoga' as const, workoutTitle: 'Vinyasa Flow', timestamp: '6 hours ago', duration: 45, calories: 150, likes: 31, comments: 8 },
  { id: '4', userName: 'Alex Rodriguez', workoutType: 'cycling' as const, workoutTitle: 'Indoor Cycling Session', timestamp: '8 hours ago', duration: 50, calories: 420, likes: 15, comments: 2 },
  { id: '5', userName: 'Lisa Park', workoutType: 'swimming' as const, workoutTitle: 'Swimming Laps', timestamp: '12 hours ago', duration: 40, calories: 380, likes: 22, comments: 6 },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    log.app.debug('Pull to refresh triggered');
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleWorkoutPress = (id: string) => {
    log.app.debug('Workout card pressed', { id });
  };

  const handleChallengePress = (id: string) => {
    log.app.debug('Challenge card pressed', { id });
  };

  const handleLogWorkout = () => {
    log.app.info('Log workout FAB pressed');
  };

  const handleCreatePost = () => {
    log.app.info('Create post FAB pressed');
  };

  const userName = user?.displayName || user?.userName || 'User';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Header
        title="Fitspire"
        rightActions={[
          <TouchableOpacity onPress={() => log.app.debug('Notifications pressed')}>
            <Bell size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>,
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar name={userName} size="sm" />
          </TouchableOpacity>,
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: theme.spacing[4] }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats Section */}
        <View style={styles.section}>
          <Text variant="heading" weight="bold" style={{ marginBottom: theme.spacing[4] }}>
            Quick Stats
          </Text>
          <View style={styles.statsRow}>
            <StatCard label="Day Streak" value={`${mockStats.streak} days`} icon="🔥" />
            <StatCard label="This Week" value={`${mockStats.weeklyWorkouts.completed}/${mockStats.weeklyWorkouts.total}`} icon="✅" />
            <StatCard label="Active Minutes" value={`${mockStats.weeklyMinutes} min`} icon="⏱️" />
          </View>
        </View>

        {/* Active Challenges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="heading" weight="bold">
              Active Challenges
            </Text>
            <TouchableOpacity>
              <Text variant="body" color="accent" weight="semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: theme.spacing[2] }}
          >
            {mockChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                title={challenge.title}
                progress={challenge.progress}
                daysRemaining={challenge.daysRemaining}
                onPress={() => handleChallengePress(challenge.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Workouts Feed */}
        <View style={styles.section}>
          <Text variant="heading" weight="bold" style={{ marginBottom: theme.spacing[4] }}>
            Recent Workouts
          </Text>
          {mockWorkouts.map(workout => (
            <WorkoutPostCard
              key={workout.id}
              userName={workout.userName}
              workoutType={workout.workoutType}
              workoutTitle={workout.workoutTitle}
              timestamp={workout.timestamp}
              duration={workout.duration}
              calories={workout.calories}
              sets={workout.sets}
              reps={workout.reps}
              likes={workout.likes}
              comments={workout.comments}
              onPress={() => handleWorkoutPress(workout.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <FAB
        actions={[
          {
            icon: <Dumbbell size={20} color={theme.colors.text.primary} />,
            label: 'Log Workout',
            onPress: handleLogWorkout,
          },
          {
            icon: <PenLine size={20} color={theme.colors.text.primary} />,
            label: 'Create Post',
            onPress: handleCreatePost,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
