import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await login(loginValue, password);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username or Email"
        value={loginValue}
        onChangeText={setLoginValue}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Text
        onPress={() => navigation.navigate('Register')}
        style={{ color: 'blue', marginTop: 10 }}
      >
        Don’t have an account? Register
      </Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={loginWithGoogle}
      />
    </View>
  );
}
