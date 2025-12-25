
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Etkinlik } from '@/constants/types';
import { useSession } from '@/context/ctx';

export default function HomeScreen() {
  const [events, setEvents] = useState<Etkinlik[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/mobile/katilimci/etkinlikler');
      // Check if response is HTML (login page)
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        console.error("Received HTML instead of JSON. Session might be invalid or path incorrect.");
        Alert.alert('Hata', 'Oturum hatası. Lütfen tekrar giriş yapın.');
        return;
      }
      console.log("Etkinlik Response:", JSON.stringify(response.data, null, 2));
      setEvents(response.data);
    } catch (error) {
      console.error("Etkinlik Fetch Error:", error);
      Alert.alert('Hata', 'Etkinlikler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoin = async (id: number) => {
    try {
      const response = await axios.post(`/mobile/katilimci/katil/${id}`);
      Alert.alert('Bilgi', response.data.message);
    } catch (error) {
      Alert.alert('Hata', 'Katılım işlemi başarısız.');
    }
  };

  const renderItem = ({ item }: { item: Etkinlik }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.baslik}</Text>
      <Text style={styles.date}>{new Date(item.tarih).toLocaleString()}</Text>
      <Text style={styles.desc}>{item.aciklama}</Text>
      <Text style={styles.info}>{item.yer} - Kontenjan: {item.kontenjan}</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleJoin(item.id)}>
        <Text style={styles.buttonText}>Katıl</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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
  button: { backgroundColor: '#1d9bf0', padding: 10, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#8899a6' }
});
