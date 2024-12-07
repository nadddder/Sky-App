// src/components/ui/input.tsx
import { forwardRef, memo, useCallback } from 'react';
import { View, TextInput, Text, TextInputProps, Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { useKeyboard } from '~/hooks/use-keyboard';
import { useDebounce } from '~/lib/performance';

interface InputProps extends Omit<TextInputProps, 'placeholderTextColor'> {
    error?: string;
    className?: string;
    placeholderClassName?: string;
    label?: string;
    helper?: string;
    onChangeText?: (text: string) => void;
    debounce?: number;
}

const InputContent = memo(function InputContent({
    error,
    helper,
    label
}: Pick<InputProps, 'error' | 'helper' | 'label'>) {
    return (
        <>
            {label && (
                <Text className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                </Text>
            )}
            {(error || helper) && (
                <Text
                    className={cn(
                        "mt-1 text-sm",
                        error ? "text-red-500" : "text-gray-500"
                    )}
                >
                    {error || helper}
                </Text>
            )}
        </>
    );
});

export const Input = memo(forwardRef<TextInput, InputProps>(function Input(
    {
        value,
        onChangeText,
        placeholder,
        className,
        placeholderClassName,
        error,
        helper,
        label,
        debounce = 0,
        ...props
    }: InputProps,
    ref
) {
    const { dismiss } = useKeyboard();

    const debouncedOnChangeText = useDebounce(
        useCallback((text: string) => {
            onChangeText?.(text);
        }, [onChangeText]),
        debounce
    );

    const handleChangeText = useCallback((text: string) => {
        if (debounce > 0) {
            debouncedOnChangeText(text);
        } else {
            onChangeText?.(text);
        }
    }, [debounce, debouncedOnChangeText, onChangeText]);

    const handlePressContainer = useCallback(() => {
        (ref as React.RefObject<TextInput>)?.current?.focus();
    }, [ref]);

    return (
        <Pressable onPress={handlePressContainer}>
            <View className="w-full">
                <InputContent
                    error={error}
                    helper={helper}
                    label={label}
                />
                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    className={cn(
                        'w-full bg-white/90 rounded-xl px-4 py-3',
                        'border-2 border-transparent focus:border-primary',
                        error && 'border-red-500',
                        className
                    )}
                    placeholderTextColor={cn('#9ca3af', placeholderClassName)}
                    onBlur={dismiss}
                    {...props}
                />
            </View>
        </Pressable>
    );
}));