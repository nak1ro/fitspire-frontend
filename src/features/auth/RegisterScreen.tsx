import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../ui/theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { theme, tokens } = useTheme();

  const handleRegister = async () => {
    try {
      setError('');
      await register(email, username, password);
      setSuccess(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' as never }],
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed');
    }
  };

  const styles = createStyles(theme.colors, tokens);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>Create Account</Text>

      {success ? (
        <Text style={styles.success}>
          🎉 Registration successful! Check your email to confirm.
        </Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor={tokens.textPlaceholder}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
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

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={tokens.onPrimary} />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any, tokens: any) => StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.bg },
  logo: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 24, color: tokens.primary },
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
    backgroundColor: tokens.buttonSuccess,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: tokens.onPrimary, fontWeight: '600', fontSize: 16 },
  link: { color: tokens.textLink, textAlign: 'center', marginTop: 20 },
  error: { color: tokens.textError, textAlign: 'center', marginBottom: 10 },
  success: { color: tokens.textSuccess, textAlign: 'center', marginBottom: 20 },
});
