// app/onboarding/eager-poses.tsx
import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { OnboardingScreen } from '~/components/onboarding/screen';
import { useStore, useHydration } from '~/store/root-store';
import { performanceMonitor } from '~/services/performance';
import { LoadingScreen } from '~/components/loading-screen';
import { PoseGrid } from '~/components/onboarding/pose-grid';

const POSES = [
    {
        id: 'crow',
        normal: require('~/assets/images/poses/advanced/crow.png'),
        hover: require('~/assets/images/poses/advanced/crow-black.png'),
    },
    {
        id: 'headstand',
        normal: require('~/assets/images/poses/advanced/headstand.png'),
        hover: require('~/assets/images/poses/advanced/headstand-black.png'),
    },
    {
        id: 'handstand',
        normal: require('~/assets/images/poses/advanced/handstand.png'),
        hover: require('~/assets/images/poses/advanced/handstand-black.png'),
    },
    {
        id: 'eight_angle',
        normal: require('~/assets/images/poses/advanced/eight-angle.png'),
        hover: require('~/assets/images/poses/advanced/eight-angle-black.png'),
    },
    {
        id: 'forearm_stand',
        normal: require('~/assets/images/poses/advanced/forearm-stand.png'),
        hover: require('~/assets/images/poses/advanced/forearm-stand-black.png'),
    },
    {
        id: 'peacock',
        normal: require('~/assets/images/poses/advanced/peacock.png'),
        hover: require('~/assets/images/poses/advanced/peacock-black.png'),
    },
    {
        id: 'firefly',
        normal: require('~/assets/images/poses/advanced/firefly.png'),
        hover: require('~/assets/images/poses/advanced/firefly-black.png'),
    },
    {
        id: 'scorpion',
        normal: require('~/assets/images/poses/advanced/scorpion.png'),
        hover: require('~/assets/images/poses/advanced/scorpion-black.png'),
    },
    {
        id: 'splits',
        normal: require('~/assets/images/poses/advanced/splits.png'),
        hover: require('~/assets/images/poses/advanced/splits-black.png'),
    },
];

export default function EagerPosesScreen() {
    const hasHydrated = useHydration();
    const dispatch = useStore((state) => state.dispatch);
    const storedGoalPoses = useStore((state) => state.goalPoses);
    const [selectedPoses, setSelectedPoses] = useState<Set<string>>(new Set());

    // Initialize selected poses from stored state after hydration
    useEffect(() => {
        if (hasHydrated && storedGoalPoses) {
            try {
                // Ensure we're working with an actual Set
                const poseSet = storedGoalPoses instanceof Set 
                    ? storedGoalPoses 
                    : new Set(Array.isArray(storedGoalPoses) ? storedGoalPoses : []);
                
                setSelectedPoses(poseSet);
                console.log('Initializing selected poses:', Array.from(poseSet));
            } catch (error) {
                console.error('Error initializing poses:', error);
                setSelectedPoses(new Set());
            }
        }
    }, [hasHydrated, storedGoalPoses]);

    const handleTogglePose = useCallback((poseId: string) => {
        performanceMonitor.runAfterInteractions(async () => {
            setSelectedPoses(prev => {
                const next = new Set(prev);
                if (next.has(poseId)) {
                    next.delete(poseId);
                } else {
                    next.add(poseId);
                }
                // Update the store immediately but safely
                try {
                    dispatch({ type: 'SET_GOAL_POSES', payload: next });
                } catch (error) {
                    console.error('Error updating goal poses:', error);
                }
                return next;
            });
        }, 'Toggle Pose Selection');
    }, [dispatch]);

    const handleContinue = useCallback(() => {
        performanceMonitor.runAfterInteractions(async () => {
            dispatch({ type: 'SET_STEP', payload: 5 });
            router.push('/onboarding/signup');
        }, 'Navigate to Signup');
    }, [dispatch]);

    if (!hasHydrated) {
        return <LoadingScreen />;
    }

    return (
        <OnboardingScreen
            title="What are the poses you're eager to master?"
            subtitle="Select the poses you'd like to work towards"
            onNext={handleContinue}
            isNextDisabled={selectedPoses.size === 0}
            showProgress
            showFooterImage
            imageOpacity={0.1}
            backgroundImage={require("~/assets/images/lotus.png")}
        >
            <PoseGrid
                poses={POSES}
                selectedPoses={selectedPoses}
                onTogglePose={handleTogglePose}
            />
        </OnboardingScreen>
    );
}