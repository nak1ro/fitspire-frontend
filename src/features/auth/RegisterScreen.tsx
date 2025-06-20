import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from './AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      setError('');
      await register(email, username, password);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View>
      {success ? (
        <Text style={{ color: 'green' }}>
          🎉 Registration successful! Check your email to confirm before logging in.
        </Text>
      ) : (
        <>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <Text onPress={() => navigation.navigate('Login')} style={{ color: 'blue', marginTop: 10 }}>
            Already have an account? Log in
          </Text>
        </>
      )}
    </View>
  );
}
