// components/welcome/reset-button.tsx
import { Alert } from 'react-native';
import { Button } from '../ui/button';
import { performanceMonitor } from '~/services/performance';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '~/store/root-store';

export default function ResetButton() {
    const storeDispatch = useStore((state) => state.dispatch);

    const handleReset = useCallback(() => {
        Alert.alert(
            'Reset Progress',
            'Are you sure you want to reset all your progress? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await performanceMonitor.runAfterInteractions(async () => {
                            try {
                                // Reset stores first
                                storeDispatch({ type: 'RESET_STATE' });

                                // Then clear storage
                                await AsyncStorage.multiRemove([
                                    'yoga-app-storage',
                                    'onboardingState'
                                ]);
                            } catch (error) {
                                console.error('Error during reset:', error);
                                Alert.alert(
                                    'Error',
                                    'Failed to reset progress. Please try again.'
                                );
                            }
                        }, 'Reset Onboarding State');
                    }
                }
            ]
        );
    }, [storeDispatch]);

    return (
        <Button
            variant="destructive"
            onPress={handleReset}
            className="w-auto px-4 py-2"
            textClassName="text-sm"
        >
            Reset Progress
        </Button>
    );
}