
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Etkinlik } from '@/constants/types';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AllEventsScreen() {
    const [events, setEvents] = useState<Etkinlik[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/mobile/admin/etkinlikler');
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

    const handleDelete = (id: number) => {
        Alert.alert(
            'Sil',
            'Bu etkinliği silmek istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.post(`/mobile/admin/etkinlik/sil/${id}`);
                            fetchEvents();
                        } catch (error) {
                            Alert.alert('Hata', 'Silme işlemi başarısız.');
                        }
                    }
                }
            ]
        );
    };

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
                        pathname: '/(admin)/event-participants',
                        params: { id: item.id }
                    })}
                >
                    <Text style={styles.secondaryButtonText}>Katılımcılar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => router.push({
                        pathname: '/(admin)/edit-event',
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
                    <Text style={styles.secondaryButtonText}>Düzenle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.actionText}>Sil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tüm Etkinlikler</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(admin)/add-event')}>
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Yeni Ekle</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={fetchEvents}
                ListEmptyComponent={<Text style={styles.emptyText}>Etkinlik bulunamadı.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0e17', padding: 10 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#1d9bf0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        gap: 5
    },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
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
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginLeft: 10
    },
    deleteButton: { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderWidth: 1, borderColor: '#F44336' },
    secondaryButton: { borderWidth: 1, borderColor: '#8899a6', marginRight: 5 },
    secondaryButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    actionText: { color: '#F44336', fontSize: 12, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#8899a6' }
});
