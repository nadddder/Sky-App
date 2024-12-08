import React from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ProgressChart } from 'react-native-chart-kit';
import type { ProgressChartData } from 'react-native-chart-kit/dist/ProgressChart';
import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes';

const screenWidth = Dimensions.get('window').width;

// Progress categories and their corresponding colors
const PROGRESS_CATEGORIES = [
    { name: 'Strength', value: 0.75 },
    { name: 'Flexibility', value: 0.60 },
    { name: 'Consistency', value: 0.85 },
    { name: 'Relaxation', value: 0.70 },
    { name: 'Endurance', value: 0.65 },
    { name: 'Balance', value: 0.80 }
];

// Define the colors array
const CHART_COLORS = [
    '#FF6B6B',  // Strength
    '#FFB84D',  // Flexibility
    '#4ADE80',  // Consistency
    '#60A5FA',  // Relaxation
    '#A78BFA',  // Endurance
    '#6366F1'   // Balance
];

// Progress data formatted for the chart with proper typing
const progressData: ProgressChartData = {
    labels: PROGRESS_CATEGORIES.map(cat => cat.name),
    data: PROGRESS_CATEGORIES.map(cat => cat.value),
    colors: CHART_COLORS
};

// Chart configuration with proper typing
const chartConfig: ChartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1, index = 0) => {
        // Ensure index is within bounds
        const colorIndex = Math.min(Math.max(0, index), CHART_COLORS.length - 1);
        return `${CHART_COLORS[colorIndex]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    },
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    style: {
        borderRadius: 16
    },
    propsForLabels: {
        fontSize: 14,
        fontFamily: 'System',
    },
};

// Mock pose progression data
const POSE_PROGRESSION = [
    {
        level: 'Beginner',
        poses: [
            { id: 'pose1', image: '/api/placeholder/80/80' },
            { id: 'pose2', image: '/api/placeholder/80/80' },
            { id: 'pose3', image: '/api/placeholder/80/80' },
            { id: 'pose4', image: '/api/placeholder/80/80' }
        ]
    },
    {
        level: 'Intermediate',
        poses: [
            { id: 'pose5', image: '/api/placeholder/80/80' },
            { id: 'pose6', image: '/api/placeholder/80/80' },
            { id: 'pose7', image: '/api/placeholder/80/80' },
            { id: 'pose8', image: '/api/placeholder/80/80' }
        ]
    },
    {
        level: 'Advanced',
        poses: [
            { id: 'pose9', image: '/api/placeholder/80/80' },
            { id: 'pose10', image: '/api/placeholder/80/80' },
            { id: 'pose11', image: '/api/placeholder/80/80' },
            { id: 'pose12', image: '/api/placeholder/80/80' }
        ]
    }
];

const ProgressLegend = () => (
    <View className="flex-row flex-wrap gap-4 px-4 mb-6">
        {PROGRESS_CATEGORIES.map((category, index) => (
            <View key={category.name} className="flex-row items-center">
                <View
                    style={{ backgroundColor: CHART_COLORS[index] }}
                    className="w-3 h-3 mr-2 rounded-full"
                />
                <Text className="text-sm text-gray-600">{category.name}</Text>
            </View>
        ))}
    </View>
);

const PoseProgressionRow = ({ level, poses }: { level: string; poses: Array<{ id: string; image: string }> }) => (
    <View className="mb-6">
        <Text className="mb-2 ml-4 text-sm font-medium text-gray-900">{level}</Text>
        <View className="flex-row">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
                {poses.map((pose) => (
                    <View
                        key={pose.id}
                        className="w-20 h-20 overflow-hidden bg-gray-100 rounded-lg"
                    >
                        <Image
                            source={{ uri: pose.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    </View>
);

export function ProgressScreen() {

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView className="flex-1">
                <View className="py-6">
                    <Text className="px-4 mb-2 text-lg text-gray-600">
                        {/* Great job {state.name}, */}
                    </Text>
                    <Text className="px-4 mb-6 text-3xl font-bold text-gray-900">
                        You've made progress!
                    </Text>

                    <ProgressLegend />

                    <View className="mb-6">
                        <ProgressChart
                            data={progressData}
                            width={screenWidth}
                            height={220}
                            strokeWidth={16}
                            radius={32}
                            chartConfig={chartConfig}
                            hideLegend={true}
                        />
                    </View>

                    <View className="mt-8">
                        <Text className="px-4 mb-4 text-lg font-medium text-gray-900">
                            Progress towards goals
                        </Text>
                        {POSE_PROGRESSION.map((section) => (
                            <PoseProgressionRow
                                key={section.level}
                                level={section.level}
                                poses={section.poses}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}