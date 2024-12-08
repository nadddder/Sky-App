// components/practice/duration-slider.tsx
import { View, Text } from 'react-native';
import { memo } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    runOnJS
} from 'react-native-reanimated';

interface PracticeDurationSliderProps {
    value: number;
    onValueChange: (value: number) => void;
}

const DURATION_OPTIONS = [15, 30, 45, 60];
const SLIDER_WIDTH = 340;

export const PracticeDurationSlider = memo(function PracticeDurationSlider({
    value,
    onValueChange
}: PracticeDurationSliderProps) {
    const stepWidth = SLIDER_WIDTH / (DURATION_OPTIONS.length - 1);
    const translateX = useSharedValue(
        DURATION_OPTIONS.indexOf(value) * stepWidth
    );
    const startX = useSharedValue(0);

    const snap = (x: number) => {
        'worklet';
        const stepPosition = Math.round(x / stepWidth);
        const clampedPosition = Math.max(0, Math.min(stepPosition, DURATION_OPTIONS.length - 1));
        return clampedPosition * stepWidth;
    };

    const gesture = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            const newX = Math.max(0, Math.min(startX.value + event.translationX, SLIDER_WIDTH));
            translateX.value = newX;
        })
        .onEnd(() => {
            const snappedX = snap(translateX.value);
            translateX.value = withSpring(snappedX, {
                damping: 20,
                stiffness: 200,
            });
            runOnJS(onValueChange)(DURATION_OPTIONS[Math.round(snappedX / stepWidth)]);
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
        <View className=''>
            {/* Duration Options */}
            <View className="flex-row justify-between mb-4" style={{ width: SLIDER_WIDTH }}>
                {DURATION_OPTIONS.map((duration) => (
                    <Text
                        key={duration}
                        className={`text-base ${value === duration ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
                    >
                        {duration} min
                    </Text>
                ))}
            </View>

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
                    className="absolute w-6 h-6 bg-gray-900 rounded-full mt-7"
                    style={sliderStyle}
                />
            </GestureDetector>
        </View>
    );
});