import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../../ui/design/atoms/Card';
import ValuePill from '../../ui/design/atoms/ValuePill';
import { StatRow } from '../../ui/design/atoms/StatRow';
import { useDesign } from '../../ui/design/system';

type Props = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  durationMin: number;
  kcal: number;
  avgBpm: number;
  onStart?: () => void;
  rightCta?: { label: string; onPress?: () => void; disabled?: boolean };
  footer?: string;
};

export default function WorkoutCard(p: Props) {
  const d = useDesign();
  const c = d.tokens;

  const Icon = ({ name }: { name: string }) => (
    <Ionicons
      name={name}
      size={18}
      color={d.theme.scheme === 'dark' ? '#9fb3c8' : '#5b7083'}
      style={{ marginRight: 2 }}
    />
  );

  const Label = ({ icon, text }: { icon: string; text: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name={icon} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: c.textMuted,
          marginLeft: 6,
        }}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <Card variant="elevated" style={{ gap: 8 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: d.radii.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                d.theme.scheme === 'dark' ? '#3a2a00' : '#fff2cc',
            }}
          >
            <Text style={{ fontSize: 20, color: c.iconSoft }}>🏋️</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={[styles.title, { color: c.textStrong }]}
              numberOfLines={1}
            >
              {p.title}
            </Text>
            <Text
              style={[styles.subtitle, { color: c.textMuted }]}
              numberOfLines={1}
            >
              {p.subtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats with icons */}
      <StatRow
        labelNode={<Label icon="time-outline" text="Duration" />}
        value={`${p.durationMin} min`}
      />
      <StatRow
        labelNode={<Label icon="flame-outline" text="Burned Calories" />}
        value={`${p.kcal} kcal`}
      />
      <StatRow
        labelNode={<Label icon="heart-outline" text="Avg Heartbeat" />}
        value={`${p.avgBpm} bpm`}
      />

      {p.footer && (
        <ValuePill style={{ alignSelf: 'flex-start', marginTop: d.spacing(3) }}>
          {p.footer}
        </ValuePill>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: '500' },
});
