import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { Kullanici } from '@/constants/types';
import { useSession } from '@/context/ctx';

export default function ProfileScreen() {
    const { signOut } = useSession();
    const [user, setUser] = useState<Kullanici>({
        id: 0,
        kullaniciAdi: '',
        adSoyad: '',
        eposta: '',
        telefon: '',
        rol: ''
    });
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/mobile/katilimci/profil');
            setUser(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Profil bilgileri yüklenemedi.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/mobile/katilimci/profil/guncelle', user);
            Alert.alert('Başarılı', response.data.message);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Profil güncellenemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profil Bilgilerim</Text>
                <Text style={styles.subtitle}>Hesap bilgilerini güncelleyebilirsin</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user.rol}</Text>
                </View>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ad Soyad</Text>
                    <TextInput
                        style={styles.input}
                        value={user.adSoyad}
                        onChangeText={(text) => setUser({ ...user, adSoyad: text })}
                        placeholder="Ad Soyad"
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kullanıcı Adı</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user.kullaniciAdi}
                        editable={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-posta</Text>
                    <TextInput
                        style={styles.input}
                        value={user.eposta}
                        onChangeText={(text) => setUser({ ...user, eposta: text })}
                        placeholder="E-posta"
                        placeholderTextColor="#666"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefon</Text>
                    <TextInput
                        style={styles.input}
                        value={user.telefon}
                        onChangeText={(text) => setUser({ ...user, telefon: text })}
                        placeholder="Telefon"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
                    <Text style={styles.saveButtonText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                    <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#0a0e17', // Dark background matching the screenshot
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#8899a6',
        marginBottom: 10,
    },
    roleBadge: {
        backgroundColor: '#1d2730',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#00BA7C',
    },
    roleText: {
        color: '#00BA7C',
        fontSize: 12,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#8899a6',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#151f2b',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#253341',
        fontSize: 16,
    },
    disabledInput: {
        opacity: 0.7,
        backgroundColor: '#0f161f',
    },
    saveButton: {
        backgroundColor: '#1d9bf0',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#F44336',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#F44336',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
