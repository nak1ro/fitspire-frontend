// OtherUserProfileCard.tsx
import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const ACCENT = '#007BFF';           // match LoginScreen primary
const BG = '#fff';
const BORDER = '#ddd';
const BODY = '#444';
const MUTED = '#777';
const RADIUS = 10;

type WorkoutItem = {
  id: string;
  title: string;
  durationMinutes: number;
  likes: number;
};

type Props = {
  displayName: string;
  userName: string;         // without '@'
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
  const firstName = displayName.trim().split(/\s+/)[0] || 'this user';

  return (
    <View style={styles.card}>
      {/* Header: avatar + names */}
      <View style={styles.headerRow}>
        <View style={styles.avatarRing}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>{initialsFromName(displayName)}</Text>
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

      {/* Divider with label (like LoginScreen's OR divider) */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>Workouts</Text>
        <View style={styles.divider} />
      </View>

      {/* Workouts list / empty state */}
      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onWorkoutPress && onWorkoutPress(item.id)}
            >
              <View style={styles.workoutCard}>
                <Text style={styles.workoutTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.workoutMetaRow}>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{item.durationMinutes}m</Text>
                  </View>
                  <View style={[styles.metaChip, { marginLeft: 6 }]}>
                    <Text style={styles.metaChipText}>❤ {item.likes}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: BG,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: ACCENT,
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
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 28,
  },

  nameCol: { flex: 1, minWidth: 0 },
  displayName: { fontSize: 26, fontWeight: '700', color: '#111' },
  username: { marginTop: 2, fontSize: 14, color: MUTED, fontWeight: '600' },

  bio: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: BODY,
  },

  // Divider with center label (mirrors LoginScreen style)
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: BORDER },
  sectionLabel: { marginHorizontal: 10, color: MUTED, fontWeight: '600' },

  // Workouts
  workoutCard: {
    width: 180,
    borderRadius: RADIUS,
    backgroundColor: BG,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  workoutTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  workoutMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  metaChipText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  // Empty
  emptyBox: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG,
  },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: '#111' },
  emptySubtitle: { marginTop: 4, fontSize: 13, color: MUTED },
});
