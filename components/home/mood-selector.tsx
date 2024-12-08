// components/home/mood-selector.tsx
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { memo, useCallback, useState } from 'react';
import Animated, {
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Mood {
    id: string;
    icon: keyof typeof FontAwesome6.glyphMap;
    label: string;
}

const MOODS: Mood[] = [
    { id: 'energetic', icon: 'bolt', label: 'Energetic' },
    { id: 'balanced', icon: 'peace', label: 'Balanced' },
    { id: 'calm', icon: 'moon', label: 'Calm' },
    { id: 'stressed', icon: 'cloud-bolt', label: 'Stressed' },
    { id: 'tired', icon: 'battery-quarter', label: 'Tired' },
];

const ITEM_SIZE = 80;
const ITEM_SPACING = 20;

export const MoodSelector = memo(function MoodSelector() {
    const { width } = useWindowDimensions();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const translateX = useSharedValue(0);

    const handleMoodSelect = useCallback((moodId: string) => {
        setSelectedMood(moodId);
        router.push('/app/practice-form');
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View className="mb-6">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                decelerationRate="fast"
                snapToInterval={ITEM_SIZE + ITEM_SPACING}
            >
                {MOODS.map((mood, index) => (
                    <Animated.View
                        key={mood.id}
                        entering={FadeIn.delay(index * 100)}
                        className="items-center"
                        style={{
                            marginRight: ITEM_SPACING,
                            width: ITEM_SIZE,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handleMoodSelect(mood.id)}
                            className={`items-center justify-center w-20 h-20 rounded-2xl ${selectedMood === mood.id
                                ? 'bg-gray-900'
                                : 'bg-gray-100'
                                }`}
                            activeOpacity={0.7}
                        >
                            <FontAwesome6
                                name={mood.icon}
                                size={32}
                                color={selectedMood === mood.id ? '#ffffff' : '#4b5563'}
                            />
                        </TouchableOpacity>
                        <Text
                            className={`mt-2 text-sm ${selectedMood === mood.id
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-600'
                                }`}
                        >
                            {mood.label}
                        </Text>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
});