// app/(auth)/verify-email.tsx
import { View, Text } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { Button } from '~/components/ui/button';
import { authService } from '~/services/auth';
import { useStore } from '~/store/root-store';
import { performanceMonitor } from '~/services/performance';
import Animated, { FadeIn } from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { auth } from '~/lib/firebase/config';

const VERIFICATION_CHECK_INTERVAL = 3000; // Check every 3 seconds

export default function VerifyEmailScreen() {
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const dispatch = useStore(state => state.dispatch);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Periodically check for email verification
    useEffect(() => {
        if (!auth.currentUser?.email) {
            router.replace('/');
            return;
        }

        const checkVerification = async () => {
            const isVerified = await authService.checkEmailVerification();
            if (isVerified) {
                performanceMonitor.runAfterInteractions(async () => {
                    dispatch({ type: 'COMPLETE_ONBOARDING' });
                    router.replace('/app');
                }, 'Navigate After Verification');
            }
        };

        const interval = setInterval(checkVerification, VERIFICATION_CHECK_INTERVAL);
        checkVerification(); // Check immediately on mount

        return () => clearInterval(interval);
    }, [dispatch]);

    const handleResendEmail = useCallback(async () => {
        if (isResending || countdown > 0) return;

        setIsResending(true);
        try {
            await authService.resendVerificationEmail();
            setCountdown(60); // Start 60 second countdown
        } catch (error) {
            console.error('Error resending verification email:', error);
        } finally {
            setIsResending(false);
        }
    }, [isResending, countdown]);

    const handleLogout = useCallback(async () => {
        try {
            await authService.signOut();
            router.replace('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }, []);

    if (!auth.currentUser?.email) return null;

    return (
        <View className="flex-1 px-6 bg-white">
            <Animated.View
                entering={FadeIn.delay(300)}
                className="items-center justify-center flex-1"
            >
                <View className="items-center mb-8">
                    <View className="items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                        <FontAwesome6
                            name="envelope"
                            size={32}
                            color="#76c7c0"
                        />
                    </View>
                    <Text className="mb-2 text-2xl font-bold text-gray-900">
                        Verify your email
                    </Text>
                    <Text className="mb-4 text-center text-gray-600">
                        We've sent a verification email to{'\n'}
                        {auth.currentUser.email}
                    </Text>
                    <Text className="text-sm text-center text-gray-500">
                        Click the link in the email to verify{'\n'}
                        your account and continue
                    </Text>
                </View>

                <View className="w-full space-y-4">
                    <Button
                        onPress={handleResendEmail}
                        disabled={isResending || countdown > 0}
                        loading={isResending}
                        variant="outline"
                        className="w-full"
                    >
                        {countdown > 0
                            ? `Resend email in ${countdown}s`
                            : 'Resend verification email'
                        }
                    </Button>

                    <Button
                        onPress={handleLogout}
                        variant="ghost"
                        className="w-full"
                    >
                        Sign out
                    </Button>
                </View>
            </Animated.View>
        </View>
    );
}