import { ErrorBoundary } from '~/components/error-boundary/error-boundary';
import '../global.css';

import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useHydration, useStore } from '~/store/root-store';
import { LoadingScreen } from '~/components/loading-screen';
import { useEffect } from 'react';
import { BodyPainProvider } from '~/providers/body-pain/body-pain-provider';

export default function Layout() {
  const hasHydrated = useHydration();
  const router = useRouter();
  const segments = useSegments();

  const currentStep = useStore((state) => state.currentStep);
  const isOnboardingComplete = useStore((state) => state.isOnboardingComplete);

  console.log(`Current Step: ${currentStep}`)
  console.log(`Is onboarding complete? ${isOnboardingComplete}`)

  useEffect(() => {
    if (!hasHydrated) return;

    console.log(segments[0])
    // const inOnboarding = segments[0] === 'onboarding';
    const inOnboarding = false;
    // const onWelcome = segments[0] === 'index';
    const onWelcome = false;

    if (currentStep === 1 && !isOnboardingComplete && !onWelcome && !inOnboarding) {
      // router.replace('/');
    }
  }, [hasHydrated, currentStep, isOnboardingComplete, segments, router]);


  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BodyPainProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='onboarding' options={{
              gestureEnabled: false
            }} />
          </Stack>
        </BodyPainProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
