// hooks/use-route-guard.ts
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useStore, useHydration } from '~/store/root-store';
import { auth } from '~/lib/firebase/config';

export function useRouteGuard() {
    const segments = useSegments();
    const router = useRouter();
    const hasHydrated = useHydration();

    const isAuthenticated = useStore(state => state.isAuthenticated);
    const isOnboardingComplete = useStore(state => state.isOnboardingComplete);
    const currentStep = useStore(state => state.currentStep);

    useEffect(() => {
        if (!hasHydrated) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inOnboarding = segments[0] === 'onboarding';
        const inApp = segments[0] === 'app';
        const onWelcome = segments[0] === undefined;

        const isVerified = auth.currentUser?.emailVerified ?? false;

        if (isAuthenticated && isVerified && inAuthGroup) {
            // Authenticated users shouldn't be in auth routes
            router.replace('/app/(home)');
            return;
        }

        if (isAuthenticated && !isVerified && !inAuthGroup) {
            // Unverified users should be on verify email screen
            router.replace('/(auth)/verify-email');
            return;
        }

        if (!isAuthenticated && inApp) {
            // Unauthenticated users can't access app routes
            router.replace('/(auth)/signin');
            return;
        }

        if (isAuthenticated && isVerified && !isOnboardingComplete && !inOnboarding) {
            // Authenticated but incomplete onboarding
            router.replace(`/onboarding/name`);
            return;
        }

        if (!isAuthenticated && inOnboarding) {
            // Unauthenticated users shouldn't start onboarding
            router.replace('/');
            return;
        }

        // Handle onboarding step protection
        if (inOnboarding) {
            // const currentSegment = segments[1] === undefined ? "/" : segments[1];
            // const stepMap: Record<string, number> = {
            //     'name': 1,
            //     'gender': 2,
            //     'focus': 3,
            //     'injuries-check': 3,
            //     'injuries-summary': 3,
            //     'experience': 4,
            //     'eager-poses': 4,
            // };

            // const requiredStep = stepMap[currentSegment];
            // if (requiredStep && currentStep < requiredStep) {
            //     const previousStep = Object.entries(stepMap).find(([, step]) => step === currentStep)?.[0];
            //     if (previousStep) {
            //         router.replace('/onboarding/' + previousStep as '/onboarding/name' | '/onboarding/gender' | '/onboarding/focus' | '/onboarding/injuries-check' | '/onboarding/injuries-summary' | '/onboarding/experience' | '/onboarding/eager-poses');
            //     } else {
            //         router.replace('/onboarding/name');
            //     }
            // }
        }

    }, [hasHydrated, segments, isAuthenticated, isOnboardingComplete, currentStep, router]);
}