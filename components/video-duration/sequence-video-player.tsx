// src/components/sequence-video-player.tsx
import React from 'react';
import { SeamlessSequenceVideoPlayer } from './seamless-sequence-video-player';

interface ExerciseData {
    readonly id: number;
    readonly title: string;
    readonly videoId: string;
    readonly image?: any;
}

interface SequenceVideoPlayerProps {
    exerciseData: readonly ExerciseData[];
    currentIndex: number;
    onVideoComplete?: () => void;
    onIndexChange?: (index: number) => void;
}

export const SequenceVideoPlayer: React.FC<SequenceVideoPlayerProps> = (props) => {
    return <SeamlessSequenceVideoPlayer {...props} />;
};