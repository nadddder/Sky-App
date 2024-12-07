// components/OnboardingProgress.tsx
import { View, Text } from 'react-native';

interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
    return (
        <View className="flex-row items-center justify-center my-6 space-x-2 ">
            <Text className="text-4xl font-medium text-gray-300">
                {currentStep}/{totalSteps}
            </Text>
            <View className="flex-1 h-1 rounded-full max-w-[100px]">
                <View
                    className="h-1 rounded-full bg-primary"

                />
            </View>
        </View>
    );
}