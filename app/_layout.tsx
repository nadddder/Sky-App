// app/_layout.tsx

import { ErrorBoundary } from '~/components/error-boundary/error-boundary';
import '../global.css';

import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {  useStore } from '~/store/root-store';
import { useEffect } from 'react';
import { BodyPainProvider } from '~/providers/body-pain/body-pain-provider';
import { AppMonitor, useAppMonitor } from '~/components/monitoring/app-monitor';
import { useRouteGuard } from '~/hooks/use-route-guard';
import { auth } from "~/lib/firebase/config";

export default function Layout() {
  const setAuthToken = useStore(state => state.setAuthToken);
  useRouteGuard();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setAuthToken(token);
      } else {
        setAuthToken(undefined);
      }
    });

    return () => unsubscribe();
  }, [setAuthToken]);



  return (
    <ErrorBoundary>
      <AppMonitor />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BodyPainProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='onboarding' options={{
              gestureEnabled: false
            }} />
            <Stack.Screen
              name="(auth)"
              options={{
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="app"
              options={{
                gestureEnabled: false,
                animation: 'fade'
              }}
            />
          </Stack>
        </BodyPainProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
