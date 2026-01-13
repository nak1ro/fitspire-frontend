// src/features/profile/ProfileScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch as RNSwitch,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getPreferences,
  updatePreferences,
} from './userApi';

import { useTheme } from '../../common/hooks/useTheme';
import { Text, Button, Card, Avatar, Input } from '../../common/ui';

type Lang = 'en' | 'pl' | 'es';
type Units = 'metric' | 'imperial';

export default function ProfileScreen() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // profile
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  // preferences
  const [preferredLanguage, setPreferredLanguage] = useState<Lang>('en');
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(true);
  const [unitSystem, setUnitSystem] = useState<Units>('metric');

  // UI state
  const [snack, setSnack] = useState<{ visible: boolean; msg: string }>({
    visible: false,
    msg: '',
  });
  const [openLang, setOpenLang] = useState(false);
  const [openUnits, setOpenUnits] = useState(false);

  const showToast = (msg: string) => {
    setSnack({ visible: true, msg });
    if (Platform.OS === 'android') {
      try {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } catch { }
    }
    setTimeout(() => setSnack(s => ({ ...s, visible: false })), 2200);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, prefs] = await Promise.all([
        getProfile(),
        getPreferences(),
      ]);
      setDisplayName(profile.displayName ?? '');
      setBio(profile.bio ?? '');
      setProfileImage(profile.profilePictureUrl ?? null);
      setUserName(profile.userName);
      setPreferredLanguage((prefs.preferredLanguage as Lang) ?? 'en');
      setDarkModeEnabled(!!prefs.isDarkModeEnabled);
      setReceiveEmailNotifications(!!prefs.receiveEmailNotifications);
      setUnitSystem((prefs.unitSystem as Units) ?? 'metric');
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to load profile',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) return;
    const asset: Asset | undefined = result.assets && result.assets[0];
    if (!asset?.uri) return;
    try {
      setSaving(true);
      const uri = asset.uri;
      const name = asset.fileName || `profile_${Date.now()}.jpg`;
      const type = asset.type || 'image/jpeg';
      const updated = await uploadProfilePhoto(uri, name, type);
      setProfileImage(updated.profilePictureUrl ?? uri);
      showToast('📷 Profile picture updated');
    } catch (e: any) {
      Alert.alert(
        'Upload failed',
        e?.response?.data?.message || 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({ displayName, bio });
      await updatePreferences({
        preferredLanguage,
        isDarkModeEnabled,
        receiveEmailNotifications,
        unitSystem,
      });
      showToast('✅ Changes saved!');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingWrap, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text variant="body" style={{ marginTop: 12 }}>
          Loading your profile…
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile header card */}
        <Card variant="solid" padding="md">
          <View style={styles.headerRow}>
            <Avatar source={profileImage} name={displayName} size="xl" />
            <View style={{ flex: 1, marginLeft: theme.spacing[4] }}>
              <Text variant="heading" weight="bold" numberOfLines={1}>
                {displayName || 'Your name'}
              </Text>
              <Text variant="label" color="secondary" style={{ marginTop: 2 }}>
                @{userName}
              </Text>
            </View>
          </View>
          <Button
            title={saving ? 'Uploading…' : 'Change picture'}
            onPress={pickImage}
            disabled={saving}
            variant="secondary"
            style={{ marginTop: theme.spacing[4] }}
            fullWidth
          />
        </Card>

        {/* About you */}
        <Card variant="solid" padding="md" style={{ marginTop: 14 }}>
          <Text variant="heading" weight="bold" style={{ marginBottom: theme.spacing[4] }}>
            About you
          </Text>

          <Input
            label="Display name"
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            containerStyle={{ marginBottom: theme.spacing[3] }}
          />

          <Input
            label="Bio"
            placeholder="Tell people a bit about you"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={5}
          />

          <Button
            title="Save"
            onPress={handleSave}
            loading={saving}
            fullWidth
            style={{ marginTop: theme.spacing[4] }}
          />
        </Card>

        {/* Preferences */}
        <Card variant="solid" padding="md" style={{ marginTop: 14 }}>
          <Text variant="heading" weight="bold" style={{ marginBottom: theme.spacing[4] }}>
            Preferences
          </Text>

          {/* Language */}
          <TouchableOpacity
            onPress={() => setOpenLang(o => !o)}
            activeOpacity={0.9}
            style={[styles.prefRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <View>
              <Text variant="body" weight="semibold">Language</Text>
              <Text variant="caption" color="secondary">App language</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.colors.primary[500] }]}>
              <Text variant="label" color="inverse">
                {preferredLanguage === 'en' ? 'English' : preferredLanguage === 'pl' ? 'Polski' : 'Español'}
              </Text>
            </View>
          </TouchableOpacity>
          {openLang && (
            <View style={styles.radioGroup}>
              <RadioRow label="English" selected={preferredLanguage === 'en'} onPress={() => setPreferredLanguage('en')} />
              <RadioRow label="Polski" selected={preferredLanguage === 'pl'} onPress={() => setPreferredLanguage('pl')} />
              <RadioRow label="Español" selected={preferredLanguage === 'es'} onPress={() => setPreferredLanguage('es')} />
            </View>
          )}

          {/* Units */}
          <TouchableOpacity
            onPress={() => setOpenUnits(o => !o)}
            activeOpacity={0.9}
            style={[styles.prefRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: 10 }]}
          >
            <View>
              <Text variant="body" weight="semibold">Units</Text>
              <Text variant="caption" color="secondary">Distance & weight</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.colors.primary[500] }]}>
              <Text variant="label" color="inverse">
                {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
              </Text>
            </View>
          </TouchableOpacity>
          {openUnits && (
            <View style={styles.radioGroup}>
              <RadioRow label="Metric (kg, cm)" selected={unitSystem === 'metric'} onPress={() => setUnitSystem('metric')} />
              <RadioRow label="Imperial (lbs, in)" selected={unitSystem === 'imperial'} onPress={() => setUnitSystem('imperial')} />
            </View>
          )}

          {/* Dark mode toggle */}
          <View style={[styles.prefRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: 10 }]}>
            <View>
              <Text variant="body" weight="semibold">Dark mode</Text>
              <Text variant="caption" color="secondary">Theme appearance</Text>
            </View>
            <RNSwitch
              value={isDarkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary[300] }}
              thumbColor={isDarkModeEnabled ? theme.colors.primary[500] : theme.colors.text.secondary}
            />
          </View>

          {/* Email notifications */}
          <View style={[styles.prefRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: 10 }]}>
            <View>
              <Text variant="body" weight="semibold">Email notifications</Text>
              <Text variant="caption" color="secondary">Account & activity updates</Text>
            </View>
            <RNSwitch
              value={receiveEmailNotifications}
              onValueChange={setReceiveEmailNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary[300] }}
              thumbColor={receiveEmailNotifications ? theme.colors.primary[500] : theme.colors.text.secondary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <Button
            title="Apply"
            onPress={handleSave}
            loading={saving}
            fullWidth
          />
        </Card>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Snackbar */}
      {snack.visible && (
        <View style={[styles.snack, { backgroundColor: theme.colors.surface }]}>
          <Text variant="body">{snack.msg}</Text>
        </View>
      )}
    </View>
  );
}

function RadioRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.radioRow}>
      <View style={[styles.radioOuter, { borderColor: selected ? theme.colors.primary[500] : theme.colors.border }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary[500] }]} />}
      </View>
      <Text variant="body">{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  prefRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  radioGroup: { paddingHorizontal: 6, paddingTop: 8 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  divider: { height: 1, marginVertical: 14 },
  snack: { position: 'absolute', left: 16, right: 16, bottom: 24, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
});
