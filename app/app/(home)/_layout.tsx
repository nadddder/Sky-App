// app/(app)/(home)/_layout.tsx
import { Stack } from 'expo-router';
import { BodyPainProvider } from '~/providers/body-pain/body-pain-provider';

export default function HomeLayout() {
    return (
        <BodyPainProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    gestureEnabled: false
                }}
            >
                <Stack.Screen 
                    name="index"
                    options={{
                        // This ensures the tab bar shows on the main home screen
                        animation: 'none'
                    }}
                />
                <Stack.Screen
                    name="practice-form"
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom'
                    }}
                />
                <Stack.Screen
                    name="exercise-details"
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom'
                    }}
                />
            </Stack>
        </BodyPainProvider>
    );
}