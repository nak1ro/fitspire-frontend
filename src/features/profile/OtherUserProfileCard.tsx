import React, { memo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Card, Avatar } from '../../common/ui';
import WorkoutCard from '../workout/WorkoutCard';

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

const OtherUserProfileCard: React.FC<Props> = ({
  displayName,
  userName,
  bio,
  imageUrl,
  workouts,
}) => {
  const theme = useTheme();
  const firstName = displayName.trim().split(/\s+/)[0] || 'this user';

  return (
    <Card variant="solid" padding="md">
      {/* Header: avatar + names */}
      <View style={styles.headerRow}>
        <View style={[styles.avatarRing, { borderColor: theme.colors.primary[500] }]}>
          <Avatar source={imageUrl} name={displayName} size="xl" />
        </View>

        <View style={styles.nameCol}>
          <Text variant="title" weight="bold" numberOfLines={1}>
            {displayName}
          </Text>
          <Text variant="label" color="secondary" style={{ marginTop: 2 }}>
            @{userName}
          </Text>
        </View>
      </View>

      {/* Bio */}
      {bio.trim().length > 0 && (
        <Text variant="body" style={{ marginTop: theme.spacing[2] }} numberOfLines={5}>
          {bio}
        </Text>
      )}

      {/* Divider with label */}
      <View style={[styles.dividerContainer, { marginTop: theme.spacing[4] }]}>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <Text variant="label" color="secondary" style={{ marginHorizontal: 10 }}>
          Workouts
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
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
              />
            );
          }}
        />
      ) : (
        <View style={[styles.emptyBox, { borderColor: theme.colors.border }]}>
          <Text variant="body" weight="bold">No workouts yet</Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
            When {firstName} shares workouts, they'll appear here.
          </Text>
        </View>
      )}
    </Card>
  );
};

export default memo(OtherUserProfileCard);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 999,
    borderWidth: 2,
    marginRight: 12,
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  emptyBox: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
});
