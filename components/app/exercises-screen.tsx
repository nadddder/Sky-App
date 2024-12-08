// components/app/exercises-screen.tsx
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    FadeInDown,
    SlideInRight,
} from 'react-native-reanimated';
import { memo } from 'react';

interface Exercise {
    id: string;
    title: string;
    duration: string;
    category: string;
    equipment?: string;
    image: any; // In production, we'd use a proper type for images
}

const EXERCISES: Exercise[] = [
    {
        id: '1',
        title: 'Core & Lower Back Strength',
        duration: '45 min',
        category: 'Better Posture',
        equipment: 'No props needed',
        image: require('~/assets/images/exercises/core.png'),
    },
    {
        id: '2',
        title: 'Deep Stretch for Hips & Hamstrings',
        duration: '30 min',
        category: 'Hip Flexibility',
        equipment: 'Yoga Block',
        image: require('~/assets/images/exercises/stretch.png'),
    },
    {
        id: '3',
        title: 'Leg Strength & Core',
        duration: '15 min',
        category: 'Balance',
        equipment: 'Wall',
        image: require('~/assets/images/exercises/leg.png'),
    },
];

const ExerciseCard = memo(function ExerciseCard({
    exercise,
    index
}: {
    exercise: Exercise;
    index: number;
}) {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 200).springify()}
            className="flex-row p-4 mb-4 bg-white rounded-xl"
        >
            <Image
                source={exercise.image}
                className="w-24 h-24 bg-gray-100 rounded-lg"
                resizeMode="cover"
            />
            <View className="flex-1 ml-4">
                <View className="flex-row items-center mb-1">
                    <FontAwesome6
                        name="plus"
                        size={12}
                        color="#76c7c0"
                        className="mr-1"
                    />
                    <Text className="text-sm text-primary">
                        {exercise.category}
                    </Text>
                </View>
                <Text className="mb-1 text-lg font-medium text-gray-900">
                    {exercise.title}
                </Text>
                <View className="flex-row items-center">
                    <Text className="text-gray-600">
                        {exercise.duration}
                    </Text>
                    {exercise.equipment && (
                        <>
                            <Text className="mx-2 text-gray-400">•</Text>
                            <Text className="text-gray-600">
                                {exercise.equipment}
                            </Text>
                        </>
                    )}
                </View>
            </View>
        </Animated.View>
    );
});

const Header = memo(function Header() {
    return (
        <View className="flex-row items-center justify-between px-4 py-2">
            <View className="flex-1">
                <Text className="text-2xl font-semibold text-gray-900">
                    Your Exercises
                </Text>
                <Text className="mt-1 text-base text-gray-500">
                    Based on your recent practice, we've curated these sessions for you.
                </Text>
            </View>
        </View>
    );
});

export function ExercisesScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            <Header />

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
            >
                {EXERCISES.map((exercise, index) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                    />
                ))}

                <View className="mt-6 mb-4">
                    <Text className="text-lg font-medium text-gray-900">
                        Past Exercises
                    </Text>
                </View>

                {/* Past exercises placeholder - can be implemented similarly */}
                <View className="h-40 mb-20" />
            </ScrollView>
        </SafeAreaView>
    );
}