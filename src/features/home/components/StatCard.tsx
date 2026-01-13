import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../common/hooks/useTheme';
import { Text, Card } from '../../../common/ui';

type StatCardProps = {
  label: string;
  value: string;
  icon: string;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card variant="glass" padding="md" style={styles.card}>
      <Text variant="heading" color="accent" style={styles.icon}>
        {icon}
      </Text>
      <Text variant="title" weight="bold" style={{ marginTop: theme.spacing[2] }}>
        {value}
      </Text>
      <Text variant="label" color="secondary" style={{ marginTop: theme.spacing[1] }}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    marginRight: 8,
  },
  icon: {
    fontSize: 24,
  },
});
