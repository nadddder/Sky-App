// components/screens/profile-screen.tsx
import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout
} from 'react-native-reanimated';
import { router } from 'expo-router';

interface MenuItemProps {
    icon: keyof typeof FontAwesome6.glyphMap;
    label: string;
    onPress: () => void;
    delay?: number;
    color?: string;
}

const MenuItem = memo(function MenuItem({
    icon,
    label,
    onPress,
    delay = 0,
    color = "#1f2937"
}: MenuItemProps) {
    return (
        <Animated.View
            entering={FadeInDown.delay(delay).springify()}
            layout={Layout.springify()}
        >
            <TouchableOpacity
                onPress={onPress}
                className="flex-row items-center px-4 py-3 mb-1"
                activeOpacity={0.7}
            >
                <View className="w-8">
                    <FontAwesome6 name={icon} size={20} color={color} />
                </View>
                <Text className="flex-1 text-base" style={{ color }}>
                    {label}
                </Text>
                <FontAwesome6 name="chevron-right" size={16} color="#9ca3af" />
            </TouchableOpacity>
        </Animated.View>
    );
});

const SectionTitle = memo(function SectionTitle({
    title,
    delay = 0
}: {
    title: string;
    delay?: number;
}) {
    return (
        <Animated.Text
            entering={FadeInDown.delay(delay).springify()}
            className="px-4 py-2 text-sm font-medium text-gray-400 uppercase"
        >
            {title}
        </Animated.Text>
    );
});

export const ProfileScreen = memo(function ProfileScreen() {

    const handleLogout = useCallback(() => {

    }, []);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="dark" />

            <View className="flex-row items-center justify-between px-4 py-4">
                <Text className="text-xl font-semibold text-gray-900">
                    SKY
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    entering={FadeInUp.delay(100).springify()}
                    className="px-4 py-2 mb-4"
                >
                    <Text className="text-sm font-medium text-gray-500">
                        Personalization
                    </Text>
                </Animated.View>

                <MenuItem
                    icon="user"
                    label="Account Info"
                    onPress={() => { }}
                    delay={200}
                />
                <MenuItem
                    icon="circle-info"
                    label="Personal Info"
                    onPress={() => { }}
                    delay={250}
                />
                <MenuItem
                    icon="person-falling"
                    label="Injuries"
                    onPress={() => { }}
                    delay={300}
                />
                <MenuItem
                    icon="bullseye"
                    label="Goals"
                    onPress={() => { }}
                    delay={350}
                />

                <SectionTitle title="Account" delay={400} />

                <MenuItem
                    icon="crown"
                    label="Subscription"
                    onPress={() => { }}
                    delay={450}
                />
                <MenuItem
                    icon="bell"
                    label="Practice Reminder"
                    onPress={() => { }}
                    delay={500}
                />
                <MenuItem
                    icon="heart"
                    label="My Favorites"
                    onPress={() => { }}
                    delay={550}
                />
                <MenuItem
                    icon="globe"
                    label="Language"
                    onPress={() => { }}
                    delay={600}
                />

                <SectionTitle title="General" delay={650} />

                <MenuItem
                    icon="circle-info"
                    label="About Sky yoga"
                    onPress={() => { }}
                    delay={700}
                />
                <MenuItem
                    icon="file-lines"
                    label="Terms of Service"
                    onPress={() => { }}
                    delay={750}
                />
                <MenuItem
                    icon="lock"
                    label="Privacy Policy"
                    onPress={() => { }}
                    delay={800}
                />
                <MenuItem
                    icon="star"
                    label="Rate the App"
                    onPress={() => { }}
                    delay={850}
                />

                <MenuItem
                    icon="right-from-bracket"
                    label="Logout"
                    onPress={handleLogout}
                    delay={900}
                    color="#ef4444"
                />

                <Animated.Text
                    entering={FadeInUp.delay(950).springify()}
                    className="py-8 text-sm text-center text-gray-400"
                >
                    Version 1.0.0
                </Animated.Text>
            </ScrollView>
        </SafeAreaView>
    );
});