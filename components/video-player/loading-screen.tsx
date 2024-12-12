// src/components/video-player/loading-screen.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { loadingScreenStyles as styles } from '../styles';

export interface LoadingStatus {
    phase: 'calculating-duration' | 'preparing-video' | 'loading-resources';
    progress?: number;
}

interface LoadingScreenProps {
    status: LoadingStatus;
}

const getStatusMessage = (status: LoadingStatus): string => {
    switch (status.phase) {
        case 'calculating-duration':
            return `Calculating sequence duration... ${status.progress ? `(${Math.round(status.progress)}%)` : ''}`;
        case 'preparing-video':
            return 'Preparing your personalized video sequence...';
        case 'loading-resources':
            return 'Loading video resources...';
    }
};

export const LoadingScreen = ({ status }: LoadingScreenProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    Preparing Your Workout
                </Text>

                <ActivityIndicator
                    size="large"
                    color="#4630ec"
                    style={styles.spinner}
                />

                <Text style={styles.status}>
                    {getStatusMessage(status)}
                </Text>

                {status.progress !== undefined && (
                    <View style={styles.progressContainer}>
                        <View
                            style={[styles.progressBar, { width: `${status.progress}%` }]}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

