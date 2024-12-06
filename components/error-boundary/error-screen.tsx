// components/error-boundary/error-screen.tsx
import { memo } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ErrorScreenProps {
    error: Error | null;
    onReset?: () => void;
}

export const ErrorScreen = memo(function ErrorScreen({
    error,
    onReset
}: ErrorScreenProps) {
    const handleGoHome = () => {
        router.push('/');
        onReset?.();
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <Animated.View
                entering={FadeIn}
                className="items-center justify-center flex-1 px-6"
            >
                <View className="items-center space-y-4">
                    <Text className="text-2xl font-bold text-gray-900">
                        Oops! Something went wrong
                    </Text>

                    <Text className="text-base text-center text-gray-600">
                        We apologize for the inconvenience. Please try again.
                    </Text>

                    {__DEV__ && error && (
                        <Text className="p-4 mt-4 text-sm text-red-600 rounded-lg bg-red-50">
                            {error.message}
                        </Text>
                    )}

                    <View className="flex-row gap-4 mt-8">
                        {onReset && (
                            <Button
                                variant="outline"
                                onPress={onReset}
                                className="px-6"
                            >
                                Try Again
                            </Button>
                        )}

                        <Button
                            onPress={handleGoHome}
                            className="px-6"
                        >
                            Go Home
                        </Button>
                    </View>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
});