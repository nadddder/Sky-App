// components/onboarding/footer.tsx
import { View, ImageBackground, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingProgress } from './onboarding-progress';
import { ImagePosition } from '~/types/onboarding';
import { useStore } from '~/store/root-store';
import { NextButton } from './next-button';

interface OnboardingFooterProps {
    onNext: () => void;
    disabled?: boolean;
    showProgress?: boolean;
    nextLabel?: string;
    nextButton?: boolean;
    backgroundImage?: ImageSourcePropType;
    imageOpacity?: number;
    showImage?: boolean;
    imagePosition?: ImagePosition;
}

export function OnboardingFooter({
    onNext,
    disabled = false,
    showImage = false,
    showProgress = true,
    nextButton = true,
    nextLabel,
    backgroundImage,
    imageOpacity = 0.1,
    imagePosition = "center"
}: OnboardingFooterProps) {
    const currentStep = useStore((state) => state.currentStep);
    const insets = useSafeAreaInsets();

    const content = (
        <View
            className="flex-row-reverse items-center justify-between px-6"
        >
            <View className='w-1/3 h-16'>
                {nextButton && <NextButton
                    onNext={onNext}
                    disabled={disabled}
                    label={nextLabel}
                    variant='secondary'
                />}
            </View>
            {showProgress && (
                <OnboardingProgress
                    currentStep={currentStep}
                    totalSteps={5}
                />
            )}
        </View>
    );

    return (
        <View
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
            {showImage && backgroundImage ? (
                <View className="h-48">
                    <ImageBackground
                        source={backgroundImage}
                        className="w-full h-full"
                        imageClassName={`opacity-${Math.floor(imageOpacity * 100)}`}
                        resizeMode="contain"
                    >
                        {content}
                    </ImageBackground>
                </View>
            ) : (
                <View>
                    {content}
                </View>
            )}
        </View>
    );
}