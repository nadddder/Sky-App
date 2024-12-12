// src/components/video-duration/duration-info-item.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { DurationInfo } from './video-measurer';
import { itemStyles as styles } from '../styles';

interface DurationInfoItemProps {
    info: DurationInfo;
}

export const DurationInfoItem: React.FC<DurationInfoItemProps> = ({ info }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{info.title}</Text>
            <Text style={styles.videoId}>ID: {info.videoId}</Text>
            <Text style={[
                styles.duration,
                info.status === 'error' && styles.error
            ]}>
                {info.status === 'success'
                    ? `Duration: ${info.duration.toFixed(2)}s`
                    : info.error || 'Error calculating duration'
                }
            </Text>
        </View>
    );
};

