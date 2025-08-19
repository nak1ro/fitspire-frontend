// src/features/profile/ProfileScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
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

import Card from '../../ui/design/atoms/Card';
import { Button } from '../../ui/design/atoms/Button';
import ValuePill from '../../ui/design/atoms/ValuePill';
import Avatar from '../../ui/design/atoms/Avatar';
import { useDesign, makeLocalStyles } from '../../ui/design/system';
import { useTheme } from '../../ui/theme/ThemeProvider';

type Lang = 'en' | 'pl' | 'es';
type Units = 'metric' | 'imperial';

export default function ProfileScreen() {
  const { setScheme } = useTheme(); // for toggling persisted scheme
  const d = useDesign();
  const styles = makeLocalStyles(d, makeStyles);

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
  const [receiveEmailNotifications, setReceiveEmailNotifications] =
    useState(true);
  const [unitSystem, setUnitSystem] = useState<Units>('metric');

  // UI state (custom snackbar-like banner)
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
      } catch {}
    }
    setTimeout(() => setSnack(s => ({ ...s, visible: false })), 2200);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, prefs] = await Promise.all([getProfile(), getPreferences()]);
      setDisplayName(profile.displayName ?? '');
      setBio(profile.bio ?? '');
      setProfileImage(profile.profilePictureUrl ?? null);
      setUserName(profile.userName);
      setPreferredLanguage((prefs.preferredLanguage as Lang) ?? 'en');
      setDarkModeEnabled(!!prefs.isDarkModeEnabled);
      setReceiveEmailNotifications(!!prefs.receiveEmailNotifications);
      setUnitSystem((prefs.unitSystem as Units) ?? 'metric');

      // Ensure global theme reflects remote pref on entry
      setScheme(prefs?.isDarkModeEnabled ? 'dark' : 'light', { persist: true });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [setScheme]);

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
      Alert.alert('Upload failed', e?.response?.data?.message || 'Please try again.');
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
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={d.tokens.primary} />
        <Text style={{ marginTop: 12, color: d.tokens.textStrong }}>
          Loading your profile…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---------- Profile header card (avatar + names + change picture) ---------- */}
        <Card>
          <View style={styles.headerRow}>
            <Avatar
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../../../assets/default-avatar.png')
              }
            />
            <View style={{ flex: 1, paddingRight: 12, marginLeft: 12 }}>
              <Text style={styles.headerName} numberOfLines={1}>
                {displayName || 'Your name'}
              </Text>
              <Text style={styles.headerHandle} numberOfLines={1}>
                @{userName}
              </Text>
            </View>
            <Button
              title={saving ? 'Uploading…' : 'Change picture'}
              onPress={pickImage}
              disabled={saving}
            />
          </View>
        </Card>

        {/* ---------- About you ---------- */}
        <Card style={{ marginTop: 14 }}>
          <Text style={styles.cardTitle}>About you</Text>

          <Text style={styles.inputLabel}>Display name</Text>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholderTextColor={d.tokens.textMuted}
          />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
            placeholder="Tell people a bit about you"
            value={bio}
            onChangeText={setBio}
            placeholderTextColor={d.tokens.textMuted}
            multiline
            numberOfLines={5}
          />

          <View style={styles.inlineBtns}>
            <Button
              title="Save"
              onPress={handleSave}
              loading={saving}
              full
            />
          </View>
        </Card>

        {/* ---------- Preferences ---------- */}
        <Card style={{ marginTop: 14 }}>
          <Text style={styles.cardTitle}>Preferences</Text>

          {/* Language */}
          <TouchableOpacity
            onPress={() => setOpenLang(o => !o)}
            activeOpacity={0.9}
            style={styles.prefRow}
          >
            <View>
              <Text style={styles.prefTitle}>Language</Text>
              <Text style={styles.prefDesc}>App language</Text>
            </View>
            <ValuePill>
              {preferredLanguage === 'en'
                ? 'English'
                : preferredLanguage === 'pl'
                  ? 'Polski'
                  : 'Español'}
            </ValuePill>
          </TouchableOpacity>
          {openLang && (
            <View style={styles.radioGroup}>
              <RadioRow
                label="English"
                selected={preferredLanguage === 'en'}
                onPress={() => setPreferredLanguage('en')}
              />
              <RadioRow
                label="Polski"
                selected={preferredLanguage === 'pl'}
                onPress={() => setPreferredLanguage('pl')}
              />
              <RadioRow
                label="Español"
                selected={preferredLanguage === 'es'}
                onPress={() => setPreferredLanguage('es')}
              />
            </View>
          )}

          {/* Units */}
          <TouchableOpacity
            onPress={() => setOpenUnits(o => !o)}
            activeOpacity={0.9}
            style={[styles.prefRow, { marginTop: 10 }]}
          >
            <View>
              <Text style={styles.prefTitle}>Units</Text>
              <Text style={styles.prefDesc}>Distance & weight</Text>
            </View>
            <ValuePill>
              {unitSystem === 'metric'
                ? 'Metric (km, kg)'
                : 'Imperial (mi, lb)'}
            </ValuePill>
          </TouchableOpacity>
          {openUnits && (
            <View style={styles.radioGroup}>
              <RadioRow
                label="Metric (kg, cm)"
                selected={unitSystem === 'metric'}
                onPress={() => setUnitSystem('metric')}
              />
              <RadioRow
                label="Imperial (lbs, in)"
                selected={unitSystem === 'imperial'}
                onPress={() => setUnitSystem('imperial')}
              />
            </View>
          )}

          {/* Dark mode toggle */}
          <View style={[styles.prefRow, { marginTop: 10 }]}>
            <View>
              <Text style={styles.prefTitle}>Dark mode</Text>
              <Text style={styles.prefDesc}>Theme appearance</Text>
            </View>
            <RNSwitch
              value={isDarkModeEnabled}
              onValueChange={v => {
                setDarkModeEnabled(v);
                setScheme(v ? 'dark' : 'light', { persist: true });
              }}
              trackColor={{
                false: d.tokens.cardBorder,
                true: d.theme.colors.accentSoft,
              }}
              thumbColor={isDarkModeEnabled ? d.tokens.primary : '#f4f3f4'}
            />
          </View>

          {/* Email notifications */}
          <View style={[styles.prefRow, { marginTop: 10 }]}>
            <View>
              <Text style={styles.prefTitle}>Email notifications</Text>
              <Text style={styles.prefDesc}>Account & activity updates</Text>
            </View>
            <RNSwitch
              value={receiveEmailNotifications}
              onValueChange={setReceiveEmailNotifications}
              trackColor={{
                false: d.tokens.cardBorder,
                true: d.theme.colors.accentSoft,
              }}
              thumbColor={receiveEmailNotifications ? d.tokens.primary : '#f4f3f4'}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Card actions */}
          <View style={styles.inlineBtns}>
            <Button
              title="Apply"
              onPress={handleSave}
              loading={saving}
              full
            />
          </View>
        </Card>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Snackbar-ish banner */}
      {snack.visible && (
        <View style={styles.snack}>
          <Text style={styles.snackText}>{snack.msg}</Text>
        </View>
      )}
    </View>
  );
}

/** ------- Small presentational helpers (refactored to design tokens) ------- */
function RadioRow({
                    label,
                    selected,
                    onPress,
                  }: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const d = useDesign();
  const s = makeLocalStyles(d, ({ tokens }) => ({
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    outer: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: selected ? tokens.primary : tokens.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    inner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: tokens.primary,
    },
    label: { fontSize: 14, color: tokens.textStrong },
  }));
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={s.row}>
      <View style={s.outer}>{selected && <View style={s.inner} />}</View>
      <Text style={s.label}>{label}</Text>
    </TouchableOpacity>
  );
}

/** ------- Styles (theme-aware via design system) ------- */
const makeStyles = (d: ReturnType<typeof useDesign>) =>
  StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: d.theme.colors.bg },
    container: { padding: 16, paddingBottom: 40 },

    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: d.theme.colors.bg,
    },

    // ---- Header ----
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    headerName: { color: d.tokens.textStrong, fontSize: 18, fontWeight: '800' },
    headerHandle: {
      color: d.tokens.textMuted,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 2,
    },

    // ---- Titles ----
    cardTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: d.tokens.textStrong,
      marginBottom: 12,
    },

    // inputs
    inputLabel: {
      color: d.tokens.textMuted,
      fontWeight: '700',
      fontSize: 12,
      marginBottom: 6,
    },
    input: {
      borderColor: d.tokens.fieldBorder,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: d.tokens.fieldBg,
      color: d.tokens.textStrong,
    },

    // Preference rows
    prefRow: {
      borderWidth: 1,
      borderColor: d.tokens.cardBorder,
      borderRadius: d.radii.lg,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: d.tokens.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    prefTitle: { fontSize: 15, fontWeight: '700', color: d.tokens.textStrong },
    prefDesc: { fontSize: 12, color: d.tokens.textMuted, marginTop: 2 },

    radioGroup: { paddingHorizontal: 6, paddingTop: 8 },

    // divider
    divider: { height: 1, backgroundColor: d.tokens.divider, marginTop: 14, marginBottom: 6 },

    // buttons
    inlineBtns: { flexDirection: 'row', gap: 12, marginTop: 14 },

    // snack
    snack: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 24,
      backgroundColor: '#111',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      opacity: 0.96,
    },
    snackText: { color: '#fff', textAlign: 'center' },
  });
