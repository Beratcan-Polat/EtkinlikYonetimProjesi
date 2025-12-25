import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { Kullanici } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';

export default function UserManagementScreen() {
    const [users, setUsers] = useState<Kullanici[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/mobile/admin/kullanicilar');
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    // State for role change modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const handleChangeRole = (id: number) => {
        setSelectedUserId(id);
        setModalVisible(true);
    };

    const handleRoleSelect = (role: string) => {
        if (selectedUserId) {
            updateRole(selectedUserId, role);
        }
        setModalVisible(false);
        setSelectedUserId(null);
    };

    const updateRole = async (id: number, role: string) => {
        try {
            await axios.post(`/mobile/admin/kullanici/rol-degistir/${id}?rol=${role}`);
            Alert.alert('Başarılı', 'Kullanıcı rolü güncellendi.');
            fetchUsers();
        } catch (error) {
            Alert.alert('Hata', 'Rol değiştirilemedi.');
        }
    };

    const renderItem = ({ item }: { item: Kullanici }) => (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.adSoyad}</Text>
                <Text style={styles.detail}>ID: {item.id}</Text>
                <Text style={styles.email}>{item.eposta}</Text>
                <Text style={styles.detail}>{item.telefon}</Text>
                <Text style={styles.username}>@{item.kullaniciAdi}</Text>
            </View>

            <TouchableOpacity style={styles.roleBadge} onPress={() => handleChangeRole(item.id)}>
                <Text style={styles.roleText}>{item.rol}</Text>
                <Ionicons name="pencil" size={12} color="#fff" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={fetchUsers}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rol Değiştir</Text>
                        <Text style={styles.modalSubtitle}>Yeni rolü seçiniz:</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => handleRoleSelect('KATILIMCI')}>
                            <Text style={styles.modalButtonText}>Katılımcı Yap</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={() => handleRoleSelect('ORGANIZATOR')}>
                            <Text style={styles.modalButtonText}>Organizatör Yap</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={() => handleRoleSelect('ADMIN')}>
                            <Text style={styles.modalButtonText}>Admin Yap</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>İptal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        borderColor: '#253341',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    email: { color: '#8899a6', fontSize: 13 },
    detail: { color: '#8899a6', fontSize: 13 },
    username: { color: '#1d9bf0', fontSize: 12, marginTop: 2 },
    roleBadge: {
        backgroundColor: '#253341',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1d9bf0'
    },
    roleText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#151f2b',
        borderRadius: 15,
        padding: 20,
        width: '80%',
        elevation: 5,
        borderWidth: 1,
        borderColor: '#253341'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalSubtitle: {
        color: '#8899a6',
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButton: {
        backgroundColor: '#253341',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    modalButtonText: {
        color: '#1d9bf0',
        fontWeight: 'bold',
        fontSize: 16
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#8899a6',
        marginTop: 5
    },
    cancelButtonText: {
        color: '#8899a6',
        fontWeight: 'bold'
    }
});
