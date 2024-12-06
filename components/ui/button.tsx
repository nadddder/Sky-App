// src/components/ui/button.tsx
import { memo, forwardRef } from 'react';
import type { ComponentRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { performanceMonitor } from '~/services/performance';

const buttonVariants = cva(
    'flex-row items-center justify-center rounded-xl active:opacity-90',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                outline: 'border-2 border-gray-300 bg-transparent',
                ghost: 'bg-transparent',
                secondary: 'bg-gray-200',
                destructive: 'bg-red-500',
            },
            size: {
                default: 'px-4 py-3',
                sm: 'px-3 py-2',
                lg: 'px-6 py-4',
            },
            isDisabled: {
                true: 'opacity-50',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            isDisabled: false,
        },
    }
);

const buttonTextVariants = cva('text-center font-semibold', {
    variants: {
        variant: {
            default: 'text-white',
            outline: 'text-gray-900',
            ghost: 'text-gray-900',
            secondary: 'text-gray-900',
            destructive: 'text-white',
        },
        size: {
            default: 'text-base',
            sm: 'text-sm',
            lg: 'text-lg',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps extends Omit<TouchableOpacityProps, 'disabled'>,
    Omit<ButtonVariants, 'isDisabled'> {
    children: React.ReactNode;
    className?: string;
    textClassName?: string;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onPress?: () => void | Promise<void>;
    disabled?: boolean;
}

const ButtonContent = memo(function ButtonContent({
    children,
    textClassName,
    variant,
    size,
    leftIcon,
    rightIcon,
    loading
}: Pick<ButtonProps, 'children' | 'textClassName' | 'variant' | 'size' | 'leftIcon' | 'rightIcon' | 'loading'>) {
    if (loading) {
        return (
            <ActivityIndicator
                color={variant === 'outline' ? '#000' : '#fff'}
                size="small"
            />
        );
    }

    return (
        <View className="flex-row items-center justify-center">
            {leftIcon && <View className="mr-2">{leftIcon}</View>}

            {typeof children === 'string' ? (
                <Text
                    className={cn(
                        buttonTextVariants({ variant, size }),
                        textClassName
                    )}
                >
                    {children}
                </Text>
            ) : (
                children
            )}

            {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
    );
});

export const Button = memo(forwardRef<ComponentRef<typeof TouchableOpacity>, ButtonProps>(
    function Button({
        children,
        className,
        textClassName,
        variant,
        size,
        disabled = false,
        loading = false,
        leftIcon,
        rightIcon,
        onPress,
        ...props
    }, ref) {
        const handlePress = async () => {
            if (loading || disabled || !onPress) return;

            await performanceMonitor.runAfterInteractions(
                async () => {
                    await onPress();
                },
                'Button Press'
            );
        };

        return (
            <TouchableOpacity
                ref={ref}
                onPress={handlePress}
                className={cn(
                    buttonVariants({ variant, size, isDisabled: disabled || loading }),
                    className
                )}
                disabled={disabled || loading}
                activeOpacity={0.7}
                {...props}
            >
                <ButtonContent
                    children={children}
                    textClassName={textClassName}
                    variant={variant}
                    size={size}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    loading={loading}
                />
            </TouchableOpacity>
        );
    }
));