// app/onboarding/experience.tsx
import { useCallback, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { OnboardingScreen } from '~/components/onboarding/screen';
import { View } from 'react-native';
import { useStore, useHydration } from '~/store/root-store';
import { performanceMonitor } from '~/services/performance';
import { LoadingScreen } from '~/components/loading-screen';
import { YogaExperience } from '~/types/onboarding';
import { ExperienceSlider } from '~/components/onboarding/experience-slider';

const calculateOverallLevel = (flexibility: number, strength: number): string => {
    const average = (flexibility + strength) / 2;
    if (average <= 0.5) return 'beginner';
    if (average <= 1.5) return 'intermediate';
    if (average <= 2.5) return 'advanced';
    return 'expert';
};

export default function ExperienceScreen() {
    const hasHydrated = useHydration();
    const dispatch = useStore((state) => state.dispatch);
    const storedExperience = useStore((state) => state.experience);
    
    useEffect(()=> {
        console.log(`Stored Experiences: ${JSON.stringify(storedExperience)}`)
    }, [storedExperience])

    const [flexibilityLevel, setFlexibilityLevel] = useState(storedExperience?.flexibility ?? 0);
    const [strengthLevel, setStrengthLevel] = useState(storedExperience?.strength ?? 0);

    // Initialize from stored experience
    useEffect(() => {
        if (hasHydrated && storedExperience) {
            setFlexibilityLevel(storedExperience.flexibility);
            setStrengthLevel(storedExperience.strength);
        }
    }, [hasHydrated, storedExperience]);

    const handleLevelChange = useCallback((category: string, level: number) => {
        performanceMonitor.runAfterInteractions(async () => {
            if (category === 'flexibility') {
                setFlexibilityLevel(level);
            } else {
                setStrengthLevel(level);
            }
            
            // Create and dispatch updated experience object
            const experience: YogaExperience = {
                id: 'custom',
                level: calculateOverallLevel(
                    category === 'flexibility' ? level : flexibilityLevel,
                    category === 'strength' ? level : strengthLevel
                ),
                title: 'Custom Experience',
                description: 'Personalized experience level',
                flexibility: category === 'flexibility' ? level : flexibilityLevel,
                strength: category === 'strength' ? level : strengthLevel
            };
            
            dispatch({ type: 'SET_EXPERIENCE', payload: experience });
        }, 'Update Experience Level');
    }, [dispatch, flexibilityLevel, strengthLevel]);

    const handleContinue = useCallback(() => {
        performanceMonitor.runAfterInteractions(async () => {
            dispatch({ type: 'SET_STEP', payload: 4 });
            router.push('/onboarding/eager-poses');
        }, 'Navigate to Eager Poses');
    }, [dispatch]);

    if (!hasHydrated) {
        return <LoadingScreen />;
    }

    return (
        <OnboardingScreen
            title="Tell us what you can do,"
            subtitle="and we'll help you grow."
            onNext={handleContinue}
            showProgress
            showFooterImage
            imageOpacity={0.1}
            backgroundImage={require("~/assets/images/lotus.png")}
        >
            <View className='flex flex-col gap-6'>
                <ExperienceSlider 
                    category="flexibility" 
                    onLevelChange={(level) => handleLevelChange('flexibility', level)}
                    initialValue={flexibilityLevel}
                />
                <ExperienceSlider 
                    category="strength" 
                    onLevelChange={(level) => handleLevelChange('strength', level)}
                    initialValue={strengthLevel}
                />
            </View>
        </OnboardingScreen>
    );
}