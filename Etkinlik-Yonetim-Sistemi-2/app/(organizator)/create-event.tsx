
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const [yer, setYer] = useState('');
    const [kontenjan, setKontenjan] = useState('');

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);

        if (Platform.OS === 'android' && event.type === 'set') {
            setShowPicker(false);
            if (mode === 'date') {
                setMode('time');
                setTimeout(() => setShowPicker(true), 100);
            }
        }
    };

    const showDatepicker = () => {
        setMode('date');
        setShowPicker(true);
    };

    const formatForDisplay = (date: Date) => {
        return date.toLocaleString('tr-TR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatForBackend = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };

    const handleCreate = async () => {
        if (!baslik || !yer || !kontenjan) {
            Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                baslik,
                aciklama,
                tarih: formatForBackend(date),
                yer,
                kontenjan: parseInt(kontenjan)
            };

            await axios.post('/mobile/organizator/etkinlik-ekle', payload);
            Alert.alert('Başarılı', 'Etkinlik oluşturuldu ve onay için gönderildi.', [
                { text: 'Tamam', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Etkinlik oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>Yeni Etkinlik Oluştur ✨</Text>
            <Text style={styles.subtitle}>Etkinlik admin onayından sonra yayınlanacaktır.</Text>

            <View style={styles.form}>
                <View style={styles.group}>
                    <Text style={styles.label}>Başlık *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Örn: Yapay Zeka Zirvesi"
                        placeholderTextColor="#666"
                        value={baslik}
                        onChangeText={setBaslik}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Tarih ve Saat *</Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
                        <Text style={styles.dateText}>{formatForDisplay(date)}</Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            themeVariant="dark"
                        />
                    )}
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Yer *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Örn: Konferans Salonu"
                        placeholderTextColor="#666"
                        value={yer}
                        onChangeText={setYer}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Kontenjan *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Örn: 100"
                        placeholderTextColor="#666"
                        value={kontenjan}
                        onChangeText={setKontenjan}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Açıklama</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Etkinlik detayları..."
                        placeholderTextColor="#666"
                        value={aciklama}
                        onChangeText={setAciklama}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Oluşturuluyor...' : 'Etkinliği Oluştur'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0a0e17', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    subtitle: { color: '#8899a6', marginBottom: 20 },
    form: { gap: 15 },
    group: { marginBottom: 10 },
    label: { color: '#fff', marginBottom: 8, fontWeight: 'bold' },
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
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
