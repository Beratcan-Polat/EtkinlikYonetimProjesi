import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrganizerDashboard() {
    const [stats, setStats] = useState({
        toplamEtkinlik: 0,
        onaylananEtkinlik: 0,
        onayBekleyen: 0
    });
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/mobile/organizator/panel');
            setStats(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchStats();
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [])
    );

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Hoş Geldin, Organizatör 👋</Text>
                <Text style={styles.subText}>Etkinliklerinizi buradan yönetebilirsiniz.</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.card}>
                    <Ionicons name="calendar" size={30} color="#1d9bf0" />
                    <Text style={styles.cardValue}>{stats.toplamEtkinlik}</Text>
                    <Text style={styles.cardLabel}>Toplam Etkinlik</Text>
                </View>

                <View style={styles.card}>
                    <Ionicons name="checkmark-circle" size={30} color="#00ba7c" />
                    <Text style={styles.cardValue}>{stats.onaylananEtkinlik}</Text>
                    <Text style={styles.cardLabel}>Onaylanan</Text>
                </View>

                <View style={[styles.card, styles.fullWidthCard]}>
                    <Ionicons name="time" size={30} color="#f91880" />
                    <Text style={styles.cardValue}>{stats.onayBekleyen}</Text>
                    <Text style={styles.cardLabel}>Onay Bekleyen</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0a0e17', padding: 20 },
    welcomeContainer: { marginBottom: 30 },
    welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    subText: { color: '#8899a6', marginTop: 5 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    card: {
        backgroundColor: '#151f2b',
        width: '47%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#253341'
    },
    fullWidthCard: { width: '100%' },
    cardValue: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 10 },
    cardLabel: { color: '#8899a6', fontSize: 14 }
});
