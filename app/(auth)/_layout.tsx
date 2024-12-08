// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    gestureEnabled: false
                }}
            >
                <Stack.Screen name="verify-email" />
                <Stack.Screen name="signin" />
            </Stack>
        </SafeAreaView>
    );
}