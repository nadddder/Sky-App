// components/home/header.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { memo } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export const HomeHeader = memo(function HomeHeader() {
    const navigation = useNavigation();

    return (
        <View className="flex-row items-center justify-between px-4 py-2">
            <View className="flex-row items-center">
                <Text className="text-xl font-medium text-gray-900">
                    SKY
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                className="p-2"
                activeOpacity={0.7}
            >
                <FontAwesome6 name="bars" size={24} color="#1f2937" />
            </TouchableOpacity>
        </View>
    );
});