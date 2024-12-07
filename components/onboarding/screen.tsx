// components/onboarding/screen.tsx
import { memo } from 'react';
import {
    View,
    ScrollView,
    Text,
    KeyboardAvoidingView,
    Platform,
    ImageSourcePropType,
    KeyboardAvoidingViewProps,
    ViewProps
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OnboardingFooter } from './onboarding-footer';
import { OnboardingHeader } from './onboarding-header';


interface OnboardingScreenProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    onNext: () => void;
    isNextDisabled?: boolean;
    showBackButton?: boolean;
    nextLabel?: string;
    showProgress?: boolean;
    backgroundImage?: ImageSourcePropType;
    showFooterImage?: boolean;
    keyboardAvoid?: boolean;
    imageOpacity?: number;
    nextButton?: boolean;
}

const ScreenContent = memo(function ScreenContent({
    children,
    title,
    subtitle,
    onNext,
    isNextDisabled,
    nextLabel,
    showProgress,
    showFooterImage,
    backgroundImage,
    imageOpacity,
    nextButton
}: Omit<OnboardingScreenProps, 'keyboardAvoid' | 'showBackButton'>) {
    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
            >
                <View className="flex-1 px-6">
                    {title && (
                        <Text className="mb-4 text-2xl font-bold text-center text-gray-900">
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text className="mb-6 text-base text-center text-gray-600">
                            {subtitle}
                        </Text>
                    )}
                    {children}
                </View>
            </ScrollView>
            <OnboardingFooter
                onNext={onNext}
                disabled={isNextDisabled}
                nextLabel={nextLabel}
                showProgress={showProgress}
                showImage={showFooterImage}
                backgroundImage={backgroundImage}
                imageOpacity={imageOpacity}
                nextButton={nextButton}
            />
        </View>
    );
});

export const OnboardingScreen = memo(function OnboardingScreen(props: OnboardingScreenProps) {
    const {
        keyboardAvoid = false,
        showBackButton = true,
        children,
        ...contentProps
    } = props;

    // Properly type the wrapper component
    const Wrapper: React.ComponentType<ViewProps | KeyboardAvoidingViewProps> =
        keyboardAvoid ? KeyboardAvoidingView : View;

    // Define wrapper props based on the component type
    const wrapperProps: ViewProps | KeyboardAvoidingViewProps = keyboardAvoid ? {
        behavior: Platform.OS === 'ios' ? 'padding' : 'height' as const,
        keyboardVerticalOffset: Platform.OS === 'ios' ? 0 : 0,
        className: "flex-1 bg-background"
    } : {
        className: "flex-1 bg-background"
    };

    return (
        <Wrapper {...wrapperProps}>
            <StatusBar style="dark" />
            <OnboardingHeader showBackButton={showBackButton} />
            <ScreenContent {...contentProps}>
                {children}
            </ScreenContent>
        </Wrapper>
    );
});