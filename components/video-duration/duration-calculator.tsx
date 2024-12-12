// src/components/duration-test/duration-calculator.tsx
import React, { useEffect, useState } from 'react';
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video';
import { firebaseVideoService } from '~/utils/firebase-video';

interface Props {
  videoId: string;
  onDurationCalculated: (videoId: string, duration: number) => void;
}

export const DurationCalculator: React.FC<Props> = ({ 
  videoId, 
  onDurationCalculated 
}) => {
  const [source, setSource] = useState<VideoSource | null>(null);

  // First, load the video source
  useEffect(() => {
    let isMounted = true;

    const loadSource = async () => {
      try {
        console.log(`[Duration] Getting source for ${videoId}`);
        const videoSource = await firebaseVideoService.getVideoSource(videoId);
        if (isMounted) {
          setSource(videoSource);
        }
      } catch (error) {
        console.error(`[Duration] Error loading source for ${videoId}:`, error);
      }
    };

    loadSource();
    return () => {
      isMounted = false;
    };
  }, [videoId]);

  // Then use the video player with the loaded source
  const player = useVideoPlayer(source, player => {
    if (!player) return;

    const subscription = player.addListener('statusChange', (event) => {
      if (event.status === 'readyToPlay' && player.duration > 0) {
        console.log(`[Duration] ${videoId}: ${player.duration}s`);
        onDurationCalculated(videoId, player.duration);
        subscription.remove();
      } else if (event.status === 'error') {
        console.error(`[Duration] Error for ${videoId}:`, event.error);
        subscription.remove();
      }
    });

    return () => {
      subscription.remove();
    };
  });

  return null;
};