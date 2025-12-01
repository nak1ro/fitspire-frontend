import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar, Button, useTheme } from 'react-native-paper';
import { useTheme as useAppTheme } from '../../../ui/theme/ThemeProvider';

type ChallengeCardProps = {
  title: string;
  progress: number; // 0-1
  daysRemaining: number;
  onPress?: () => void;
};

export function ChallengeCard({ title, progress, daysRemaining, onPress }: ChallengeCardProps) {
  const paperTheme = useTheme();
  const { spacing } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { marginRight: spacing(2) }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: paperTheme.colors.onSurface, marginBottom: spacing(1) }}>
            {title}
          </Text>
          <ProgressBar
            progress={progress}
            color={paperTheme.colors.primary}
            style={[styles.progressBar, { marginBottom: spacing(1) }]}
          />
          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              {daysRemaining} days left
            </Text>
            <Text variant="bodySmall" style={{ color: paperTheme.colors.primary }}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

