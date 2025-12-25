import { Stack, useRouter, useRootNavigationState, useSegments } from "expo-router";
import { SessionProvider, useSession } from "@/context/ctx";
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from 'react-native';

function RootLayoutNav() {
  const { session, isLoading, role } = useSession();
  const rootNavigationState = useRootNavigationState();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    if (!rootNavigationState?.key) return; // Wait for navigation to be ready

    // const inAuthGroup = segments[0] === '(auth)'; // Removed as (auth) group does not exist
    const inSignInScreen = segments[0] === 'sign-in';
    const inSignUpScreen = segments[0] === 'sign-up';

    // Wrap navigation in setTimeout to avoid "navigate before mount" error
    const timer = setTimeout(() => {
      if (!session && !inSignInScreen && !inSignUpScreen) {
        // Redirect to sign-in if no session and not already there or in sign-up
        router.replace('/sign-in');
      } else if (session) {

        if (role === 'ADMIN') {
          if (segments[0] !== '(admin)') router.replace('/(admin)');
        } else if (role === 'ORGANIZATOR') {
          if (segments[0] !== ('(organizator)' as any)) router.replace('/(organizator)' as any);
        } else {
          // Standard user (KATILIMCI)
          if (segments[0] !== '(tabs)') router.replace('/(tabs)');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [session, isLoading, rootNavigationState?.key, segments, role]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(organizator)" options={{ headerShown: false }} />
      </Stack>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  }
});

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}
