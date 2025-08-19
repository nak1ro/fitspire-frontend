import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useAuth } from '../auth/AuthContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const openOtherUser = () => {
    navigation.navigate('OtherUserProfile', {
      displayName: 'John Doe',
      userName: 'johnny',
      bio: 'Fitness enthusiast and runner. Love sharing workout tips.',
      imageUrl: null,
      workouts: [
        { id: '1', title: 'Back Day', durationMinutes: 45, avgBpm: 23 },
        { id: '2', title: 'Chest Day', durationMinutes: 60, avgBpm: 41 },
        { id: '3', title: 'HIIT Circuit', durationMinutes: 30, avgBpm: 18 },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Fitspire</Text>

      <Button title="Go to My Profile" onPress={() => navigation.navigate('Profile')} />

      <View style={styles.button}>
        <Button title="Open Other User Profile" onPress={openOtherUser} />
      </View>

      <View style={styles.logoutButton}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  button: { marginTop: 16 },
  logoutButton: { marginTop: 20 },
});
