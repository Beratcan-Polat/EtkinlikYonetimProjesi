
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditEventScreen() {
    const { id, title, date, location, quota, desc, status, creator } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initialize form with passed params (or empty if direct nav loop)
    // Note: params come as strings
    const [baslik, setBaslik] = useState(title as string || '');
    const [aciklama, setAciklama] = useState(desc as string || '');
    const [tarih, setTarih] = useState(date as string || '');
    const [yer, setYer] = useState(location as string || '');
    const [kontenjan, setKontenjan] = useState(quota as string || '');
    const [durum, setDurum] = useState(status as string || 'ONAY_BEKLIYOR');

    // If we want to fetch fresh data, we could do axios.get(`/etkinlik/${id}`) but params are usually enough for edit

    const handleUpdate = async () => {
        if (!baslik || !tarih || !yer || !kontenjan) {
            Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun.');
            return;
        }

        let formattedDate = tarih;
        // Simple heuristic fix if needed, similar to add-event
        if (tarih.includes(' ') && !tarih.includes('T')) {
            formattedDate = tarih.replace(' ', 'T') + ':00';
        }

        setLoading(true);
        try {
            const payload = {
                baslik,
                aciklama,
                tarih: formattedDate,
                yer,
                kontenjan: parseInt(kontenjan),
                durum // Preserve or update status
            };

            await axios.post(`/mobile/admin/etkinlik-guncelle/${id}`, payload);
            Alert.alert('Başarılı', 'Etkinlik güncellendi.', [
                { text: 'Tamam', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Güncelleme başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>Etkinliği Düzenle</Text>

            <View style={styles.form}>
                <View style={styles.group}>
                    <Text style={styles.label}>Başlık</Text>
                    <TextInput
                        style={styles.input}
                        value={baslik}
                        onChangeText={setBaslik}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Tarih</Text>
                    <TextInput
                        style={styles.input}
                        value={tarih}
                        onChangeText={setTarih}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Yer</Text>
                    <TextInput
                        style={styles.input}
                        value={yer}
                        onChangeText={setYer}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Kontenjan</Text>
                    <TextInput
                        style={styles.input}
                        value={kontenjan}
                        onChangeText={setKontenjan}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Açıklama</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={aciklama}
                        onChangeText={setAciklama}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Durum (ONAYLANDI / ONAY_BEKLIYOR)</Text>
                    <TextInput
                        style={styles.input}
                        value={durum}
                        onChangeText={setDurum}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Geri Dön</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0a0e17', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    form: { gap: 15 },
    group: { marginBottom: 10 },
    label: { color: '#8899a6', marginBottom: 8, fontSize: 12 },
    input: {
        backgroundColor: '#151f2b',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#253341',
        fontSize: 16
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: '#1d9bf0',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#8899a6',
        borderRadius: 25
    },
    cancelText: { color: '#fff' }
});
