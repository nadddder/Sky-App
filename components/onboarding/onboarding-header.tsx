// components/onboarding-header.tsx
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { performanceMonitor } from '~/services/performance';

interface OnboardingHeaderProps {
    showBackButton?: boolean;
}

const BackButton = memo(function BackButton({
    onPress
}: {
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View>
                <Entypo
                    name="chevron-small-left"
                    size={20}
                    color="#1f2937"
                />
            </View>
        </TouchableOpacity>
    );
});

export const OnboardingHeader = memo(function OnboardingHeader({
    showBackButton = true
}: OnboardingHeaderProps) {
    const router = useRouter();

    const handleBack = useCallback(async () => {
        await performanceMonitor.runAfterInteractions(
            () => router.back(),
            'Header Back Navigation'
        );
    }, [router]);

    return (
        <View className="flex-row items-center h-20 p-4 py-4 mt-12 justify-evenly">
            <View className="flex items-start justify-center w-1/3 h-full " >
                {showBackButton && (
                    <BackButton onPress={handleBack} />
                )}
            </View>
            <View className='flex items-center justify-center w-1/3'>
                {/* <Text className="text-lg font-semibold text-center text-gray-900 ">
                    SKY
                </Text> */}
                <Image source={require("~/assets/images/sky.png")} resizeMode='contain' className='w-10 h-10' />
            </View>

            <View className="flex w-1/3 bg-blue-700" />
        </View>
    );
});