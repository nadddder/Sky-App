// app/onboarding/gender.tsx

import React, { useCallback, useEffect } from 'react'
import { OnboardingScreen } from '~/components/onboarding/screen'
import GenderContent from '~/components/onboarding/gender-content'
import { useHydration, useStore } from '~/store/root-store'
import { Gender } from '~/types/onboarding'
import { performanceMonitor } from '~/services/performance'
import { useRouter } from 'expo-router'
import { LoadingScreen } from '~/components/loading-screen'

const GenderScreen = () => {

  const storeGender = useStore((state) => state.gender);
  const storeDispatch = useStore((state) => state.dispatch);
  const router = useRouter()
  const hasHydrated = useHydration();

  useEffect(() => {
    console.log('Saved gender:', storeGender);
  }, [storeGender]);

  const handleGenderSelect = useCallback((gender: Gender) => {
    performanceMonitor.runAfterInteractions(async () => {
      storeDispatch({ type: 'SET_GENDER', payload: gender });
    }, 'Select Gender');
  }, [storeDispatch]);

  const handleContinue = useCallback(() => {
    performanceMonitor.runAfterInteractions(async () => {
      storeDispatch({ type: 'SET_STEP', payload: 3 });
      router.push('/onboarding/focus');
    }, 'Gender Continue Navigation');
  }, [storeDispatch]);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  return (
    <OnboardingScreen
      title="How do you identify yourself?"
      onNext={handleContinue}
      isNextDisabled={!storeGender}
      showFooterImage
      imageOpacity={0.1}
      backgroundImage={require("~/assets/images/lotus.png")}
    >
      <GenderContent
        value={storeGender}
        onChange={handleGenderSelect}
      />
    </OnboardingScreen>
  )
}

export default GenderScreen