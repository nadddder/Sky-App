// components/onboarding/injuries/pain-types-list.tsx
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    SlideInRight,
    LinearTransition,
    SlideOutRight
} from 'react-native-reanimated';
import type { PainType } from '~/types/pain';
import { memo } from 'react';

const PAIN_TYPES: { id: PainType; label: string }[] = [
    { id: 'spasm', label: 'Spasm' },
    { id: 'soreness', label: 'Soreness' },
    { id: 'numbness', label: 'Numbness' },
    { id: 'tightness', label: 'Tightness' },
    { id: 'stiffness', label: 'Stiffness' },
    { id: 'sharp_pain', label: 'Sharp Pain' },
    { id: 'swelling', label: 'Swelling' },
    { id: 'burning', label: 'Burning' },
    { id: 'radiating_pain', label: 'Radiating Pain' },
    { id: 'clicking', label: 'Clicking' }
];

interface PainTypesListProps {
    selectedPains: Set<PainType>;
    onTogglePain: (pain: PainType) => void;
}

export const PainTypesList = memo(function PainTypesList({
    selectedPains,
    onTogglePain
}: PainTypesListProps) {
    return (
        <Animated.View
            entering={SlideInRight.springify()}
        >
            {PAIN_TYPES.map((pain, index) => (
                <Animated.View
                    key={pain.id}
                    entering={SlideInRight.delay(index * 100).springify()}
                    exiting={SlideOutRight.springify()}
                    layout={LinearTransition.springify()}
                >
                    <TouchableOpacity
                        onPress={() => onTogglePain(pain.id)}
                        className=""
                    >
                        <View className="flex-row items-center gap-2 mt-2">
                            <View className={`w-2 h-2 rounded-full ${selectedPains.has(pain.id) ? 'bg-red-500' : 'bg-white/30'
                                }`} />
                            <Text className="text-lg font-medium text-white">
                                {pain.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </Animated.View>
    );
});