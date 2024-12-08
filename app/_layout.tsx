// app/_layout.tsx

import { ErrorBoundary } from '~/components/error-boundary/error-boundary';
import '../global.css';

import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useHydration, useStore } from '~/store/root-store';
import { LoadingScreen } from '~/components/loading-screen';
import { useEffect } from 'react';
import { BodyPainProvider } from '~/providers/body-pain/body-pain-provider';
import { AppMonitor, useAppMonitor } from '~/components/monitoring/app-monitor';

export default function Layout() {
  const hasHydrated = useHydration();
  const router = useRouter();
  const segments = useSegments();
  const { logEvent } = useAppMonitor();

  const currentStep = useStore((state) => state.currentStep);
  const isOnboardingComplete = useStore((state) => state.isOnboardingComplete);

  console.log(`Current Step: ${currentStep}`)
  console.log(`Is onboarding complete? ${isOnboardingComplete}`)

  // Monitor hydration status
  useEffect(() => {
    logEvent('HYDRATION_STATUS', {
      hasHydrated,
      currentStep,
      isOnboardingComplete,
      currentSegment: segments[0],
    });
  }, [hasHydrated, currentStep, isOnboardingComplete, segments]);

  // Monitor store state
  useEffect(() => {
    const storeState = useStore.getState();
    logEvent('STORE_STATE', {
      _hasHydrated: storeState._hasHydrated,
      isOnboardingComplete: storeState.isOnboardingComplete,
      currentStep: storeState.currentStep,
      // Add other relevant state properties
    });
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    console.log(segments[0])
    const inOnboarding = segments[0] === 'onboarding';
    const onWelcome = segments[0] === undefined;

    logEvent('NAVIGATION_CHECK', {
      currentStep,
      isOnboardingComplete,
      inOnboarding,
      onWelcome,
      segment: segments[0],
    });

    if (currentStep === 1 && !isOnboardingComplete && !onWelcome && !inOnboarding) {
      router.replace('/');
    }
  }, [hasHydrated, currentStep, isOnboardingComplete, segments, router]);


  // if (!hasHydrated) {
  //   logEvent('SHOWING_LOADING_SCREEN', {
  //     timestamp: new Date().toISOString(),
  //   });
  //   return <LoadingScreen />;
  // }

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
