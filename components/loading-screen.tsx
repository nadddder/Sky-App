// components/ui/loading-screen.tsx
import { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { cn } from '~/lib/utils';

interface LoadingScreenProps {
    /**
     * Optional className for additional styling
     */
    className?: string;
    /**
     * Background color variant
     * @default "default"
     */
    variant?: 'default' | 'dark' | 'light';
    /**
     * Loading indicator size
     * @default "large"
     */
    size?: 'small' | 'large';
    /**
     * Whether to include safe area insets
     * @default true
     */
    useSafeArea?: boolean;
}

const getBackgroundColor = (variant: LoadingScreenProps['variant']) => {
    switch (variant) {
        case 'dark':
            return 'bg-gray-900';
        case 'light':
            return 'bg-gray-50';
        default:
            return 'bg-background';
    }
};

const getIndicatorColor = (variant: LoadingScreenProps['variant']) => {
    switch (variant) {
        case 'dark':
            return 'white';
        case 'light':
            return 'black';
        default:
            return '#1f2937'; // gray-900
    }
};

const LoadingIndicator = memo(function LoadingIndicator({
    variant = 'default',
    size = 'large'
}: Pick<LoadingScreenProps, 'variant' | 'size'>) {
    return (
        <Animated.View
            entering={FadeIn.delay(150)}
            className="justify-center items-center"
        >
            <ActivityIndicator
                size={size}
                color={getIndicatorColor(variant)}
            />
        </Animated.View>
    );
});

export const LoadingScreen = memo(function LoadingScreen({
    className,
    variant = 'default',
    size = 'large',
    useSafeArea = true
}: LoadingScreenProps) {
    const Container = useSafeArea ? SafeAreaView : View;
    const statusBarStyle = variant === 'dark' ? 'light' : 'dark';

    return (
        <Container
            className={cn(
                'flex-1 justify-center items-center',
                getBackgroundColor(variant),
                className
            )}
        >
            <StatusBar style={statusBarStyle} />
            <LoadingIndicator variant={variant} size={size} />
        </Container>
    );
});