// app/onboarding/injuries-check.tsx

import { Alert } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { OnboardingScreen } from '~/components/onboarding/screen'
import InjuriesContent from '~/components/onboarding/injuries-check-content'
import { useHydration, useStore } from '~/store/root-store'
import { InjuryStatus } from '~/types/onboarding'
import { performanceMonitor } from '~/services/performance'
import { useRouter } from 'expo-router'
import { LoadingScreen } from '~/components/loading-screen'

const InjuriesCheckScreen = () => {
  const hasHydrated = useHydration()
  const router = useRouter()
  const storeInjuryStatus = useStore((state) => state.injuryStatus);
  const storeDispatch = useStore((state) => state.dispatch);

  useEffect(() => {
    console.log('Injuries status:', storeInjuryStatus);
  }, [storeInjuryStatus])

  const handleStatusSelect = useCallback((status: InjuryStatus) => {
    performanceMonitor.runAfterInteractions(async () => {
      storeDispatch({ type: 'SET_INJURY_STATUS', payload: status });

      if (status === 'has_injuries') {
        // open('/onboarding/injuries-summary');
      } else {
        Alert.alert(
          'Great!',
          "We're glad you're feeling healthy. Let's continue with your yoga journey!",
          [
            {
              text: 'OK',
              onPress: () => {
                performanceMonitor.runAfterInteractions(async () => {
                  storeDispatch({ type: 'SET_STEP', payload: 4 });
                  router.push('/onboarding/experience');
                }, 'Navigate to Experience');
              }
            }
          ]
        );
      }
    }, 'Select Injury Status');
  }, [storeDispatch]);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  return (
    <OnboardingScreen
      title="To ensure a safe practice, are there any ongoing injuries or chronic pain areas we should be aware of?"
      subtitle="Your health info is private and used only to personalize your experience"
      onNext={() => { }} // Empty function as we don't need the continue button
      nextButton={false} // Hide the continue button
      showProgress={true}
      backgroundImage={require("~/assets/images/lotus.png")}
      showFooterImage
    >
      <InjuriesContent
        injuryStatus={storeInjuryStatus}
        onSelectStatus={handleStatusSelect}
      />
    </OnboardingScreen>
  )
}

export default InjuriesCheckScreen