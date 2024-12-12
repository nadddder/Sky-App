// app/app/(home)/exercise-details.tsx

import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    SlideInRight,
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { EXERCISE_DATA } from '~/data/video-player';
import { DurationTest } from '~/components/video-duration/duration-test';
import { EnhancedVideoPlayer } from '~/components/video-player/enhanced-video-player';



const VideoContext = React.createContext<{
    currentVideoIndex: number;
    setCurrentVideoIndex: (index: number) => void;
}>({
    currentVideoIndex: 0,
    setCurrentVideoIndex: () => { },
});

const ExerciseDetails = () => {
    const router = useRouter();
    const scrollY = useSharedValue(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const headerStyle = useAnimatedStyle(() => ({
        backgroundColor: withSpring(
            scrollY.value > 50 ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            { damping: 20, stiffness: 100 }
        ),
    }));

    const handleVideoComplete = useCallback(() => {
        // Handle completion of all videos
        console.log('All videos completed');
    }, []);

    const handlePoseClick = useCallback((index: number) => {
        setCurrentVideoIndex(index);
    }, []);

    const handleIndexChange = useCallback((index: number) => {
        setCurrentVideoIndex(index);
    }, []);

    return (
        <VideoContext.Provider value={{ currentVideoIndex, setCurrentVideoIndex }}>
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />

                {/* Header */}
                <Animated.View
                    style={headerStyle}
                    className="absolute top-0 right-0 left-0 z-10"
                >
                    <View className="flex-row justify-between items-center px-4 py-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="justify-center items-center w-10 h-10 rounded-full bg-white/80"
                        >
                            <Entypo name="chevron-left" size={24} color="#1f2937" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="justify-center items-center w-10 h-10 rounded-full bg-white/80"
                        >
                            <Entypo name="dots-three-horizontal" size={24} color="#1f2937" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Content */}
                <ScrollView
                    className="flex-1"
                    onScroll={(event) => {
                        scrollY.value = event.nativeEvent.contentOffset.y;
                    }}
                    scrollEventThrottle={16}
                >
                    <Animated.View
                        entering={FadeInDown.duration(600)}
                        className="p-4"
                    >
                        <Text className="mb-2 text-sm text-gray-500">Your flow is ready!</Text>
                        <Text className="mb-4 text-2xl font-bold text-gray-900">
                            Deep Stretch for Hips & Hamstrings
                        </Text>

                        {/* Tags */}
                        <View className="flex-row gap-2 mb-4">
                            <View className="px-3 py-1 bg-gray-100 rounded-full">
                                <Text className="text-sm text-gray-600">Hip Flexibility</Text>
                            </View>
                            <View className="px-3 py-1 bg-gray-100 rounded-full">
                                <Text className="text-sm text-gray-600">30 Min</Text>
                            </View>
                            <View className="px-3 py-1 bg-gray-100 rounded-full">
                                <Text className="text-sm text-gray-600">Yoga Block</Text>
                            </View>
                        </View>

                        <View className="w-full">
                            {/* <EnhancedVideoPlayer /> */}
                            <DurationTest />
                            {/* <SequenceVideoPlayer
                                exerciseData={EXERCISE_DATA}
                                currentIndex={currentVideoIndex}
                                onVideoComplete={() => {
                                    // Handle completion of the sequence
                                    console.log('Video sequence completed');
                                }}
                                onIndexChange={(index) => {
                                    setCurrentVideoIndex(index);
                                }}
                            /> */}
                        </View>

                        {/* Description */}
                        <Animated.Text
                            entering={FadeInDown.delay(300)}
                            className="mt-4 text-base leading-relaxed text-gray-600"
                        >
                            Based on your last practice and your main goal of shaping your body for a better posture and hip alignment, this sequence will help improve flexibility and strength in your hips and hamstrings.
                        </Animated.Text>

                        {/* Moves Section */}
                        <View className="mt-6">
                            <Text className="mb-4 text-lg font-semibold text-gray-900">
                                Moves included:
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="mt-2"
                            >
                                {EXERCISE_DATA.map((exercise, index) => (
                                    <Animated.View
                                        key={exercise.id}
                                        entering={SlideInRight.delay(index * 100)}
                                        className="mr-4"
                                    >
                                        <TouchableOpacity
                                            onPress={() => handlePoseClick(index)}
                                            className={`relative ${currentVideoIndex === index ? 'border-2 border-blue-500' : ''
                                                }`}
                                        >
                                            <Image
                                                source={exercise.image}
                                                className="w-20 h-20 bg-gray-100 rounded-lg"
                                                resizeMode="cover"
                                            />
                                            {currentVideoIndex === index && (
                                                <View className="absolute right-1 bottom-1 p-1 bg-blue-500 rounded-full">
                                                    <Ionicons name="play" size={12} color="white" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </VideoContext.Provider>
    );
};

export default ExerciseDetails;