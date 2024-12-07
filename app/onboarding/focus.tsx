// app/onboarding/focus.tsx

import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { OnboardingScreen } from '~/components/onboarding/screen'
import { useHydration, useStore } from '~/store/root-store';
import { YOGA_FOCUSES } from '~/types/onboarding';
import { FocusOption } from '~/components/onboarding/focus-option';
import { performanceMonitor } from '~/services/performance';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '~/components/loading-screen';

const FocusScreen = () => {
  const hasHydrated = useHydration()

  const router = useRouter()
  const storeFocuses = useStore((state) => state.focuses);
  const storeName = useStore((state) => state.name);
  const storeDispatch = useStore((state) => state.dispatch);

  useEffect(() => {
    console.log('Stored focuses:', storeFocuses);
  }, [storeFocuses])

  const currentFocuses = useMemo(() => {
    console.log("MEMO", storeFocuses)
    return new Set(Array.isArray(storeFocuses) ? storeFocuses : storeFocuses);
  },
    [storeFocuses]
  );



  const toggleFocus = useCallback((focusId: string) => {
    performanceMonitor.runAfterInteractions(async () => {
      const newFocuses = new Set(currentFocuses);

      if (newFocuses.has(focusId)) {
        newFocuses.delete(focusId);
      } else {
        newFocuses.add(focusId);
      }

      // Update both stores during transition
      storeDispatch({ type: 'SET_FOCUSES', payload: newFocuses });
    }, 'Toggle Focus');
  }, [currentFocuses, storeDispatch]);

  const handleContinue = useCallback(() => {
    performanceMonitor.runAfterInteractions(async () => {
      // Update both stores during transition
      storeDispatch({ type: 'SET_STEP', payload: 3 });
      router.push('/onboarding/injuries-check');
    }, 'Focus Continue Navigation');
  }, [storeDispatch]);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  return (
    <OnboardingScreen
      onNext={handleContinue}
      showFooterImage
      imageOpacity={0.1}
      backgroundImage={require("~/assets/images/lotus.png")}
      isNextDisabled={currentFocuses.size === 0}
    >
      <View className="flex-1">
        <Text className="mb-2 text-xl text-center text-gray-600">
          Welcome {storeName},
        </Text>

        <Text className="mb-8 text-2xl font-bold text-center text-gray-900">
          What's your main focus in your yoga journey?
        </Text>

        <Text className="mb-6 text-base text-center text-gray-500">
          Select all that apply
        </Text>

        <View className="space-y-2">
          {currentFocuses && YOGA_FOCUSES.map((focus) => {
            console.log(`FOCUS OPTION: ${JSON.stringify(focus)}`)
            return (
              <FocusOption
                key={focus.id}
                title={focus.title}
                selected={currentFocuses.has(focus.id)}
                onSelect={() => toggleFocus(focus.id)}
              />
            )
          })}
        </View>
      </View>
    </OnboardingScreen>
  )
}

export default FocusScreen