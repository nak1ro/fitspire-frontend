import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Button, Input, GlassContainer } from '../../common/ui';

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
    <LinearGradient
      colors={[theme.colors.primary[700], theme.colors.primary[500]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text variant="hero" weight="bold" color="inverse" style={styles.logo}>
          Fitspire
        </Text>
        <Text variant="heading" color="inverse" style={styles.subtitle}>
          Welcome back 👋
        </Text>

        <GlassContainer intensity="medium" style={styles.formCard}>
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
            <Text variant="body" color="inverse" style={styles.link}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </GlassContainer>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text variant="label" color="inverse" style={styles.orText}>
            OR
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.googleButton}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
  },
  formCard: {
    padding: 24,
    borderRadius: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.9,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  orText: {
    marginHorizontal: 10,
    opacity: 0.8,
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 8,
  },
});
