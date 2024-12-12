// src/hooks/use-sequence-duration.ts
import { useState, useEffect } from 'react';
import { useVideoPlayer } from 'expo-video';
import { firebaseVideoService } from '~/utils/firebase-video';
import { sequenceDurationCalculator } from '~/utils/sequence-duration';

interface CalculationResult {
  isCalculating: boolean;
  totalDuration: number;
  error: string | null;
  progress: number;
}

export const useSequenceDuration = (videoIds: string[]) => {
  const [result, setResult] = useState<CalculationResult>({
    isCalculating: true,
    totalDuration: 0,
    error: null,
    progress: 0
  });

  useEffect(() => {
    let isMounted = true;
    let calculatedCount = 0;
    let totalDuration = 0;

    const calculateSequenceDuration = async () => {
      try {
        for (const videoId of videoIds) {
          // Check cache first
          const cachedDuration = sequenceDurationCalculator.getDurationFromCache(videoId);
          if (cachedDuration) {
            totalDuration += cachedDuration;
            calculatedCount++;
            if (isMounted) {
              setResult(prev => ({
                ...prev,
                totalDuration,
                progress: (calculatedCount / videoIds.length) * 100
              }));
            }
            continue;
          }

          // Get video source
          const source = await firebaseVideoService.getVideoSource(videoId);
          const player = useVideoPlayer(source);

          try {
            const duration = await sequenceDurationCalculator.calculateDuration(videoId, player);
            totalDuration += duration;
            calculatedCount++;
            
            if (isMounted) {
              setResult(prev => ({
                ...prev,
                totalDuration,
                progress: (calculatedCount / videoIds.length) * 100
              }));
            }
          } catch (error) {
            console.error(`[Duration] Failed to get duration for ${videoId}:`, error);
            // Continue with other videos even if one fails
          }
        }

        if (isMounted) {
          setResult(prev => ({
            ...prev,
            isCalculating: false,
            progress: 100
          }));
        }
      } catch (error) {
        console.error('[Duration] Error calculating sequence duration:', error);
        if (isMounted) {
          setResult(prev => ({
            ...prev,
            isCalculating: false,
            error: 'Failed to calculate total duration'
          }));
        }
      }
    };

    calculateSequenceDuration();

    return () => {
      isMounted = false;
    };
  }, [videoIds]);

  return result;
};