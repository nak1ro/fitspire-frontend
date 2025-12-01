import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Text,
  FAB,
  Portal,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useAuth } from '../auth/AuthContext';
import { useTheme as useAppTheme } from '../../ui/theme/ThemeProvider';
import { StatCard } from './components/StatCard';
import { ChallengeCard } from './components/ChallengeCard';
import { WorkoutPostCard } from './components/WorkoutPostCard';
import { log } from '../../utils/logger';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

// Mock data
const mockStats = {
  streak: 7,
  weeklyWorkouts: { completed: 4, total: 5 },
  weeklyMinutes: 245,
};

const mockChallenges = [
  {
    id: '1',
    title: '30-Day Cardio Challenge',
    progress: 0.65,
    daysRemaining: 11,
  },
  {
    id: '2',
    title: 'Weekly Strength Training',
    progress: 0.8,
    daysRemaining: 2,
  },
];

const mockWorkouts = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: undefined,
    workoutType: 'gym' as const,
    workoutTitle: 'Upper Body Strength',
    timestamp: '2 hours ago',
    duration: 60,
    calories: 320,
    sets: 4,
    reps: 12,
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    userName: 'Mike Chen',
    userAvatar: undefined,
    workoutType: 'running' as const,
    workoutTitle: 'Morning 5K Run',
    timestamp: '4 hours ago',
    duration: 28,
    calories: 280,
    likes: 18,
    comments: 3,
  },
  {
    id: '3',
    userName: 'Emma Wilson',
    userAvatar: undefined,
    workoutType: 'yoga' as const,
    workoutTitle: 'Vinyasa Flow',
    timestamp: '6 hours ago',
    duration: 45,
    calories: 150,
    likes: 31,
    comments: 8,
  },
  {
    id: '4',
    userName: 'Alex Rodriguez',
    userAvatar: undefined,
    workoutType: 'cycling' as const,
    workoutTitle: 'Indoor Cycling Session',
    timestamp: '8 hours ago',
    duration: 50,
    calories: 420,
    likes: 15,
    comments: 2,
  },
  {
    id: '5',
    userName: 'Lisa Park',
    userAvatar: undefined,
    workoutType: 'swimming' as const,
    workoutTitle: 'Swimming Laps',
    timestamp: '12 hours ago',
    duration: 40,
    calories: 380,
    likes: 22,
    comments: 6,
  },
  {
    id: '6',
    userName: 'David Kim',
    userAvatar: undefined,
    workoutType: 'gym' as const,
    workoutTitle: 'Leg Day',
    timestamp: '1 day ago',
    duration: 75,
    calories: 450,
    sets: 5,
    reps: 10,
    likes: 28,
    comments: 7,
  },
  {
    id: '7',
    userName: 'Jessica Brown',
    userAvatar: undefined,
    workoutType: 'running' as const,
    workoutTitle: 'Trail Run',
    timestamp: '1 day ago',
    duration: 35,
    calories: 310,
    likes: 19,
    comments: 4,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const paperTheme = useTheme();
  const { spacing } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    log.app.debug('Pull to refresh triggered');
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleWorkoutPress = (id: string) => {
    log.app.debug('Workout card pressed', { id });
  };

  const handleChallengePress = (id: string) => {
    log.app.debug('Challenge card pressed', { id });
  };

  const handleLogWorkout = () => {
    log.app.info('Log workout FAB pressed');
    setFabOpen(false);
    // Navigate to log workout screen when implemented
  };

  const handleCreatePost = () => {
    log.app.info('Create post FAB pressed');
    setFabOpen(false);
    // Navigate to create post screen when implemented
  };

  const handleViewAllChallenges = () => {
    log.app.info('View all challenges pressed');
    // Navigate to challenges screen when implemented
  };

  const userName = user?.displayName || user?.userName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: paperTheme.colors.surface }}>
        <Appbar.Content title="Fitspire" titleStyle={{ fontWeight: 'bold' }} />
        <TouchableOpacity onPress={() => log.app.debug('Notifications pressed')}>
          <Appbar.Action icon="bell-outline" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{ marginRight: spacing(1) }}
        >
          <Avatar.Text
            size={32}
            label={userInitial}
            style={{ backgroundColor: paperTheme.colors.primaryContainer }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: spacing(2) }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats Section */}
        <View style={styles.section}>
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { color: paperTheme.colors.onBackground, marginBottom: spacing(2) }]}
          >
            Quick Stats
          </Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Day Streak"
              value={`${mockStats.streak} days`}
              icon="🔥"
            />
            <StatCard
              label="This Week"
              value={`${mockStats.weeklyWorkouts.completed}/${mockStats.weeklyWorkouts.total}`}
              icon="✅"
            />
            <StatCard
              label="Active Minutes"
              value={`${mockStats.weeklyMinutes} min`}
              icon="⏱️"
            />
          </View>
        </View>

        {/* Active Challenges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}
            >
              Active Challenges
            </Text>
            <TouchableOpacity onPress={handleViewAllChallenges}>
              <Text
                variant="bodyMedium"
                style={{ color: paperTheme.colors.primary, fontWeight: '600' }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.challengesScroll, { paddingVertical: spacing(1) }]}
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
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { color: paperTheme.colors.onBackground, marginBottom: spacing(2) }]}
          >
            Recent Workouts
          </Text>
          {mockWorkouts.map(workout => (
            <WorkoutPostCard
              key={workout.id}
              userName={workout.userName}
              userAvatar={workout.userAvatar}
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

      {/* FAB Group */}
      <Portal>
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'dumbbell',
              label: 'Log Workout',
              onPress: handleLogWorkout,
            },
            {
              icon: 'pencil',
              label: 'Create Post',
              onPress: handleCreatePost,
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          onPress={() => {
            if (fabOpen) {
              setFabOpen(false);
            }
          }}
          style={styles.fab}
        />
      </Portal>
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
    paddingBottom: 100, // Space for FAB
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
  sectionTitle: {
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  challengesScroll: {
    paddingRight: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
