import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import Body, { BodyProps, Slug } from "react-native-body-highlighter";
import Animated, { SlideInRight, SlideOutRight, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { useBodyPainModal } from "~/hooks/body-pain/use-body-pain-modal";
import { useStore } from "~/store/root-store";
import type { PainType } from '~/types/pain';

const { width, height } = Dimensions.get('window');


interface BodyPainModalProps {
    isVisible: boolean;
    onClose: () => void;
}
export function BodyPainModal({ isVisible, onClose }: BodyPainModalProps) {
    const modalStore = useBodyPainModal();
    const storeGender = useStore((state) => state.gender);
    const storeInjuries = useStore((state) => state.injuries);
    const storeDispatch = useStore((state) => state.dispatch);
    const bodyPosition = useSharedValue(0);
    useEffect(() => {
        console.log(`Stored Injuries: ${JSON.stringify(storeInjuries)}`)
    }, [storeInjuries])
    useEffect(() => {
        return () => {
            // Ensure cleanup when component unmounts
            modalStore.close();
        };
    }, []);
    const bodyStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: withSpring(bodyPosition.value, {
                damping: 15,
                stiffness: 90
            })
        }]
    }));

    if (!isVisible || !modalStore.isVisible) return null;

    return (
        <View style={styles.overlay}>
            <Animated.View
                style={styles.modalContainer}
                entering={SlideInRight.springify().mass(0.3).damping(600).stiffness(200)}
                exiting={SlideOutRight.springify().mass(0.3).damping(600).stiffness(200)}
            >
                <SafeAreaView style={styles.container} edges={['top']}>
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
                    <View style={styles.bodyContainer}>
                        <View style={styles.bodyRow}>
                            <View style={styles.bodyCol}>
                                <Animated.View style={[bodyStyle, styles.bodyWrapper]}>
                                    <Body
                                        data={[
                                            { slug: "chest", intensity: 1, side: "left" },
                                            { slug: "biceps", intensity: 2 },
                                        ]}
                                        gender="male"
                                        side="front"
                                        scale={1.7}
                                        border="#dfdfdf"
                                    />
                                </Animated.View>
                            </View>
                        </View>
                        <View style={styles.footerContainer}>
                            <Text className="text-sm text-center text-gray-400">
                                Your pain areas help us customize your practice
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    )
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
        backgroundColor: '#111827', // This is equivalent to bg-gray-900
        width: '100%',
        height: '100%',
        zIndex: 1001,
    },
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: '#111827',
    },
    bodyRow: {
        flexDirection: 'row',
        flex: 1,
    },
    bodyCol: {
        flex: 1,
    },
    bodyWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    footerContainer: {
        paddingHorizontal: 32,
        paddingVertical: 24,
        backgroundColor: '#111827',
    }
});