// src/components/video-duration/video-measurer.tsx
import React, { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video';
import { firebaseVideoService } from '~/utils/firebase-video';

export interface DurationInfo {
    videoId: string;
    title: string;
    duration: number;
    status: 'pending' | 'success' | 'error';
    error?: string;
}

interface VideoMeasurerProps {
    videoId: string;
    title: string;
    onDurationCalculated: (info: DurationInfo) => void;
}

export const VideoMeasurer: React.FC<VideoMeasurerProps> = ({
    videoId,
    title,
    onDurationCalculated
}) => {
    const [source, setSource] = useState<VideoSource | null>(null);

    useEffect(() => {
        const loadSource = async () => {
            try {
                console.log(`[Duration] Getting source for ${videoId}`);
                const videoSource = await firebaseVideoService.getVideoSource(videoId);
                setSource(videoSource);
            } catch (error) {
                console.error(`[Duration] Error loading source for ${videoId}:`, error);
                onDurationCalculated({
                    videoId,
                    title,
                    duration: 0,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Failed to load source'
                });
            }
        };

        loadSource();
    }, [videoId, title]);

    const player = useVideoPlayer(source, (player) => {
        if (!player) return;

        const subscription = player.addListener('statusChange', (event) => {
            if (event.status === 'readyToPlay' && player.duration > 0) {
                console.log(`[Duration] ${videoId}: ${player.duration}s`);
                onDurationCalculated({
                    videoId,
                    title,
                    duration: player.duration,
                    status: 'success'
                });
                subscription.remove();
            } else if (event.status === 'error') {
                console.error(`[Duration] Error for ${videoId}:`, event.error);
                onDurationCalculated({
                    videoId,
                    title,
                    duration: 0,
                    status: 'error',
                    error: event.error?.message
                });
                subscription.remove();
            }
        });
    });

    return source ? (
        <VideoView
            player={player}
            style={{ width: 1, height: 1, opacity: 0 }}
        />
    ) : null;
};