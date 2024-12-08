// app/(app)/index.tsx
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HomeHeader } from '~/components/home/header';
import { MoodSelector } from '~/components/home/mood-selector';

export default function HomeScreen() {

    return (
        <SafeAreaView className="flex flex-col h-full bg-white">
            <StatusBar style="dark" />
            <HomeHeader />

            <View className="flex-1 px-4 ">
                <View className="py-4">
                    <Text className="mb-2 text-lg text-gray-600">
                        {/* Hi {state.name}, */}
                    </Text>
                    <Text className="max-w-xs text-5xl font-bold text-gray-900">
                        Find what supports your needs today!
                    </Text>
                </View>
                <View className='items-center justify-end flex-1'>
                    <Image
                        source={require("~/assets/images/yogi.png")}
                        resizeMode="contain"
                    />
                </View>
                <View className="pb-10 mt-6">
                    <Text className="pb-6 mb-4 text-lg font-bold text-gray-600">
                        How do you feel today?
                    </Text>
                    <MoodSelector />
                </View>
            </View>
        </SafeAreaView>
    );
}