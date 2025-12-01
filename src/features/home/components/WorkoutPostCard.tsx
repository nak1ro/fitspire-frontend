import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, IconButton, useTheme } from 'react-native-paper';
import { useTheme as useAppTheme } from '../../../ui/theme/ThemeProvider';

type WorkoutType = 'gym' | 'running' | 'swimming' | 'cycling' | 'yoga';

const workoutIcons: Record<WorkoutType, string> = {
  gym: '🏋️',
  running: '🏃',
  swimming: '🏊',
  cycling: '🚴',
  yoga: '🧘',
};

type WorkoutPostCardProps = {
  userName: string;
  userAvatar?: string;
  workoutType: WorkoutType;
  workoutTitle: string;
  timestamp: string;
  duration: number; // minutes
  calories?: number;
  sets?: number;
  reps?: number;
  likes: number;
  comments: number;
  onPress?: () => void;
};

export function WorkoutPostCard({
  userName,
  userAvatar,
  workoutType,
  workoutTitle,
  timestamp,
  duration,
  calories,
  sets,
  reps,
  likes: initialLikes,
  comments,
  onPress,
}: WorkoutPostCardProps) {
  const paperTheme = useTheme();
  const { spacing } = useAppTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { marginBottom: spacing(2) }]}>
        <Card.Content>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Avatar.Text
                size={40}
                label={userName.charAt(0).toUpperCase()}
                style={{ backgroundColor: paperTheme.colors.primaryContainer }}
              />
              <View style={{ marginLeft: spacing(2) }}>
                <Text variant="titleSmall" style={{ color: paperTheme.colors.onSurface }}>
                  {userName}
                </Text>
                <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  {timestamp}
                </Text>
              </View>
            </View>
            <View style={[styles.workoutTypeBadge, { backgroundColor: paperTheme.colors.primaryContainer }]}>
              <Text style={{ fontSize: 20 }}>{workoutIcons[workoutType]}</Text>
            </View>
          </View>

          {/* Workout Title */}
          <Text
            variant="titleMedium"
            style={{ color: paperTheme.colors.onSurface, marginTop: spacing(2), marginBottom: spacing(1) }}
          >
            {workoutTitle}
          </Text>

          {/* Stats */}
          <View style={styles.stats}>
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              ⏱️ {duration} min
            </Text>
            {calories && (
              <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                🔥 {calories} kcal
              </Text>
            )}
            {sets && reps && (
              <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                💪 {sets} sets × {reps} reps
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={[styles.actions, { borderTopColor: paperTheme.colors.outlineVariant }]}>
            <IconButton
              icon={liked ? 'heart' : 'heart-outline'}
              iconColor={liked ? paperTheme.colors.error : paperTheme.colors.onSurfaceVariant}
              size={20}
              onPress={handleLike}
            />
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginRight: spacing(2) }}>
              {likes}
            </Text>
            <IconButton
              icon="comment-outline"
              iconColor={paperTheme.colors.onSurfaceVariant}
              size={20}
            />
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              {comments}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutTypeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});

