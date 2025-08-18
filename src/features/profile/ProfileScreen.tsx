// src/features/profile/ProfileScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch as RNSwitch,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { getProfile, updateProfile, uploadProfilePhoto, getPreferences, updatePreferences } from './userApi';
import { useTheme } from '../../ui/theme/ThemeProvider';

type Lang = 'en' | 'pl' | 'es';
type Units = 'metric' | 'imperial';

export default function ProfileScreen() {
  const { theme, setScheme } = useTheme();

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

  // UI state (custom snackbar-like banner)
  const [snack, setSnack] = useState<{ visible: boolean; msg: string }>({ visible: false, msg: '' });
  const [openLang, setOpenLang] = useState(false);
  const [openUnits, setOpenUnits] = useState(false);

  const styles = makeStyles(theme);

  const showToast = (msg: string) => {
    setSnack({ visible: true, msg });
    if (Platform.OS === 'android') {
      try {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } catch {}
    }
    setTimeout(() => setSnack((s) => ({ ...s, visible: false })), 2200);
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
      setScheme(prefs?.isDarkModeEnabled ? 'dark' : 'light', { persist: true, syncRemote: false });
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
    const options: ImageLibraryOptions = { mediaType: 'photo', selectionLimit: 1 };
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
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={{ marginTop: 12, color: theme.colors.text }}>Loading your profile…</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Text style={styles.hero}>Your Profile</Text>

        {/* Photo Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Photo</Text>
          <View style={styles.row}>
            <View style={styles.avatarRing}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../../../assets/default-avatar.png')}
                style={styles.avatar}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.usernameFixed} selectable>
                @{userName}
              </Text>
              <Text style={styles.helper}>Username is fixed</Text>
              <TouchableOpacity
                style={[styles.outlineBtn, saving && styles.outlineBtnDisabled]}
                onPress={pickImage}
                disabled={saving}
                activeOpacity={0.9}
              >
                <Text style={[styles.outlineBtnText, saving && styles.outlineBtnTextDisabled]}>
                  {saving ? 'Uploading…' : 'Change Profile Picture'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About You */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About you</Text>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholderTextColor={theme.colors.muted}
          />
          <TextInput
            style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            placeholderTextColor={theme.colors.muted}
            multiline
            numberOfLines={5}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>

          {/* Language */}
          <TouchableOpacity
            onPress={() => setOpenLang((o) => !o)}
            activeOpacity={0.8}
            style={styles.selectorHeader}
          >
            <View style={styles.selectorHeaderLeft}>
              <Text style={styles.selectorTitle}>Language</Text>
              <Text style={styles.selectorDesc}>Preferred language for the app</Text>
            </View>
            <Text style={styles.selectorValue}>
              {preferredLanguage === 'en' ? 'English' : preferredLanguage === 'pl' ? 'Polski' : 'Español'}
            </Text>
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
            onPress={() => setOpenUnits((o) => !o)}
            activeOpacity={0.8}
            style={[styles.selectorHeader, { marginTop: 12 }]}
          >
            <View style={styles.selectorHeaderLeft}>
              <Text style={styles.selectorTitle}>Units</Text>
              <Text style={styles.selectorDesc}>Measurement system</Text>
            </View>
            <Text style={styles.selectorValue}>
              {unitSystem === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, in)'}
            </Text>
          </TouchableOpacity>

          {openUnits && (
            <View style={styles.radioGroup}>
              <RadioRow label="Metric (kg, cm)" selected={unitSystem === 'metric'} onPress={() => setUnitSystem('metric')} />
              <RadioRow label="Imperial (lbs, in)" selected={unitSystem === 'imperial'} onPress={() => setUnitSystem('imperial')} />
            </View>
          )}

          {/* Toggles */}
          <View style={[styles.toggleRow, { marginTop: 12 }]}>
            <View>
              <Text style={styles.selectorTitle}>Dark Mode</Text>
              <Text style={styles.selectorDesc}>Use a darker color palette</Text>
            </View>
            <RNSwitch
              value={isDarkModeEnabled}
              onValueChange={(v) => {
                setDarkModeEnabled(v);
                // instant global update (persisted to backend on Save)
                setScheme(v ? 'dark' : 'light', { persist: true, syncRemote: false });
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.accentSoft }}
              thumbColor={isDarkModeEnabled ? theme.colors.accent : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.selectorTitle}>Email Notifications</Text>
              <Text style={styles.selectorDesc}>Receive updates via email</Text>
            </View>
            <RNSwitch
              value={receiveEmailNotifications}
              onValueChange={setReceiveEmailNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.accentSoft }}
              thumbColor={receiveEmailNotifications ? theme.colors.accent : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Save */}
      <View style={styles.stickyBar}>
        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.9}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Simple snackbar-like banner */}
      {snack.visible && (
        <View style={styles.snack}>
          <Text style={styles.snackText}>{snack.msg}</Text>
        </View>
      )}
    </View>
  );
}

/** ------- Small presentational helpers ------- */
function RadioRow({
                    label,
                    selected,
                    onPress,
                  }: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={radioStyles.row}>
      <View style={[radioStylesOuter(theme), selected && radioStylesOuterSelected(theme)]}>
        {selected && <View style={radioStylesInner(theme)} />}
      </View>
      <Text style={radioStylesLabel(theme)}>{label}</Text>
    </TouchableOpacity>
  );
}

/** ------- Styles (theme-aware) ------- */
const makeStyles = (theme: import('../../ui/theme/theme').AppTheme) =>
  StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: 24, paddingBottom: 160 },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: theme.colors.bg,
    },
    hero: {
      fontSize: 36,
      fontWeight: '700',
      textAlign: 'left',
      color: theme.colors.accent,
      marginBottom: 8,
    },
    card: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
      marginTop: 14,
    },
    cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 10 },
    row: { flexDirection: 'row', alignItems: 'center' },
    avatarRing: {
      padding: 3,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.colors.accent,
      marginRight: 12,
    },
    avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eee' },
    usernameFixed: { fontWeight: '700', color: theme.colors.text, marginBottom: 2, fontSize: 16 },
    helper: { color: theme.colors.muted, marginBottom: 6 },
    outlineBtn: {
      borderWidth: 1,
      borderColor: theme.colors.accent,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      alignSelf: 'flex-start',
    },
    outlineBtnDisabled: { opacity: 0.6 },
    outlineBtnText: { color: theme.colors.accent, fontWeight: '600', fontSize: 16 },
    outlineBtnTextDisabled: { color: theme.colors.accentSoft },
    input: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      marginTop: 10,
      backgroundColor: theme.colors.cardBg,
      color: theme.colors.text,
    },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
    divider: { flex: 1, height: 1, backgroundColor: theme.colors.border },
    selectorHeader: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: theme.colors.cardBg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectorHeaderLeft: { maxWidth: '70%' },
    selectorTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
    selectorDesc: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },
    selectorValue: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },
    radioGroup: { paddingHorizontal: 6, paddingTop: 8 },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: theme.colors.cardBg,
    },
    separator: { height: 12 },
    stickyBar: { position: 'absolute', left: 24, right: 24, bottom: 24 },
    button: { backgroundColor: theme.colors.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    snack: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 92,
      backgroundColor: '#111',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      opacity: 0.96,
    },
    snackText: { color: '#fff', textAlign: 'center' },
  });

const radioStyles = {
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 } as const,
};
const radioStylesOuter = (theme: import('../../ui/theme/theme').AppTheme) =>
  StyleSheet.create({
    outer: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
  }).outer;

const radioStylesOuterSelected = (theme: import('../../ui/theme/theme').AppTheme) =>
  StyleSheet.create({ outerSelected: { borderColor: theme.colors.accent } }).outerSelected;

const radioStylesInner = (theme: import('../../ui/theme/theme').AppTheme) =>
  StyleSheet.create({ inner: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.accent } }).inner;

const radioStylesLabel = (theme: import('../../ui/theme/theme').AppTheme) =>
  StyleSheet.create({ label: { fontSize: 14, color: theme.colors.text } }).label;
