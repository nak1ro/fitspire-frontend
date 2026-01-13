import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../../../common/hooks/useTheme';
import { Text, Card, Avatar, Icon } from '../../../common/ui';
import { Heart, MessageCircle } from 'lucide-react-native';

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
  duration: number;
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
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => (liked ? prev - 1 : prev + 1));
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card variant="glass" padding="md" style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar source={userAvatar} name={userName} size="md" />
            <View style={{ marginLeft: theme.spacing[3] }}>
              <Text variant="body" weight="semibold">
                {userName}
              </Text>
              <Text variant="caption" color="secondary">
                {timestamp}
              </Text>
            </View>
          </View>
          <View style={[styles.workoutTypeBadge, { backgroundColor: theme.glass.light.background }]}>
            <Text style={{ fontSize: 20 }}>{workoutIcons[workoutType]}</Text>
          </View>
        </View>

        {/* Workout Title */}
        <Text variant="heading" weight="semibold" style={{ marginTop: theme.spacing[4], marginBottom: theme.spacing[2] }}>
          {workoutTitle}
        </Text>

        {/* Stats */}
        <View style={styles.stats}>
          <Text variant="label" color="secondary">⏱️ {duration} min</Text>
          {calories && <Text variant="label" color="secondary">🔥 {calories} kcal</Text>}
          {sets && reps && <Text variant="label" color="secondary">💪 {sets} sets × {reps} reps</Text>}
        </View>

        {/* Actions */}
        <View style={[styles.actions, { borderTopColor: theme.colors.border }]}>
          <Pressable onPress={handleLike} style={styles.actionButton}>
            <Heart
              size={20}
              color={liked ? theme.colors.error : theme.colors.text.secondary}
              fill={liked ? theme.colors.error : 'transparent'}
            />
            <Text variant="label" color="secondary" style={{ marginLeft: 4 }}>
              {likes}
            </Text>
          </Pressable>

          <View style={styles.actionButton}>
            <MessageCircle size={20} color={theme.colors.text.secondary} />
            <Text variant="label" color="secondary" style={{ marginLeft: 4 }}>
              {comments}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
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
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
