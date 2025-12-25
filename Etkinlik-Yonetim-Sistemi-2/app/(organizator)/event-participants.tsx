
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useLocalSearchParams, useFocusEffect, useRouter } from 'expo-router';
import { KatilimKaydi } from '@/constants/types';

export default function EventParticipantsScreen() {
    const { id } = useLocalSearchParams();
    const [participants, setParticipants] = useState<KatilimKaydi[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/mobile/organizator/etkinlik/${id}/katilimcilar`);
            setParticipants(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchParticipants();
        }, [])
    );

    const router = useRouter(); // Added router

    const renderItem = ({ item }: { item: KatilimKaydi }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.label}>Ad Soyad:</Text>
                <Text style={styles.value}>{item.kullanici.adSoyad || '-'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>E-posta:</Text>
                <Text style={styles.value}>{item.kullanici.eposta}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Telefon:</Text>
                <Text style={styles.value}>{item.kullanici.telefon}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Kayıt Zamanı:</Text>
                <Text style={styles.value}>{new Date(item.kayitZamani).toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'< Geri'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Katılımcı Listesi</Text>
            </View>

            <FlatList
                data={participants}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={fetchParticipants}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz katılımcı yok.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0e17', padding: 10 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backButton: { marginRight: 15, padding: 5 },
    backButtonText: { color: '#1d9bf0', fontSize: 16, fontWeight: 'bold' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    card: {
        backgroundColor: '#151f2b',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#253341'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5
    },
    label: {
        color: '#8899a6',
        width: 100,
        fontWeight: 'bold',
        fontSize: 14
    },
    value: {
        color: '#fff',
        flex: 1,
        fontSize: 14
    },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#8899a6' }
});
