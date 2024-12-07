// src/components/focus/focus-option.tsx
import { memo, useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { cn } from '~/lib/utils';
import { performanceMonitor } from '~/services/performance';

interface FocusOptionProps {
    title: string;
    selected: boolean;
    onSelect: () => void;
    disabled?: boolean;
}

const FocusOptionContent = memo(function FocusOptionContent({
    title,
    selected
}: Pick<FocusOptionProps, 'title' | 'selected'>) {
    console.log(!!selected)
    return (
        <>
            <FontAwesome6
                name={selected ? 'circle-check' : 'circle'}
                size={24}
                color={selected ? '#76c7c0' : '#9ca3af'}
                className="mr-3"
            />
            <Text className={cn(
                'flex-1 text-base',
                selected ? 'text-primary font-medium' : 'text-gray-700'
            )}>
                {title}
            </Text>
        </>
    );
});

export const FocusOption = memo(function FocusOption({
    title,
    selected,
    onSelect,
    disabled
}: FocusOptionProps) {
    const handleSelect = useCallback(async () => {
        if (disabled) return;

        await performanceMonitor.runAfterInteractions(
            () => onSelect(),
            'Focus Option Select'
        );
    }, [disabled, onSelect]);

    return (
        <TouchableOpacity
            onPress={handleSelect}
            className={cn(
                'flex-row items-center px-4 py-3 mb-3 rounded-xl',
                'bg-white/90 border-2',
                selected ? 'border-primary' : 'border-transparent',
                disabled && 'opacity-50'
            )}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <FocusOptionContent
                title={title}
                selected={selected}
            />
        </TouchableOpacity>
    );
});