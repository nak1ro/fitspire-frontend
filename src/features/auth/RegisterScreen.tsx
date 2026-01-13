import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../common/hooks/useTheme';
import { Text, Button, Input } from '../../common/ui';

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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text variant="title" weight="bold" color="accent" style={styles.logo}>
        Create Account
      </Text>

      {success ? (
        <Text variant="body" color="success" style={styles.success}>
          🎉 Registration successful! Check your email to confirm.
        </Text>
      ) : (
        <>
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
            <Text variant="body" color="accent" style={styles.link}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </>
      )}
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 14,
  },
  button: {
    marginTop: 10,
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
  },
  success: {
    textAlign: 'center',
    marginBottom: 20,
  },
});
