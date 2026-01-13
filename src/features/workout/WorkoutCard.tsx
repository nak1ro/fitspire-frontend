import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Card, Icon } from '../../common/ui';
import { Clock, Flame, Heart } from 'lucide-react-native';

type Props = {
  title: string;
  subtitle: string;
  badgeLabel?: string;
  durationMin: number;
  kcal: number;
  avgBpm: number;
  onStart?: () => void;
  footer?: string;
};

type StatRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function StatRow({ icon, label, value }: StatRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.statRow}>
      <View style={styles.statLabel}>
        {icon}
        <Text variant="label" color="secondary" style={{ marginLeft: theme.spacing[2] }}>
          {label}
        </Text>
      </View>
      <Text variant="body" weight="semibold">
        {value}
      </Text>
    </View>
  );
}

export default function WorkoutCard(p: Props) {
  const theme = useTheme();

  return (
    <Card variant="glass" padding="md" style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: theme.glass.light.background,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>🏋️</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text variant="heading" weight="bold" numberOfLines={1}>
              {p.title}
            </Text>
            <Text variant="label" color="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
              {p.subtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={{ marginTop: theme.spacing[4], gap: theme.spacing[3] }}>
        <StatRow
          icon={<Clock size={16} color={theme.colors.text.secondary} />}
          label="Duration"
          value={`${p.durationMin} min`}
        />
        <StatRow
          icon={<Flame size={16} color={theme.colors.text.secondary} />}
          label="Burned Calories"
          value={`${p.kcal} kcal`}
        />
        <StatRow
          icon={<Heart size={16} color={theme.colors.text.secondary} />}
          label="Avg Heartbeat"
          value={`${p.avgBpm} bpm`}
        />
      </View>

      {p.footer && (
        <View
          style={[
            styles.footerBadge,
            {
              backgroundColor: theme.colors.primary[500],
              marginTop: theme.spacing[4],
            },
          ]}
        >
          <Text variant="label" color="inverse" weight="semibold">
            {p.footer}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
