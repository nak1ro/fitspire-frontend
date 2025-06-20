import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    Switch,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    ToastAndroid,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileScreen() {
    const [displayName, setDisplayName] = useState('Maxim');
    const [bio, setBio] = useState('Fitness enthusiast 💪');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [preferredLanguage, setPreferredLanguage] = useState('en');
    const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
    const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(true);
    const [unitSystem, setUnitSystem] = useState('metric');

    const createdAt = '2024-01-10';
    const userName = 'maxim_fit';

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
        });

        if (result.didCancel) return;

        if (result.assets && result.assets.length > 0) {
            setProfileImage(result.assets[0].uri || null);
        }
    };

    const handleSave = () => {
        ToastAndroid.show('✅ Changes saved!', ToastAndroid.SHORT);
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.emoji}>👤</Text>
                    <Text style={styles.headerText}>Your Profile</Text>
                </View>

                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            profileImage
                                ? { uri: profileImage }
                                : require('../../../assets/default-avatar.png')
                        }
                        style={styles.avatar}
                    />
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.changePictureText}>Change Profile Picture</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Username (fixed)</Text>
                <Text style={styles.fixed}>{userName}</Text>

                <Text style={styles.label}>Display Name</Text>
                <TextInput
                    style={styles.input}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Bio</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Preferred Language</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={preferredLanguage}
                        onValueChange={setPreferredLanguage}
                        style={styles.picker}
                    >
                        <Picker.Item label="English" value="en" />
                        <Picker.Item label="Polski" value="pl" />
                        <Picker.Item label="Español" value="es" />
                    </Picker>
                </View>

                <Text style={styles.label}>Unit System</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={unitSystem}
                        onValueChange={setUnitSystem}
                        style={styles.picker}
                    >
                        <Picker.Item label="Metric (kg, cm)" value="metric" />
                        <Picker.Item label="Imperial (lbs, in)" value="imperial" />
                    </Picker>
                </View>

                <Text style={styles.sectionHeader}>Preferences</Text>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Dark Mode</Text>
                    <Switch value={isDarkModeEnabled} onValueChange={setDarkModeEnabled} />
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Email Notifications</Text>
                    <Switch value={receiveEmailNotifications} onValueChange={setReceiveEmailNotifications} />
                </View>

                <Text style={styles.label}>Account Created</Text>
                <Text style={styles.fixed}>{createdAt}</Text>

                <View style={styles.spaceBottom} />
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonIcon}>💾</Text>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    container: {
        padding: 24,
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emoji: {
        fontSize: 26,
        marginRight: 8,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    changePictureText: {
        marginTop: 8,
        color: '#007BFF',
        fontWeight: '500',
    },
    label: {
        fontWeight: '600',
        marginTop: 18,
        marginBottom: 6,
        fontSize: 16,
    },
    sectionHeader: {
        fontWeight: '700',
        fontSize: 17,
        marginTop: 24,
        marginBottom: 6,
    },
    fixed: {
        fontSize: 16,
        paddingVertical: 4,
        color: '#555',
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        fontSize: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    multilineInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    pickerWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 4,
        backgroundColor: '#fff',
        elevation: 2,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    switchLabel: {
        fontSize: 16,
    },
    saveButton: {
        position: 'absolute',
        bottom: 20,
        left: 24,
        right: 24,
        backgroundColor: '#28a745',
        paddingVertical: 14,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 5,
    },
    saveButtonIcon: {
        fontSize: 18,
        color: '#fff',
        marginRight: 6,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    spaceBottom: {
        height: 80,
    },
});
