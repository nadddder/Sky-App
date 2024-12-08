// components/practice/intensity-slider.tsx
import { View, Text } from 'react-native';
import { memo } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    interpolate,
    runOnJS
} from 'react-native-reanimated';

interface PracticeIntensitySliderProps {
    value: number;
    onValueChange: (value: number) => void;
}

const SLIDER_WIDTH = 340;
const HANDLE_SIZE = 24;

export const PracticeIntensitySlider = memo(function PracticeIntensitySlider({
    value,
    onValueChange
}: PracticeIntensitySliderProps) {
    const translateX = useSharedValue(value / 100 * SLIDER_WIDTH);
    const startX = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            const newX = Math.max(0, Math.min(startX.value + event.translationX, SLIDER_WIDTH));
            translateX.value = newX;
            runOnJS(onValueChange)(Math.round((newX / SLIDER_WIDTH) * 100));
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

    // Labels based on intensity
    const getIntensityLabel = (value: number) => {
        if (value < 33) return 'Gentle';
        if (value < 66) return 'Moderate';
        return 'Challenging';
    };

    return (
        <View>
            {/* Track */}
            <View className="h-[2px] bg-gray-200" style={{ width: SLIDER_WIDTH }}>
                <Animated.View
                    className="h-full bg-gray-900"
                    style={trackStyle}
                />
            </View>

            {/* Handle */}
            <GestureDetector gesture={gesture}>
                <Animated.View
                    className="absolute w-6 h-6 -mt-3 bg-gray-900 rounded-full"
                    style={sliderStyle}
                />
            </GestureDetector>

            {/* Label */}
            <Text className="mt-8 text-base font-medium text-center text-gray-900">
                {getIntensityLabel(value)}
            </Text>
        </View>
    );
});

