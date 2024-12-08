// components/injuries/view-toggle-buttons.tsx
import {  TouchableOpacity, Text } from 'react-native';
import { cn } from '~/lib/utils';
import Animated, { FadeIn } from 'react-native-reanimated';
import { memo } from 'react';
import type { BodyProps } from 'react-native-body-highlighter';

type BodySide = NonNullable<BodyProps['side']>;

interface ViewToggleButtonsProps {
    currentView: BodySide;
    onViewChange: (view: BodySide) => void;
}

interface ToggleOption {
    id: BodySide;
    label: string;
}

export const ViewToggleButtons = memo(function ViewToggleButtons({
    currentView,
    onViewChange
}: ViewToggleButtonsProps) {
    const views: ToggleOption[] = [
        { id: 'front', label: 'Front' },
        { id: 'back', label: 'Back' }
    ];

    return (
        <Animated.View
            entering={FadeIn.delay(300)}
            className="flex-row justify-center mb-6 space-x-4"
        >
            {views.map(({ id, label }) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onViewChange(id)}
                    className={cn(
                        "px-6 py-2 rounded-full",
                        currentView === id
                            ? "bg-gray-200"
                            : "bg-transparent"
                    )}
                >
                    <Text className={cn(
                        "text-base capitalize",
                        currentView === id
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                    )}>
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </Animated.View>
    );
});