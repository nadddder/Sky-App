// app/onboarding/name.tsx

import { View, Text } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { OnboardingScreen } from '~/components/onboarding/screen'
import NameContent from '~/components/onboarding/name-content';
import { useHydration, useStore } from '~/store/root-store';
import { useNameForm } from '~/hooks/use-name-form';
import { performanceMonitor } from '~/services/performance';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '~/components/loading-screen';

const NameScreen = () => {
  const hasHydrated = useHydration();
  const dispatch = useStore((state) => state.dispatch);
  const currentName = useStore((state) => state.name);
  const router = useRouter()

  const {
    formState,
    inputRef,
    handleChangeText,
    validateName,
    isSubmitting,
  } = useNameForm();

  useEffect(() => {
    console.log('Current store name:', currentName);
  }, [currentName]);

  const handleContinue = useCallback(async () => {
    if (isSubmitting) return;

    const isValid = validateName();
    if (!isValid) return;

    await performanceMonitor.runAfterInteractions(async () => {
      try {
        const nameToSet = formState.name.trim();
        console.log('Setting name:', nameToSet); // Add debugging
        dispatch({ type: 'SET_NAME', payload: nameToSet });
        dispatch({ type: 'SET_STEP', payload: 2 });
        router.push('/onboarding/gender');
      } catch (error) {
        console.error('Error saving name:', error);
      }
    }, 'Save Name and Navigate');
  }, [dispatch, formState.name, isSubmitting, validateName]);

  useEffect(() => {
    if (currentName && !formState.name) {
      handleChangeText(currentName);
    }
  }, [currentName, handleChangeText]);

  // if (!hasHydrated) {
  //   return <LoadingScreen />;
  // }

  return (
    <OnboardingScreen
      showBackButton={false}
      onNext={handleContinue}
      isNextDisabled={false}
      keyboardAvoid
      showFooterImage={false}
      imageOpacity={0.1}
      backgroundImage={require("~/assets/images/lotus.png")}
    >
      <NameContent
        value={formState.name}
        error={formState.error}
        onChangeText={handleChangeText}
        inputRef={inputRef}
      />
    </OnboardingScreen>
  )
}

export default NameScreen