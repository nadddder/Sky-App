// app/onboarding/signup.tsx
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { OnboardingScreen } from '~/components/onboarding/screen';
import { Input } from '~/components/ui/input';
import { memo, useCallback, useState } from 'react';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { Button } from '~/components/ui/button';
import { useKeyboard } from '~/hooks/use-keyboard';
import { router } from 'expo-router';
import { useFirebaseAuth } from '~/hooks/use-firebase-auth';
import { validateEmail, validatePassword, SignupFormState } from '~/lib/validation/signup';
import { performanceMonitor } from '~/services/performance';
import { useStore } from '~/store/root-store';

interface SocialButtonProps {
    icon: keyof typeof FontAwesome6.glyphMap;
    onPress: () => void;
    label: string;
    disabled?: boolean;
}

const SocialButton = memo(function SocialButton({
    icon,
    onPress,
    label,
    disabled
}: SocialButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm"
            activeOpacity={0.7}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
        >
            <FontAwesome6
                name={icon}
                size={24}
                color="#1f2937"
            />
            <Text className="sr-only">{label}</Text>
        </TouchableOpacity>
    );
});

const SignupContent = memo(function SignupContent() {
    const [formState, setFormState] = useState<SignupFormState>({
        email: '',
        password: '',
        emailError: '',
        passwordError: ''
    });

    const { keyboardVisible } = useKeyboard();
    const { signUp, signInWithGoogle, signInWithApple, isLoading, error } = useFirebaseAuth();
    const dispatch = useStore(state => state.dispatch);

    const validateForm = useCallback((): boolean => {
        const emailError = validateEmail(formState.email);
        const passwordError = validatePassword(formState.password);

        setFormState(prev => ({
            ...prev,
            emailError,
            passwordError
        }));

        return !emailError && !passwordError;
    }, [formState.email, formState.password]);

    const handleSignup = useCallback(async () => {
        if (!validateForm() || isLoading) return;

        try {
            const response = await signUp({
                email: formState.email,
                password: formState.password
            });

            if (response.error) {
                Alert.alert('Error', response.error.message);
                return;
            }

            performanceMonitor.runAfterInteractions(async () => {
                dispatch({ type: 'COMPLETE_ONBOARDING' });
                router.push('/app');
            }, 'Navigate After Signup');
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
    }, [formState, validateForm, isLoading, signUp, dispatch]);

    const handleGoogleSignIn = useCallback(async () => {
        try {
            // Implement Google Sign In logic here
            Alert.alert('Coming Soon', 'Google Sign In will be available soon!');
        } catch (error) {
            console.error('Google sign in error:', error);
            Alert.alert('Error', 'Failed to sign in with Google');
        }
    }, []);

    const handleAppleSignIn = useCallback(async () => {
        try {
            // Implement Apple Sign In logic here
            Alert.alert('Coming Soon', 'Apple Sign In will be available soon!');
        } catch (error) {
            console.error('Apple sign in error:', error);
            Alert.alert('Error', 'Failed to sign in with Apple');
        }
    }, []);

    const handleForgotPassword = useCallback(() => {
        // Implement forgot password logic here
        Alert.alert('Coming Soon', 'Password reset will be available soon!');
    }, []);

    return (
        <View className="flex-1 px-6">
            <Animated.View
                entering={FadeInDown.delay(300)}
                className="mb-8"
            >
                <Text className="mb-2 text-2xl font-bold text-center text-gray-900">
                    Let's get started!
                </Text>
                <Text className="text-base text-center text-gray-600">
                    With the info you shared, we'll shape a safe,{'\n'}
                    personalized practice for you.
                </Text>
            </Animated.View>

            <Animated.View
                entering={FadeInDown.delay(400)}
                className="flex flex-col gap-4"
            >
                <Input
                    value={formState.email}
                    onChangeText={(text) => setFormState(prev => ({
                        ...prev,
                        email: text,
                        emailError: ''
                    }))}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={formState.emailError}
                    editable={!isLoading}
                />

                <Input
                    value={formState.password}
                    onChangeText={(text) => setFormState(prev => ({
                        ...prev,
                        password: text,
                        passwordError: ''
                    }))}
                    placeholder="Password"
                    secureTextEntry
                    error={formState.passwordError}
                    editable={!isLoading}
                />

                <Button
                    onPress={handleSignup}
                    className="w-full bg-gray-900"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    <Text className="text-white">Sign Up</Text>
                </Button>

                <TouchableOpacity
                    onPress={handleForgotPassword}
                    className="items-center"
                    disabled={isLoading}
                >
                    <Text className="text-sm text-gray-600">
                        Forgot password?
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            {!keyboardVisible && (
                <Animated.View
                    entering={FadeInUp.delay(500)}
                    className="mt-8"
                >
                    <Text className="mb-6 text-sm text-center text-gray-500">
                        or sign up with
                    </Text>

                    <View className="flex flex-row justify-center gap-2">
                        <SocialButton
                            icon="google"
                            onPress={handleGoogleSignIn}
                            label="Sign up with Google"
                            disabled={isLoading}
                        />
                        {Platform.OS === 'ios' && (
                            <SocialButton
                                icon="apple"
                                onPress={handleAppleSignIn}
                                label="Sign up with Apple"
                                disabled={isLoading}
                            />
                        )}
                    </View>
                </Animated.View>
            )}

            {error && (
                <Animated.Text
                    entering={FadeInUp}
                    className="mt-4 text-sm text-center text-red-500"
                >
                    {error}
                </Animated.Text>
            )}
        </View>
    );
});

export default function SignupScreen() {
    return (
        <OnboardingScreen
            onNext={() => { }}
            nextButton={false}
            showProgress
            keyboardAvoid
            backgroundImage={require('~/assets/images/lotus.png')}
            showFooterImage
            imageOpacity={0.08}
        >
            <SignupContent />
        </OnboardingScreen>
    );
}