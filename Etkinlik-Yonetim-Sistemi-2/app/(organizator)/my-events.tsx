
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import axios from 'axios';
import { Etkinlik } from '@/constants/types';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MyCreatedEventsScreen() {
    const [events, setEvents] = useState<Etkinlik[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/mobile/organizator/etkinliklerim');
            setEvents(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Etkinlikler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONAYLANDI': return '#00BA7C';
            case 'ONAY_BEKLIYOR': return '#FFB74D';
            case 'REDDEDILDI': return '#F44336';
            default: return '#8899a6';
        }
    };

    const renderItem = ({ item }: { item: Etkinlik }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.baslik}</Text>
                <View style={[styles.badge, { borderColor: getStatusColor(item.durum) }]}>
                    <Text style={[styles.badgeText, { color: getStatusColor(item.durum) }]}>{item.durum}</Text>
                </View>
            </View>

            <Text style={styles.date}>{new Date(item.tarih).toLocaleString()}</Text>
            <Text style={styles.info}>Yer: {item.yer}</Text>
            <Text style={styles.info}>Kontenjan: {item.kontenjan}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => router.push({
                        pathname: '/(organizator)/event-participants',
                        params: { id: item.id }
                    })}
                >
                    <Text style={styles.secondaryButtonText}>Katılımcılar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => router.push({
                        pathname: '/(organizator)/edit-event',
                        params: {
                            id: item.id,
                            title: item.baslik,
                            date: item.tarih,
                            location: item.yer,
                            quota: item.kontenjan,
                            desc: item.aciklama,
                            status: item.durum
                        }
                    })}
                >
                    <Ionicons name="create-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={styles.secondaryButtonText}>Düzenle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Benim Etkinliklerim</Text>
            </View>

            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={fetchEvents}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz bir etkinlik oluşturmadınız.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0e17', padding: 10 },
    header: { marginBottom: 15, paddingHorizontal: 5 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    card: {
        backgroundColor: '#151f2b',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#253341'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 10 },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
    },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    date: { color: '#8899a6', marginBottom: 2, fontSize: 12 },
    info: { fontSize: 12, color: '#8899a6', marginBottom: 2 },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#253341',
        paddingTop: 10
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginLeft: 10
    },
    secondaryButton: { borderWidth: 1, borderColor: '#8899a6' },
    secondaryButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    editButton: { backgroundColor: '#1d9bf0', borderWidth: 0 },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#8899a6' }
});
