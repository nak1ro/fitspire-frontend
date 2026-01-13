import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Button, Input, GlassContainer } from '../../common/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

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
        <Text variant="title" weight="bold" color="inverse" style={styles.logo}>
          Create Account
        </Text>
        <Text variant="body" color="inverse" style={styles.subtitle}>
          Join the fitness community ✨
        </Text>

        {success ? (
          <GlassContainer intensity="medium" style={styles.successCard}>
            <Text variant="heading" color="inverse" style={{ textAlign: 'center' }}>
              🎉 Registration successful!
            </Text>
            <Text variant="body" color="inverse" style={{ textAlign: 'center', marginTop: 8, opacity: 0.9 }}>
              Check your email to confirm.
            </Text>
          </GlassContainer>
        ) : (
          <GlassContainer intensity="medium" style={styles.formCard}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
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
              title="Register"
              onPress={handleRegister}
              loading={loading}
              fullWidth
              style={styles.button}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text variant="body" color="inverse" style={styles.link}>
                Already have an account? Log in
              </Text>
            </TouchableOpacity>
          </GlassContainer>
        )}
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
  successCard: {
    padding: 32,
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
});
