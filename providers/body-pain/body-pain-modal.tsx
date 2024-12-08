// components/body-pain-modal.tsx
import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    FadeIn,
    SlideInRight,
    SlideOutRight,
} from 'react-native-reanimated';
import BodyHighlighter, { BodyProps, ExtendedBodyPart, Slug } from 'react-native-body-highlighter';
import { Button } from '~/components/ui/button';
import { bodyPartNames } from '~/data/body';
import type { PainType } from '~/types/pain';
import { StatusBar } from 'expo-status-bar';
import { useBodyPainModal } from '~/hooks/body-pain/use-body-pain-modal';
import { useStore } from '~/store/root-store';
import { performanceMonitor } from '~/services/performance';
import { ViewToggleButtons } from '~/components/onboarding/view-toggle-buttons';
import { PainTypesList } from '~/components/onboarding/pain-types-list';

const COLORS = [
    '#9EA0A3',  // index 0 - Default color (not used)
    '#A12729',  // index 1 - Selected color (red)
    '#9F6E27'   // index 2 - Saved color (orange)
];

interface BodyPainModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function BodyPainModal({ isVisible, onClose }: BodyPainModalProps) {
    const modalStore = useBodyPainModal();

    const storeGender = useStore((state) => state.gender);
    const storeInjuries = useStore((state) => state.injuries);
    const storeDispatch = useStore((state) => state.dispatch);

    useEffect(() => {
        console.log(`Stored Injuries: ${JSON.stringify(storeInjuries)}`)
    }, [storeInjuries, storeDispatch])

    useEffect(() => {
        return () => {
            // Ensure cleanup when component unmounts
            modalStore.close();
        };
    }, []);

    const { nextRoute } = useBodyPainModal();
    const [currentView, setCurrentView] = useState<NonNullable<BodyProps['side']>>('front');
    const [selectedBodyPart, setSelectedBodyPart] = useState<{
        id: Slug;
        name: string;
        side?: 'left' | 'right';
    } | null>(null);

    const [selectedPains, setSelectedPains] = useState<Set<PainType>>(new Set());

    const bodyPosition = useSharedValue(0);

    const formatBodyPartId = useCallback((slug: Slug, side?: 'left' | 'right') =>
        side ? `${slug}-${side}` as Slug : slug,
        []);

    const parseBodyPartId = useCallback((id: Slug) => {
        if (!id) {
            console.warn('Invalid body part ID received:', id);
            return { slug: undefined as unknown as Slug, side: undefined };
        }

        try {
            const idString = id.toString();
            const parts = idString.split('-');
            const slug = parts[0] as Slug;
            const side = parts[1] as 'left' | 'right' | undefined;

            if (!slug) {
                console.warn('Invalid slug parsed from ID:', id);
                return { slug: undefined as unknown as Slug, side: undefined };
            }

            return { slug, side };
        } catch (error) {
            console.error('Error parsing body part ID:', error);
            return { slug: undefined as unknown as Slug, side: undefined };
        }
    }, []);

    const bodyStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: withSpring(bodyPosition.value, {
                damping: 15,
                stiffness: 90
            })
        }]
    }));

    // Use store values with context fallback
    const currentGender = storeGender
    const currentInjuries = storeInjuries


    // Prepare the data for BodyHighlighter
    const bodyData = useMemo(() => {
        const data: ExtendedBodyPart[] = [];

        Array.from(currentInjuries.keys()).forEach(id => {
            const { slug, side } = parseBodyPartId(id);
            if (slug) {
                data.push({
                    slug,
                    side,
                    intensity: 2  // Using index 2 for saved injuries (orange)
                });
            }
        });

        if (selectedBodyPart && !currentInjuries.has(selectedBodyPart.id)) {
            const { slug, side } = parseBodyPartId(selectedBodyPart.id);
            if (slug) {
                data.push({
                    slug,
                    side,
                    intensity: 1  // Using index 1 for selected (red)
                });
            }
        }

        return data;
    }, [currentInjuries, selectedBodyPart, parseBodyPartId]);

    const handleAreaSelect = useCallback((bodyPart: ExtendedBodyPart, side?: 'left' | 'right') => {
        if (!bodyPart.slug) return;

        const fullId = formatBodyPartId(bodyPart.slug, side);

        if (currentInjuries.has(fullId)) {
            setSelectedPains(currentInjuries.get(fullId) || new Set());
        } else {
            setSelectedPains(new Set());
        }

        setSelectedBodyPart({
            id: fullId,
            name: `${side ? `${side.charAt(0).toUpperCase() + side.slice(1)} ` : ''}${bodyPartNames[bodyPart.slug] || bodyPart.slug}`,
            side
        });
        bodyPosition.value = -50;
    }, [currentInjuries, bodyPosition, formatBodyPartId]);

    const handlePainSelect = useCallback((pain: PainType) => {
        setSelectedPains(prev => {
            const next = new Set(prev);
            if (next.has(pain)) {
                next.delete(pain);
            } else {
                next.add(pain);
            }
            return next;
        });
    }, []);

    const handleAddInjury = useCallback(() => {
        if (!selectedBodyPart) return;

        performanceMonitor.runAfterInteractions(async () => {
            if (selectedPains.size === 0) {
                storeDispatch({
                    type: 'REMOVE_INJURY',
                    payload: selectedBodyPart.id
                });
            } else {
                storeDispatch({
                    type: 'ADD_INJURY_PAIN',
                    payload: {
                        bodyPart: selectedBodyPart.id,
                        pains: selectedPains
                    }
                });
            }
        }, 'Update Injury');

        setSelectedPains(new Set());
    }, [selectedBodyPart, selectedPains, storeDispatch]);

    const handleContinue = useCallback(() => {
        if (nextRoute) {
            // router.push(nextRoute);
        }
        onClose();
    }, [nextRoute, onClose]);

    const handleClose = useCallback(() => {
        modalStore.setAnimating(true);
        // Ensure animation completes before closing
        setTimeout(() => {
            onClose();
            modalStore.setAnimating(false);
        }, 300);
    }, [onClose]);

    const getActionButtonText = useCallback(() => {
        if (!selectedBodyPart) return '';

        if (selectedPains.size === 0 && currentInjuries.has(selectedBodyPart.id)) {
            return 'Remove Pain Area';
        }
        return currentInjuries.has(selectedBodyPart.id) ? 'Update Pain Area' : 'Add Pain Area';
    }, [selectedBodyPart, selectedPains.size, currentInjuries]);

    if (!isVisible || !modalStore.isVisible) return null;

    return (
        <View style={styles.overlay}>
            <Animated.View
                style={styles.modalContainer}
                entering={SlideInRight.springify().mass(0.3).damping(600).stiffness(200)}
                exiting={SlideOutRight.springify().mass(0.3).damping(600).stiffness(200)}
            >
                <SafeAreaView className='flex flex-col h-full px-4 bg-[#111827]' edges={['top', 'bottom']}>
                    <StatusBar style="light" />
                    <View className="flex-row items-center justify-between px-4 py-2">
                        <View className="w-20" />
                        <Text className="text-lg font-medium text-white">Body Map</Text>
                        <Button
                            variant="ghost"
                            onPress={onClose}
                            className="px-4 py-2"
                        >
                            <Text className="text-base text-gray-400">Close</Text>
                        </Button>
                    </View>

                    <Text className="px-4 my-6 text-xl text-center text-white">
                        Touch the areas of your body where you feel discomfort
                    </Text>

                    <ViewToggleButtons
                        currentView={currentView}
                        onViewChange={setCurrentView}
                    />

                    <View className="flex flex-col w-full h-full gap-8" >
                        <View className="flex flex-row items-center justify-center w-full">
                            <View className="flex flex-col " >
                                <Animated.View
                                    style={bodyStyle}
                                    className="flex items-center justify-center"
                                >
                                    <BodyHighlighter
                                        side={currentView}
                                        data={bodyData}
                                        gender={currentGender === "female" ? "female" : "male"}
                                        scale={1}
                                        colors={COLORS}
                                        onBodyPartPress={handleAreaSelect}
                                    />
                                    {selectedBodyPart && (
                                        <Animated.Text
                                            entering={FadeIn}
                                            className="mt-4 text-lg font-medium text-center text-white"
                                        >
                                            {selectedBodyPart.name}
                                        </Animated.Text>
                                    )}
                                </Animated.View>
                            </View>

                            {selectedBodyPart && (
                                <PainTypesList
                                    selectedPains={selectedPains}
                                    onTogglePain={handlePainSelect}
                                />
                            )}
                        </View>

                        <View className="flex-col gap-4 px-8 py-6" >
                            <View className="flex-row gap-4">
                                {selectedBodyPart && (
                                    <Button
                                    variant="outline"
                                        onPress={handleAddInjury}
                                        className="flex-1 bg-white/10"
                                    >
                                        <Text className="text-white">
                                            {getActionButtonText()}
                                        </Text>
                                    </Button>
                                )}
                                {nextRoute && (
                                    <Button
                                        onPress={handleContinue}
                                        className="flex-1 bg-white"
                                        disabled={currentInjuries.size === 0}
                                    >
                                        <Text className="text-gray-900">That's it for now</Text>
                                    </Button>
                                )}
                            </View>
                            <Text className="text-sm text-center text-gray-400">
                                Your pain areas help us customize your practice
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#111827',
        width: '100%',
        height: '100%',
        zIndex: 1001,
    }
});