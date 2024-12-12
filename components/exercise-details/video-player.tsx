// src/components/exercise-details/VideoPlayer.tsx
import React from 'react';
import { SequenceVideoPlayer } from '../video-duration/sequence-video-player';
import { EXERCISE_DATA } from '~/data/video-player';

interface VideoPlayerProps {
  currentVideoIndex: number;
  onVideoComplete?: () => void;
  onIndexChange?: (index: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideoIndex,
  onVideoComplete,
  onIndexChange,
}) => {
  return (
    <SequenceVideoPlayer
      exerciseData={EXERCISE_DATA}
      currentIndex={currentVideoIndex}
      onVideoComplete={onVideoComplete}
      onIndexChange={onIndexChange}
    />
  );
};

export default React.memo(VideoPlayer);