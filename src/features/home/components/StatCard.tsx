import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTheme as useAppTheme } from '../../../ui/theme/ThemeProvider';

type StatCardProps = {
  label: string;
  value: string;
  icon: string;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  const paperTheme = useTheme();
  const { spacing } = useAppTheme();

  return (
    <Card style={[styles.card, { marginRight: spacing(2) }]}>
      <Card.Content style={styles.content}>
        <Text variant="headlineMedium" style={{ color: paperTheme.colors.primary }}>
          {icon}
        </Text>
        <Text variant="headlineSmall" style={{ color: paperTheme.colors.onSurface, marginTop: spacing(1) }}>
          {value}
        </Text>
        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: spacing(0.5) }}>
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

