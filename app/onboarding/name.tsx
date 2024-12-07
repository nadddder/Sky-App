// app/onboarding/name.tsx

import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import { OnboardingScreen } from '~/components/onboarding/screen'

const NameScreen = () => {
  const handleContinue = useCallback(async () => {

  }, []);
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
      <Text>Hey</Text>
    </OnboardingScreen>
  )
}

export default NameScreen