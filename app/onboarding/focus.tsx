// app/onboarding/focus.tsx

import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { OnboardingScreen } from '~/components/onboarding/screen'
import { useStore } from '~/store/root-store';
import { YOGA_FOCUSES } from '~/types/onboarding';
import { FocusOption } from '~/components/onboarding/focus-option';
import { performanceMonitor } from '~/services/performance';
import { useRouter } from 'expo-router';

const FocusScreen = () => {

  const router = useRouter()
  const storeFocuses = useStore((state) => state.focuses);
  const storeName = useStore((state) => state.name);
  const storeDispatch = useStore((state) => state.dispatch);

  useEffect(() => {
    console.log('Current store focus:', storeFocuses);
  }, [storeFocuses])

  const currentFocuses = useMemo(() =>
    storeFocuses.size > 0 ? storeFocuses : new Set<string>(),
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
          {YOGA_FOCUSES.map((focus) => (
            <FocusOption
              key={focus.id}
              title={focus.title}
              selected={currentFocuses.has(focus.id)}
              onSelect={() => toggleFocus(focus.id)}
            />
          ))}
        </View>
      </View>
    </OnboardingScreen>
  )
}

export default FocusScreen