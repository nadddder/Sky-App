// app/onboarding/_layout.tsx
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: false
            }}
        >
            <Stack.Screen name="name" />
            <Stack.Screen name="gender" />
            <Stack.Screen name="focus" />
            <Stack.Screen name="injuries-check" />
            <Stack.Screen name="injuries-summary" />
            <Stack.Screen name="experience" />
            <Stack.Screen name="eager-poses" />
        </Stack>
    );
}