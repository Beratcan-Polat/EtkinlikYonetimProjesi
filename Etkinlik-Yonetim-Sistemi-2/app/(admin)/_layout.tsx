import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/context/ctx';
import { TouchableOpacity } from 'react-native';

export default function AdminLayout() {
    const { signOut } = useSession();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0a0e17',
                    borderBottomWidth: 1,
                    borderBottomColor: '#253341',
                },
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#0a0e17',
                    borderTopWidth: 1,
                    borderTopColor: '#253341',
                },
                tabBarActiveTintColor: '#1d9bf0',
                tabBarInactiveTintColor: '#8899a6',
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Panel',
                    tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={28} color={color} />,
                    headerRight: () => (
                        <TouchableOpacity onPress={signOut} style={{ marginRight: 15 }}>
                            <Ionicons name="log-out-outline" size={24} color={'#F44336'} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="pending"
                options={{
                    title: 'Onay Bekleyen',
                    tabBarIcon: ({ color }) => <Ionicons name="time" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="all-events"
                options={{
                    title: 'Tüm Etkinlikler',
                    tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add-event"
                options={{
                    href: null, // Hidden from tab bar
                    title: 'Yeni Etkinlik',
                    tabBarStyle: { display: 'none' }, // Hide tab bar on this screen
                }}
            />
            <Tabs.Screen
                name="edit-event"
                options={{
                    href: null,
                    title: 'Düzenle',
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="event-participants"
                options={{
                    href: null,
                    title: 'Katılımcılar',
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="users"
                options={{
                    title: 'Kullanıcılar',
                    tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}
