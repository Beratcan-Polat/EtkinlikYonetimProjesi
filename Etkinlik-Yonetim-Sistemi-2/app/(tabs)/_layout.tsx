
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/context/ctx';
import { Text, TouchableOpacity } from 'react-native';

export default function TabLayout() {
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
          title: 'Etkinlikler',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'Katıldıklarım',
          tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilim',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
