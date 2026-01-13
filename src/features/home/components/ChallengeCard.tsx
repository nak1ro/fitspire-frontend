import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../common/hooks/useTheme';
import { Text, Card } from '../../../common/ui';

type ChallengeCardProps = {
  title: string;
  progress: number; // 0-1
  daysRemaining: number;
  onPress?: () => void;
};

export function ChallengeCard({ title, progress, daysRemaining, onPress }: ChallengeCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card variant="glass" padding="md" style={styles.card}>
        <Text variant="heading" weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
          {title}
        </Text>

        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: theme.colors.primary[500],
              },
            ]}
          />
        </View>

        <View style={[styles.footer, { marginTop: theme.spacing[2] }]}>
          <Text variant="label" color="secondary">
            {daysRemaining} days left
          </Text>
          <Text variant="label" color="accent" weight="semibold">
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
