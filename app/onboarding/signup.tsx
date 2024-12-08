// app/onboarding/signup.tsx
import { View, Text, TouchableOpacity, Platform } from 'react-native';
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

interface SocialButtonProps {
    icon: keyof typeof FontAwesome6.glyphMap;
    onPress: () => void;
    label: string;
}

const SocialButton = memo(function SocialButton({
    icon,
    onPress,
    label
}: SocialButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm"
            activeOpacity={0.7}
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
    const [formState, setFormState] = useState({
        email: '',
        password: '',
        emailError: '',
        passwordError: ''
    });

    const { keyboardVisible } = useKeyboard();

    const validateEmail = useCallback((email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, []);

    const handleSignup = useCallback(() => {
        let isValid = true;
        const newState = { ...formState };

        if (!validateEmail(formState.email)) {
            newState.emailError = 'Please enter a valid email';
            isValid = false;
        } else {
            newState.emailError = '';
        }

        if (formState.password.length < 8) {
            newState.passwordError = 'Password must be at least 8 characters';
            isValid = false;
        } else {
            newState.passwordError = '';
        }

        setFormState(newState);

        if (isValid) {
            // Handle signup logic here
            console.log('Signup with:', formState.email);
            router.push('/app');
        }
    }, [formState]);

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
                    onChangeText={(text) => setFormState(prev => ({ ...prev, email: text }))}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={formState.emailError}
                />

                <Input
                    value={formState.password}
                    onChangeText={(text) => setFormState(prev => ({ ...prev, password: text }))}
                    placeholder="Password"
                    secureTextEntry
                    error={formState.passwordError}
                />

                <Button
                    onPress={handleSignup}
                    className="w-full bg-gray-900"
                >
                    <Text className="text-white">Sign Up</Text>
                </Button>

                <TouchableOpacity className="items-center">
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
                            onPress={() => { }}
                            label="Sign up with Google"
                        />
                        <SocialButton
                            icon="facebook"
                            onPress={() => { }}
                            label="Sign up with Facebook"
                        />
                        <SocialButton
                            icon="apple"
                            onPress={() => { }}
                            label="Sign up with Apple"
                        />
                    </View>
                </Animated.View>
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