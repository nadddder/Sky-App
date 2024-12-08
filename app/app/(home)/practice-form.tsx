// app/(app)/practice-form.tsx
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useCallback, memo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import { useBodyPainModal } from '~/hooks/body-pain/use-body-pain-modal';
import { PracticeIntensitySlider } from '~/components/practice/intensity-slider';
import { PracticeDurationSlider } from '~/components/practice/duration-slider';

const PainToggle = memo(function PainToggle({
    value,
    onChange
}: {
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <View className="flex flex-row items-center justify-center gap-4">
            <Pressable
                onPress={() => onChange(true)}
                className={`px-6 py-2 rounded-full ${value ? 'bg-gray-900' : 'bg-gray-100'
                    }`}
            >
                <Text className={`${value ? 'text-white' : 'text-gray-900'
                    }`}>
                    Yes
                </Text>
            </Pressable>
            <Pressable
                onPress={() => onChange(false)}
                className={`px-6 py-2 rounded-full ${!value ? 'bg-gray-900' : 'bg-gray-100'
                    }`}
            >
                <Text className={`${!value ? 'text-white' : 'text-gray-900'
                    }`}>
                    No
                </Text>
            </Pressable>
        </View>
    );
});

export default function PracticeFormScreen() {
    const { mood } = useLocalSearchParams<{ mood: string }>();
    const [intensity, setIntensity] = useState(50);
    const [duration, setDuration] = useState(15);
    const [hasPain, setHasPain] = useState(false)
    const { open } = useBodyPainModal();

    const handlePainToggle = useCallback((hasPain: boolean) => {
        setHasPain(hasPain);
        if (hasPain) {
            open('/app/practice-form');
        }
    }, [open]);

    const handlePainCheck = useCallback(() => {
        setHasPain(true)
        open('/practice-form');
    }, [open]);

    const handleStartPractice = useCallback(() => {
        // Here we would start the practice with the selected parameters
        console.log('Starting practice with:', { mood, intensity, duration });
        // Navigate to practice screen (to be implemented)
        // router.push('/exercise-details');
    }, [mood, intensity, duration]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            <Animated.ScrollView
                entering={FadeIn}
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
            >
                <View className="py-8">
                    <Text className="mb-2 text-2xl font-bold text-gray-900">
                        Awesome!
                    </Text>
                    <Text className="max-w-xs mb-6 text-5xl font-bold text-gray-600">
                        Let's build on that good vibe.
                    </Text>
                    <View className='flex flex-col gap-12'>
                        {/* Intensity Selection */}
                        <View className="mb-8">
                            <Text className="mb-6 text-lg font-medium text-gray-900">
                                Gentle flow or push your limits?
                            </Text>
                            <PracticeIntensitySlider
                                value={intensity}
                                onValueChange={setIntensity}
                            />
                        </View>

                        {/* Duration Selection */}
                        <View className="mb-8">
                            <Text className="mb-6 text-lg font-medium text-gray-900">
                                How long do you want to flow?
                            </Text>
                            <PracticeDurationSlider
                                value={duration}
                                onValueChange={setDuration}
                            />
                        </View>

                        {/* Pain/Discomfort Check */}
                        <View className="mb-8">
                            <Text className="mb-6 text-lg font-medium text-gray-900">
                                Feeling any discomfort/pain?
                            </Text>
                            <View className="flex-row gap-4">
                                <PainToggle value={hasPain}
                                    onChange={handlePainToggle} />
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Start Practice Button */}
            <View className="p-6 bg-white border-t border-gray-200">
                <Button
                    onPress={handleStartPractice}
                    className="w-full bg-gray-900"
                >
                    Let's flow
                </Button>
            </View>
        </SafeAreaView>
    );
}