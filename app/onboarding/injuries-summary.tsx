// app/onboarding/injuries-summary.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import BodyHighlighter, { ExtendedBodyPart, Slug } from 'react-native-body-highlighter';
import { Entypo } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import { useStore, useHydration } from '~/store/root-store';
import { LoadingScreen } from '~/components/loading-screen';
import { Button } from '~/components/ui/button';

const COLORS = [
    '#9EA0A3',  // Default color (not used)
    '#F97316',  // Selected color (orange for visibility)
];

export default function InjuriesSummaryScreen() {
    const router = useRouter();
    const hasHydrated = useHydration();

    const injuries = useStore((state) => state.injuries);
    const gender = useStore((state) => state.gender);

    // Transform injuries data for the BodyHighlighter
    const bodyData = useMemo(() => {
        if (!hasHydrated || !injuries) return [];

        const data: ExtendedBodyPart[] = [];

       

        if (injuries instanceof Map) {
            injuries.forEach((pains, id) => {
                const [baseSlug, side] = id.split('-') as [Slug, ('left' | 'right')?];

                if (baseSlug) {
                    data.push({
                        slug: baseSlug,
                        side,
                        intensity: 1
                    });
                }
            });
        } else {
            console.log('Current injuries data:', injuries);
        }
        console.log(`SUMMARY - Body Data: ${JSON.stringify(data)}`) 
        return data;
    }, [injuries, hasHydrated]);

    // Calculate the total number of injured areas
    const injuryCount = useMemo(() => {
        if (injuries instanceof Map) {
            return injuries.size;
        }
        return 0;
    }, [injuries]);

    if (!hasHydrated) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <StatusBar style="light" />

            <TouchableOpacity
                onPress={() => router.push('/onboarding/experience')}
                className="absolute z-10 right-4 top-12"
            >
                <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>

            <Animated.View
                entering={FadeIn.delay(300)}
                className="flex-col flex-1 gap-4 px-4 pt-12"
            >
                <Text className="mb-4 text-xl text-center text-white">
                    You've shared {injuryCount} {injuryCount === 1 ? 'area' : 'areas'} of discomfort!
                </Text>

                <Text className="mb-8 text-base text-center text-white/70">
                    We'll help ease the discomfort{'\n'}and support your recovery
                </Text>

                <View className="flex-row items-center justify-around mt-4">
                    <View className="items-center flex-1">
                        <BodyHighlighter
                            data={bodyData}
                            side="front"
                            gender={gender === "female" ? "female" : "male"}
                            scale={0.7}
                            border='none'
                            colors={COLORS}
                        />
                    </View>

                    <View className="items-center flex-1">
                        <BodyHighlighter
                            data={bodyData}
                            side="back"
                            gender={gender === "female" ? "female" : "male"}
                            scale={0.7}
                            colors={COLORS}
                            border='none'
                        />
                    </View>
                </View>

                <Text className="mt-8 text-sm text-center text-white/50">
                    You can update this later{'\n'}from your profile
                </Text>

                <Button
                    variant="secondary"
                    onPress={() => router.push('/onboarding/experience')}
                >
                    Continue
                </Button>
            </Animated.View>
        </SafeAreaView>
    );
}