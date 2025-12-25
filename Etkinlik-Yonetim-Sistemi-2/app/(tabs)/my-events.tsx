
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { KatilimKaydi } from '@/constants/types';
import { useFocusEffect } from 'expo-router';

export default function MyEventsScreen() {
    const [participations, setParticipations] = useState<KatilimKaydi[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/mobile/katilimci/etkinliklerim');
            setParticipations(response.data);
        } catch (error) {
            console.error(error);
            // Alert.alert('Hata', 'Katılımlarınız yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMyEvents();
        }, [])
    );

    const handleCancel = async (id: number) => {
        try {
            const response = await axios.post(`/mobile/katilimci/iptal/${id}`);
            Alert.alert('Bilgi', response.data.message);
            fetchMyEvents(); // Refresh list
        } catch (error) {
            Alert.alert('Hata', 'İptal işlemi başarısız.');
        }
    };

    const renderItem = ({ item }: { item: KatilimKaydi }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.etkinlik.baslik}</Text>
            <Text style={styles.date}>{new Date(item.etkinlik.tarih).toLocaleString()}</Text>
            <Text style={styles.desc}>{item.etkinlik.aciklama}</Text>
            <Text style={styles.info}>Yer: {item.etkinlik.yer}</Text>
            <Text style={styles.info}>Kayıt: {new Date(item.kayitZamani).toLocaleString()}</Text>

            <TouchableOpacity style={styles.button} onPress={() => handleCancel(item.etkinlik.id)}>
                <Text style={styles.buttonText}>İptal Et</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={participations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={fetchMyEvents}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz bir etkinliğe katılmadınız.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0e17', padding: 10 },
    card: {
        backgroundColor: '#151f2b',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#253341'
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    date: { color: '#8899a6', marginBottom: 5 },
    desc: { marginVertical: 5, color: '#e7e9ea' },
    info: { fontSize: 12, color: '#8899a6', marginBottom: 10 },
    button: { backgroundColor: '#F44336', padding: 10, borderRadius: 25, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#8899a6' }
});
