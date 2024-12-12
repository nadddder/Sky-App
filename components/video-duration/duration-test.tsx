// src/components/duration-test/duration-test.tsx
import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { EXERCISE_DATA } from '~/data/video-player';
import { DurationCalculator } from './duration-calculator';
import { durationTestStyles as styles, itemStyles } from '../styles';

interface DurationMap {
  [key: string]: number;
}

export const DurationTest = () => {
  const [durations, setDurations] = useState<DurationMap>({});
  const [calculatedCount, setCalculatedCount] = useState(0);

  const handleDurationCalculated = useCallback((videoId: string, duration: number) => {
    setDurations(prev => ({
      ...prev,
      [videoId]: duration
    }));
    setCalculatedCount(prev => prev + 1);
  }, []);

  const totalDuration = Object.values(durations).reduce((sum, duration) => sum + duration, 0);
  const isCalculating = calculatedCount < EXERCISE_DATA.length;
  const progress = (calculatedCount / EXERCISE_DATA.length) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Duration Test</Text>

      {/* Hidden duration calculators */}
      {EXERCISE_DATA.map(exercise => (
        <DurationCalculator
          key={exercise.videoId}
          videoId={exercise.videoId}
          onDurationCalculated={handleDurationCalculated}
        />
      ))}
      
      {isCalculating ? (
        <Text style={styles.calculating}>
          Calculating durations... ({Math.round(progress)}%)
        </Text>
      ) : (
        <Text style={styles.totalDuration}>
          Total Duration: {totalDuration.toFixed(2)}s
        </Text>
      )}

      {EXERCISE_DATA.map(exercise => (
        <View key={exercise.id} style={itemStyles.durationItem}>
          <Text style={itemStyles.title}>{exercise.title}</Text>
          <Text style={itemStyles.videoId}>ID: {exercise.videoId}</Text>
          {durations[exercise.videoId] !== undefined && (
            <Text style={itemStyles.duration}>
              Duration: {durations[exercise.videoId].toFixed(2)}s
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};