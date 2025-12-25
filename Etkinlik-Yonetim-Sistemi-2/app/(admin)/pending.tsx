import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { Etkinlik } from '@/constants/types';

export default function PendingEventsScreen() {
    const [events, setEvents] = useState<Etkinlik[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/mobile/admin/etkinlikler/onay-bekleyen');
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPending();
        }, [])
    );

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`/mobile/admin/etkinlik/onayla/${id}`);
            Alert.alert('Başarılı', 'Etkinlik onaylandı.');
            fetchPending();
        } catch (error) {
            Alert.alert('Hata', 'İşlem başarısız.');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await axios.post(`/mobile/admin/etkinlik/reddet/${id}`);
            Alert.alert('Başarılı', 'Etkinlik reddedildi.');
            fetchPending();
        } catch (error) {
            Alert.alert('Hata', 'İşlem başarısız.');
        }
    };

    const renderItem = ({ item }: { item: Etkinlik }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.baslik}</Text>
            <Text style={styles.info}>Tarih: {new Date(item.tarih).toLocaleString()}</Text>
            <Text style={styles.info}>Yer: {item.yer}</Text>
            <Text style={styles.info}>Kontenjan: {item.kontenjan}</Text>
            <Text style={styles.desc}>{item.aciklama}</Text>
            <Text style={styles.organizer}>Organizatör: {item.organizator.adSoyad} ({item.organizator.eposta})</Text>

            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.approveBtn]} onPress={() => handleApprove(item.id)}>
                    <Text style={styles.btnText}>Onayla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.rejectBtn]} onPress={() => handleReject(item.id)}>
                    <Text style={styles.btnText}>Reddet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={fetchPending}
                ListEmptyComponent={<Text style={styles.emptyText}>Onay bekleyen etkinlik yok.</Text>}
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
    title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    info: { color: '#8899a6', fontSize: 13, marginBottom: 2 },
    desc: { color: '#e7e9ea', marginVertical: 8 },
    organizer: { color: '#1d9bf0', fontSize: 13, marginBottom: 10, fontStyle: 'italic' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    button: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
    approveBtn: { backgroundColor: '#00BA7C' },
    rejectBtn: { backgroundColor: '#F44336' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    emptyText: { color: '#8899a6', textAlign: 'center', marginTop: 20 }
});
