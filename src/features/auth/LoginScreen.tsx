import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useTheme } from '../../ui/theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, loginWithGoogle } = useAuth();
  const { theme, tokens } = useTheme();

  const handleLogin = async () => {
    try {
      setError('');
      await login(loginValue, password);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  const styles = createStyles(theme.colors, tokens);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>Fitspire</Text>
      <Text style={styles.subtitle}>Welcome back 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={loginValue}
        onChangeText={setLoginValue}
        autoCapitalize="none"
        placeholderTextColor={tokens.textPlaceholder}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={tokens.textPlaceholder}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color={tokens.onPrimary} /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.googleButton}>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={theme.scheme === 'dark' ? GoogleSigninButton.Color.Dark : GoogleSigninButton.Color.Light}
          onPress={async () => {
            try {
              await loginWithGoogle();
            } catch {
              setError('Google login failed');
            }
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any, tokens: any) => StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.bg },
  logo: { fontSize: 36, fontWeight: '700', textAlign: 'center', color: tokens.primary },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 24, color: tokens.textMuted },
  input: {
    borderColor: tokens.fieldBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: tokens.fieldBg,
    color: tokens.textStrong,
  },
  button: {
    backgroundColor: tokens.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: tokens.onPrimary, fontWeight: '600', fontSize: 16 },
  link: { color: tokens.textLink, textAlign: 'center', marginTop: 16 },
  error: { color: tokens.textError, textAlign: 'center', marginBottom: 8 },
  googleButton: { alignItems: 'center', marginTop: 20 },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.divider,
  },
  orText: {
    marginHorizontal: 10,
    color: tokens.textMuted,
  },
});
