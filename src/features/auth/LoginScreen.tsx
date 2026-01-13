import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Button, Input } from '../../common/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, loginWithGoogle } = useAuth();
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      setError('');
      await login(loginValue, password);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text variant="hero" weight="bold" color="accent" style={styles.logo}>
        Fitspire
      </Text>
      <Text variant="heading" color="secondary" style={styles.subtitle}>
        Welcome back 👋
      </Text>

      <Input
        placeholder="Email or Username"
        value={loginValue}
        onChangeText={setLoginValue}
        autoCapitalize="none"
        containerStyle={styles.inputContainer}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={error || undefined}
        containerStyle={styles.inputContainer}
      />

      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        fullWidth
        style={styles.button}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text variant="body" color="accent" style={styles.link}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <Text variant="label" color="secondary" style={styles.orText}>
          OR
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 14,
  },
  button: {
    marginTop: 8,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 20,
  },
});
