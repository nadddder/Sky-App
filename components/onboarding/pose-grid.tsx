// components/onboarding/poses/pose-grid.tsx
import { memo, useCallback } from 'react';
import { View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useStore } from '~/store/root-store';

interface PoseGridProps {
    poses: {
        id: string;
        normal: ImageSourcePropType;
        hover: ImageSourcePropType;
    }[];
    selectedPoses: Set<string>;
    onTogglePose: (id: string) => void;
}

const GRID_SIZE = 3;
const IMAGE_SIZE = 85;

export const PoseGrid = memo(function PoseGrid({
    poses,
    selectedPoses,
    onTogglePose,
}: PoseGridProps) {
    const renderRow = useCallback((rowIndex: number) => {
        const rowPoses = poses.slice(rowIndex * GRID_SIZE, (rowIndex + 1) * GRID_SIZE);

        return (
            <View key={rowIndex} className="flex-row justify-center gap-6 mb-8">
                {rowPoses.map((pose, colIndex) => {
                    // Check only the passed selectedPoses prop
                    const isSelected = selectedPoses.has(pose.id);

                    return (
                        <Animated.View
                            key={pose.id}
                            entering={FadeIn.delay((rowIndex * GRID_SIZE + colIndex) * 100)}
                        >
                            <TouchableOpacity
                                onPress={() => onTogglePose(pose.id)}
                                className="items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={isSelected ? pose.normal : pose.hover}
                                    style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </View>
        );
    }, [poses, selectedPoses, onTogglePose]);

    const rows = Math.ceil(poses.length / GRID_SIZE);

    return (
        <View className="flex-1 py-4">
            {Array.from({ length: rows }).map((_, index) => renderRow(index))}
        </View>
    );
});