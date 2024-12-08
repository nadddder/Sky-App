// components/welcome/bottom-section.tsx

import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";
import { router } from 'expo-router';
import { useBodyPainModal } from "~/hooks/body-pain/use-body-pain-modal";

export default function WelcomeBottomSection() {
    const handleGetStarted = () => {
        router.push('/onboarding/name');
    };

    const handleLogin = () => {
        router.push('/(auth)/signin');

    };
    return (
        <View className="gap-8 px-6 py-24">
            {/* New User Section */}
            <View className="flex flex-col items-center justify-center gap-2">
                <Text className="text-lg text-center text-gray-600 capitalize">
                    New user?
                </Text>
                <Button
                    onPress={handleGetStarted}
                    className="w-1/2 px-0 bg-gray-500/40"
                    textClassName='text-gray-800 font-Semibold capitalize text-lg'
                    variant="default"
                >
                    Get started here
                </Button>
            </View>

            {/* Returning User Section */}
            <View className="flex flex-col items-center justify-center gap-2">
                <Text className="text-lg text-center text-gray-600">
                    Returning user?
                </Text>
                <Button
                    variant="ghost"
                    onPress={handleLogin}
                    className=""
                    textClassName="text-black font-semibold text-lg"
                >
                    Login
                </Button>
            </View>
        </View>
    )
}