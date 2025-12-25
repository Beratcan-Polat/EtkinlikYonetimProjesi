
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditEventScreen() {
    const { id, title, date, location, quota, desc, status } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [baslik, setBaslik] = useState(title as string || '');
    const [aciklama, setAciklama] = useState(desc as string || '');
    // Parse date safely
    const [eventDate, setEventDate] = useState(() => {
        if (!date) return new Date();
        const d = new Date(date as string);
        return isNaN(d.getTime()) ? new Date() : d;
    });

    const [yer, setYer] = useState(location as string || '');
    const [kontenjan, setKontenjan] = useState(quota as string || '');

    // Date picker state
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || eventDate;
        setShowPicker(false);
        setEventDate(currentDate);

        if (event.type === 'set' && mode === 'date') {
            // In edit mode, maybe we don't chain automatically, but consistency is key.
            // Let's chain it.
            setMode('time');
            setTimeout(() => setShowPicker(true), 100);
        }
    };

    const showDatepicker = () => {
        setMode('date');
        setShowPicker(true);
    };

    const formatForDisplay = (d: Date) => {
        return d.toLocaleString('tr-TR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatForBackend = (d: Date) => {
        // Same logic as create
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };

    const handleUpdate = async () => {
        if (!baslik || !yer || !kontenjan) {
            Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                baslik,
                aciklama,
                tarih: formatForBackend(eventDate),
                yer,
                kontenjan: parseInt(kontenjan),
                durum: 'ONAY_BEKLIYOR' // Reset to pending required by backend logic usually, or explicitly sent.
            };

            await axios.post(`/mobile/organizator/etkinlik-guncelle/${id}`, payload);
            Alert.alert('Başarılı', 'Etkinlik güncellendi. Düzenleme sonrası tekrar onay beklenmektedir.', [
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
            <Text style={styles.headerTitle}>Etkinliği Düzenle 📝</Text>

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
                    <Text style={styles.label}>Tarih ve Saat</Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
                        <Text style={styles.dateText}>{formatForDisplay(eventDate)}</Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={eventDate}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            themeVariant="dark"
                        />
                    )}
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

                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>İptal</Text>
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
    dateButton: {
        backgroundColor: '#151f2b',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#253341',
    },
    dateText: { color: '#fff', fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
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
