// components/slider/experience-slider.tsx
import { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, useWindowDimensions, ImageSourcePropType } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
const IMAGE_WIDTH = 85;
const IMAGE_HEIGHT = 85;
const SLIDER_WIDTH = 340;

type ImageMap = {
    [key: string]: {
        [key: string]: {
            [key: string]: ImageSourcePropType;
        }
    };
};

const POSE_IMAGES: ImageMap = {
    flexibility: {
        beginner: {
            normal: require('~/assets/images/poses/flexibility/beginner-1.png'),
            hover: require('~/assets/images/poses/flexibility/beginner-black.png')
        },
        intermediate: {
            normal: require('~/assets/images/poses/flexibility/intermediate-1.png'),
            hover: require('~/assets/images/poses/flexibility/intermediate-black.png')
        },
        advanced: {
            normal: require('~/assets/images/poses/flexibility/advanced-1.png'),
            hover: require('~/assets/images/poses/flexibility/advanced-black.png')
        },
        expert: {
            normal: require('~/assets/images/poses/flexibility/expert-1.png'),
            hover: require('~/assets/images/poses/flexibility/expert-black.png')
        },
    },
    strength: {
        beginner: {
            normal: require('~/assets/images/poses/strength/beginner-1.png'),
            hover: require('~/assets/images/poses/strength/beginner-black.png')
        },
        intermediate: {
            normal: require('~/assets/images/poses/strength/intermediate-1.png'),
            hover: require('~/assets/images/poses/strength/intermediate-black.png')
        },
        advanced: {
            normal: require('~/assets/images/poses/strength/advanced-1.png'),
            hover: require('~/assets/images/poses/strength/advanced-black.png')
        },
        expert: {
            normal: require('~/assets/images/poses/strength/expert-1.png'),
            hover: require('~/assets/images/poses/strength/expert-black.png')
        },
    },
};

interface ExperienceSliderProps {
    category: keyof typeof POSE_IMAGES;
    onLevelChange?: (level: number) => void;
    initialValue?: number;
}

export function ExperienceSlider({ 
    category, 
    onLevelChange,
    initialValue = 0 
}: ExperienceSliderProps) {
    const { width } = useWindowDimensions();
    const stepWidth = SLIDER_WIDTH / (LEVELS.length - 1);
    
    const translateX = useSharedValue(initialValue * stepWidth);
    const startX = useSharedValue(initialValue * stepWidth);
    const [currentIndex, setCurrentIndex] = useState(initialValue);

    useEffect(() => {
        if (initialValue !== undefined) {
            const position = initialValue * stepWidth;
            translateX.value = position;
            startX.value = position;
            setCurrentIndex(initialValue);
        }
    }, [initialValue, stepWidth]);

    const snap = useCallback((x: number) => {
        'worklet';
        const stepPosition = Math.round(x / stepWidth);
        const clampedPosition = Math.max(0, Math.min(stepPosition, LEVELS.length - 1));
        return clampedPosition * stepWidth;
    }, [stepWidth]);

    const handleIndexChange = useCallback((index: number) => {
        setCurrentIndex(index);
        onLevelChange?.(index);
    }, [onLevelChange]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            'worklet';
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            'worklet';
            const newX = startX.value + event.translationX;
            translateX.value = Math.max(0, Math.min(newX, SLIDER_WIDTH));
        })
        .onEnd(() => {
            'worklet';
            const snappedX = snap(translateX.value);
            translateX.value = withSpring(snappedX, {
                damping: 20,
                stiffness: 200,
            });
            runOnJS(handleIndexChange)(Math.round(snappedX / stepWidth));
        });

    const sliderStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const trackStyle = useAnimatedStyle(() => ({
        width: interpolate(
            translateX.value,
            [0, SLIDER_WIDTH],
            [0, SLIDER_WIDTH]
        ),
    }));

    return (
        <View className="flex flex-col items-center">
            <View className="flex flex-row items-center justify-center w-full gap-4 mb-12">
                {LEVELS.map((level, index) => (
                    <View
                        key={level}
                        style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                        className="items-center justify-start"
                    >
                        <Image
                            source={index === currentIndex ? POSE_IMAGES[category][level]["normal"] : POSE_IMAGES[category][level]["hover"]}
                            style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                            resizeMode="contain"
                        />
                    </View>
                ))}
            </View>

            <View className="flex items-center w-full">
                <View className="h-[2px] bg-gray-300" style={{ width: SLIDER_WIDTH }}>
                    <Animated.View
                        className="h-full bg-black"
                        style={trackStyle}
                    />
                </View>

                <View className="h-12" style={{ width: SLIDER_WIDTH }}>
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            className="w-6 h-6 -mt-3 bg-black rounded-full"
                            style={sliderStyle}
                        />
                    </GestureDetector>
                </View>
            </View>

            <Text className="-mt-4 font-medium text-center text-black capitalize">
                {LEVELS[currentIndex]}
            </Text>
        </View>
    );
}