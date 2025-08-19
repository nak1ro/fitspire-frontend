import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../ui/theme/ThemeProvider';
import { AppTheme } from '../../ui/theme/theme';
import WorkoutCard from '../workout/WorkoutCard';

const RADIUS = 10;

type WorkoutItem = {
  id: string;
  title: string;
  durationMinutes: number;

  subtitle?: string;
  badgeLabel?: string;
  kcal?: number;
  avgBpm?: number;
};

type Props = {
  displayName: string;
  userName: string;
  bio: string;
  imageUrl?: string | null;
  workouts: WorkoutItem[];
  onWorkoutPress?: (id: string) => void;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map(p => (p[0] || '').toUpperCase()).join('');
  return initials || 'U';
}

const OtherUserProfileCard: React.FC<Props> = ({
  displayName,
  userName,
  bio,
  imageUrl,
  workouts,
  onWorkoutPress,
}) => {
  const { theme } = useTheme();
  const firstName = displayName.trim().split(/\s+/)[0] || 'this user';
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      {/* Header: avatar + names */}
      <View style={styles.headerRow}>
        <View style={styles.avatarRing}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>
                {initialsFromName(displayName)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.nameCol}>
          <Text style={styles.displayName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{userName}
          </Text>
        </View>
      </View>

      {/* Bio */}
      {bio.trim().length > 0 && (
        <Text style={styles.bio} numberOfLines={5}>
          {bio}
        </Text>
      )}

      {/* Divider with label */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>Workouts</Text>
        <View style={styles.divider} />
      </View>

      {/* Workouts list / empty state */}
      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          nestedScrollEnabled
          renderItem={({ item }) => {
            const subtitle = item.subtitle ?? 'Workout';
            const badgeLabel = item.badgeLabel ?? 'Shared';
            const durationMin = item.durationMinutes;
            const kcal = item.kcal ?? Math.max(0, Math.round(durationMin * 6));
            const avgBpm = item.avgBpm ?? 0;

            return (
              <WorkoutCard
                title={item.title}
                subtitle={subtitle}
                badgeLabel={badgeLabel}
                durationMin={durationMin}
                kcal={kcal}
                avgBpm={avgBpm}
                onStart={() => onWorkoutPress?.(item.id)}
                rightCta={{ label: 'Save' }}
              />
            );
          }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No workouts yet</Text>
          <Text style={styles.emptySubtitle}>
            When {firstName} shares workouts, they’ll appear here.
          </Text>
        </View>
      )}
    </View>
  );
};

export default memo(OtherUserProfileCard);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: RADIUS,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarRing: {
      padding: 3,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.colors.accent,
      marginRight: 12,
    },
    avatar: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: '#eee',
    },
    initialsCircle: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initialsText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 28,
    },

    nameCol: { flex: 1, minWidth: 0 },
    displayName: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.text,
    },
    username: {
      marginTop: 2,
      fontSize: 14,
      color: theme.colors.muted,
      fontWeight: '600',
    },

    bio: {
      marginTop: 6,
      fontSize: 15,
      lineHeight: 20,
      color: theme.colors.text,
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 10,
    },
    divider: { flex: 1, height: 1, backgroundColor: theme.colors.border },
    sectionLabel: {
      marginHorizontal: 10,
      color: theme.colors.muted,
      fontWeight: '600',
    },

    emptyBox: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: RADIUS,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.cardBg,
    },
    emptyTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
    emptySubtitle: { marginTop: 4, fontSize: 13, color: theme.colors.muted },
  });
