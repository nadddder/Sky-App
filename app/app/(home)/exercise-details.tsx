import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVideoPlayer, type PlayerError, type VideoPlayerStatus } from 'expo-video';
import Animated, {
    FadeInDown,
    SlideInRight,
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { TheVideoPlayer } from '~/components/VideoPlayer';

const EXERCISE_DATA = [
    {
        id: 0,
        title: 'Beginner Hip Opening',
        image: require('~/assets/images/poses/flexibility/beginner-1.png'),
        video: {
            uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            metadata: {
                title: 'Deep Stretch for Hips & Hamstrings - Beginner',
                artist: 'SKY Yoga',
            }
        }
    },
    {
        id: 1,
        title: 'Intermediate Flow',
        image: require('~/assets/images/poses/flexibility/intermediate-1.png'),
        video: {
            uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            metadata: {
                title: 'Deep Stretch for Hips & Hamstrings - Intermediate',
                artist: 'SKY Yoga',
            }
        }
    },
    {
        id: 2,
        title: 'Advanced Sequence',
        image: require('~/assets/images/poses/flexibility/advanced-1.png'),
        video: {
            uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            metadata: {
                title: 'Deep Stretch for Hips & Hamstrings - Advanced',
                artist: 'SKY Yoga',
            }
        }
    },
    {
        id: 3,
        title: 'Expert Challenge',
        image: require('~/assets/images/poses/flexibility/expert-1.png'),
        video: {
            uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            metadata: {
                title: 'Deep Stretch for Hips & Hamstrings - Expert',
                artist: 'SKY Yoga',
            }
        }
    },
] as const;



const VideoPlayer = () => {
    const [showOverlay, setShowOverlay] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const { currentVideoIndex, setCurrentVideoIndex } = React.useContext(VideoContext);

    const player = useVideoPlayer(EXERCISE_DATA[currentVideoIndex].video, player => {
        player.playbackRate = 1.0;
        player.staysActiveInBackground = true;
        player.play();
    });

    // Track playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState<VideoPlayerStatus>(player.status);
    const [error, setError] = useState<PlayerError | null>(null);

    useEffect(() => {
        const playToEndSubscription = player.addListener('playToEnd', () => {
            // Check if there's a next video in the sequence
            if (currentVideoIndex < EXERCISE_DATA.length - 1) {
                // Small delay before transitioning to next video for better UX
                setTimeout(() => {
                    setCurrentVideoIndex(currentVideoIndex + 1);
                }, 500);
            }
        });

        return () => {
            playToEndSubscription.remove();
        };
    }, [currentVideoIndex, player, setCurrentVideoIndex]);

    useEffect(() => {
        const playingListener = player.addListener('playingChange', ({ isPlaying }) => {
            setIsPlaying(isPlaying);
        });

        const statusListener = player.addListener('statusChange', ({ status, error }) => {
            setStatus(status);
            setError(error || null);
        });

        return () => {
            playingListener.remove();
            statusListener.remove();
        };
    }, [player]);

    // Hide overlay after playback starts
    useEffect(() => {
        if (isPlaying) {
            const timer = setTimeout(() => setShowOverlay(false), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowOverlay(true);
        }
    }, [isPlaying]);

    useEffect(() => {
        setShowOverlay(true);
        setIsPlaying(false);
    }, [currentVideoIndex]);

    const handleVideoPress = useCallback(() => {
        setShowControls(prev => !prev);
    }, []);

    if (error) {
        return (
            <View className="items-center justify-center w-full overflow-hidden bg-gray-100 aspect-video rounded-2xl">
                <Text className="text-red-500">Error loading video</Text>
                <Text className="mt-2 text-sm text-gray-500">{error.message}</Text>
            </View>
        );
    }

    return (

        <>
            <TheVideoPlayer addPlayer={player} source={EXERCISE_DATA[0].video} />
            {/* Loading State */}
            {status === 'loading' && (
                <View className="absolute inset-0 items-center justify-center bg-black/10">
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
        </>
    );
};

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

    const handlePoseClick = useCallback((index: number) => {
        setCurrentVideoIndex(index);
    }, []);

    return (
        <VideoContext.Provider value={{ currentVideoIndex, setCurrentVideoIndex }}>
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />

                {/* Header */}
                <Animated.View
                    style={headerStyle}
                    className="absolute top-0 left-0 right-0 z-10"
                >
                    <View className="flex-row items-center justify-between px-4 py-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="items-center justify-center w-10 h-10 rounded-full bg-white/80"
                        >
                            <Entypo name="chevron-left" size={24} color="#1f2937" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center justify-center w-10 h-10 rounded-full bg-white/80"
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

                        {/* Video Player */}
                        <VideoPlayer />

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
                                                <View className="absolute p-1 bg-blue-500 rounded-full bottom-1 right-1">
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