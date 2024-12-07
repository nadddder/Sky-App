// app/index.tsx
import WelcomeBottomSection from "~/components/welcome/bottom-section";
import ResetButton from "~/components/welcome/reset-button";
import WelcomeTopSection from "~/components/welcome/top-section";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";

export default function WelcomeScreen() {
    return (
        <ImageBackground
            source={require('~/assets/images/yoga-bg.jpg')}
            resizeMode="cover"
            className="flex-1"
        >
            <StatusBar style="dark" />

            {/* Reset Button Position */}
            <View className="absolute z-10 right-4 top-12">
                <ResetButton />
            </View>

            <View className="flex-1">
                <WelcomeTopSection />
                <WelcomeBottomSection />
            </View>
        </ImageBackground>
    );
}