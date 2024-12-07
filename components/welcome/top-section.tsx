import { View, Text } from "react-native";

export default function WelcomeTopSection() {
    return (
        <View className="items-center justify-center flex-1 px-6 pt-12">
            <View className='flex items-center justify-center'>
                <Text className='text-xl font-semibold text-gray-500'>Welcome to</Text>
                <Text className='font-bold text-gray-800 text-7xl'>SKY</Text>
            </View>

            <View className='flex'>
                <Text className="mt-8 text-2xl font-bold text-center text-gray-900 capitalize">
                    Your personalized
                </Text>
                <Text className="text-2xl font-bold text-center text-gray-900 capitalize ">
                    yoga journey is just
                </Text>
                <Text className="text-2xl font-bold text-center text-gray-900 capitalize ">
                    moments away!
                </Text>
            </View>
        </View>
    )
}