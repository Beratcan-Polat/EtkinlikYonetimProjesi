
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        adSoyad: '',
        kullaniciAdi: '',
        eposta: '',
        telefon: '',
        sifre: '',
        sifreTekrar: ''
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (formData.sifre !== formData.sifreTekrar) {
            Alert.alert('Hata', 'Şifreler eşleşmiyor!');
            return;
        }
        if (!formData.adSoyad || !formData.kullaniciAdi || !formData.eposta || !formData.sifre) {
            Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/mobile/public/kayit', {
                adSoyad: formData.adSoyad,
                kullaniciAdi: formData.kullaniciAdi,
                eposta: formData.eposta,
                telefon: formData.telefon,
                sifre: formData.sifre
            });
            Alert.alert('Başarılı', 'Kayıt olundu! Şimdi giriş yapabilirsiniz.', [
                { text: 'Tamam', onPress: () => router.replace('/sign-in') }
            ]);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Kayıt başarısız.';
            Alert.alert('Hata', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Kayıt Ol</Text>
                    <Text style={styles.sparkle}>✨</Text>
                </View>
                <Text style={styles.subtitle}>Etkinliklere katılmak için bir hesap oluştur.</Text>

                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Ad Soyad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ad Soyad"
                            placeholderTextColor="#666"
                            value={formData.adSoyad}
                            onChangeText={(t) => setFormData({ ...formData, adSoyad: t })}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Kullanıcı Adı</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Kullanıcı Adı"
                            placeholderTextColor="#666"
                            value={formData.kullaniciAdi}
                            autoCapitalize="none"
                            onChangeText={(t) => setFormData({ ...formData, kullaniciAdi: t })}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>E-posta</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E-posta"
                            placeholderTextColor="#666"
                            value={formData.eposta}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(t) => setFormData({ ...formData, eposta: t })}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Telefon</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Telefon"
                            placeholderTextColor="#666"
                            value={formData.telefon}
                            keyboardType="phone-pad"
                            onChangeText={(t) => setFormData({ ...formData, telefon: t })}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Şifre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre"
                            placeholderTextColor="#666"
                            secureTextEntry
                            value={formData.sifre}
                            onChangeText={(t) => setFormData({ ...formData, sifre: t })}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Şifre (Tekrar)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre (Tekrar)"
                            placeholderTextColor="#666"
                            secureTextEntry
                            value={formData.sifreTekrar}
                            onChangeText={(t) => setFormData({ ...formData, sifreTekrar: t })}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/sign-in')}>
                        <Text style={styles.linkText}>Zaten hesabım var</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#050B14', // Very dark blue/black background
    },
    card: {
        backgroundColor: '#0a0e17', // Slightly lighter card bg
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1F2937'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    sparkle: {
        fontSize: 24,
        marginLeft: 10
    },
    subtitle: {
        fontSize: 14,
        color: '#8899a6',
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 15
    },
    halfInputContainer: {
        flex: 1
    },
    label: {
        color: '#8899a6',
        fontSize: 12,
        marginBottom: 5
    },
    input: {
        backgroundColor: '#111827',
        color: '#fff',
        padding: 15,
        borderRadius: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#374151'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    button: {
        backgroundColor: '#2563EB', // Blue button
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: '#2563EB',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 25,
        paddingHorizontal: 20
    },
    linkText: {
        color: '#fff',
        fontWeight: '500'
    },
});
