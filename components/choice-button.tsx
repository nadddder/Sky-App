// src/components/choice-button.tsx
import { memo, useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { cn } from '~/lib/utils';
import { performanceMonitor } from '~/services/performance';

interface ChoiceButtonProps {
    title: string;
    selected: boolean;
    onSelect: () => void;
    subtitle?: string;
    disabled?: boolean;
}

const ChoiceButtonContent = memo(function ChoiceButtonContent({
    title,
    subtitle,
    selected
}: Pick<ChoiceButtonProps, 'title' | 'subtitle' | 'selected'>) {
    return (
        <>
            <FontAwesome6
                name={selected ? 'circle-dot' : 'circle'}
                size={24}
                color={selected ? '#76c7c0' : '#9ca3af'}
                className="mr-3"
            />
            <Text className={cn(
                'flex-1',
                selected ? 'text-primary font-medium' : 'text-gray-700'
            )}>
                <Text className="text-lg">{title}</Text>
                {subtitle && (
                    <Text className="text-sm text-gray-500">{`\n${subtitle}`}</Text>
                )}
            </Text>
        </>
    );
});

export const ChoiceButton = memo(function ChoiceButton({
    title,
    selected,
    onSelect,
    subtitle,
    disabled
}: ChoiceButtonProps) {
    const handlePress = useCallback(async () => {
        if (disabled) return;

        await performanceMonitor.runAfterInteractions(
            () => onSelect(),
            'Choice Button Select'
        );
    }, [disabled, onSelect]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={cn(
                'w-full flex-row items-center p-4 rounded-xl mb-3',
                'bg-white border-2',
                selected ? 'border-primary' : 'border-transparent',
                disabled && 'opacity-50'
            )}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <ChoiceButtonContent
                title={title}
                subtitle={subtitle}
                selected={selected}
            />
        </TouchableOpacity>
    );
});