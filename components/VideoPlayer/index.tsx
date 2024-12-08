// src/components/VideoPlayer/index.tsx
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useVideoPlayer, VideoView, VideoPlayer, type VideoPlayerStatus, type PlayerError, type TimeUpdateEventPayload } from 'expo-video';
import { useEvent } from 'expo';

export interface VideoPlayerProps {
    source: string | { uri: string; metadata?: { title?: string; artist?: string } };
    className?: string;
    onPlaybackComplete?: () => void;
    onError?: (error: PlayerError) => void;
    initialPlaybackRate?: number;
    autoplay?: boolean;
    addPlayer: VideoPlayer;
}

export const TheVideoPlayer = ({
    source,
    className,
    onPlaybackComplete,
    onError,
    initialPlaybackRate = 1.0,
    autoplay = false,
    addPlayer
}: VideoPlayerProps) => {
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedPosition, setBufferedPosition] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate);

    // Initialize video player
    const player = useVideoPlayer(source, player => {
        player.playbackRate = initialPlaybackRate;
        player.staysActiveInBackground = true;
        player.timeUpdateEventInterval = 0.5; // Update progress every 500ms
        player.preservesPitch = true;

        if (autoplay) {
            player.play();
        }
    });

    // Track playback state using events
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const statusEvent = useEvent(
        player,
        'statusChange',
        {
            status: player.status as VideoPlayerStatus,
            error: undefined
        }
    ) ?? { status: 'idle' as VideoPlayerStatus, error: null };
    const { status, error } = statusEvent;

    // Handle time updates
    const timeUpdateEvent = useEvent(player, 'timeUpdate', {
        currentTime: player.currentTime,
        currentLiveTimestamp: null,
        currentOffsetFromLive: null,
        bufferedPosition: player.bufferedPosition
    });

    // Update state when time update event occurs
    useEffect(() => {
        if (timeUpdateEvent) {
            setCurrentTime(timeUpdateEvent.currentTime);
            setDuration(player.duration);
            setBufferedPosition(timeUpdateEvent.bufferedPosition);
        }
    }, [timeUpdateEvent, player]);

    // Auto-hide controls after 3 seconds of inactivity
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showControls && isPlaying) {
            timeout = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [showControls, isPlaying]);

    // Handle play/pause
    const handlePlayPause = useCallback(() => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
        setShowControls(true);
    }, [isPlaying, player]);

    // Handle video press to toggle controls
    const handleVideoPress = useCallback(() => {
        setShowControls(prev => !prev);
    }, []);

    // Handle seeking
    const handleSeek = useCallback((time: number) => {
        player.currentTime = Math.max(0, Math.min(time, duration));
    }, [player, duration]);

    // Toggle fullscreen using VideoView ref
    const [videoViewRef, setVideoViewRef] = useState<VideoView | null>(null);

    const handleFullscreenToggle = useCallback(async () => {
        try {
            if (videoViewRef) {
                if (isFullscreen) {
                    await videoViewRef.exitFullscreen();
                } else {
                    await videoViewRef.enterFullscreen();
                }
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    }, [isFullscreen, videoViewRef]);

    // Toggle mute
    const handleMuteToggle = useCallback(() => {
        player.muted = !isMuted;
        setIsMuted(prev => !prev);
    }, [isMuted, player]);

    // Change playback speed
    const handlePlaybackRateChange = useCallback(() => {
        const rates = [0.5, 1.0, 1.5, 2.0];
        const currentIndex = rates.indexOf(playbackRate);
        const nextRate = rates[(currentIndex + 1) % rates.length];
        player.playbackRate = nextRate;
        setPlaybackRate(nextRate);
    }, [playbackRate, player]);

    // Format time for display (mm:ss)
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progress = useMemo(() => {
        return duration > 0 ? (currentTime / duration) * 100 : 0;
    }, [currentTime, duration]);

    // Calculate buffer percentage
    const bufferProgress = useMemo(() => {
        return duration > 0 ? (bufferedPosition / duration) * 100 : 0;
    }, [bufferedPosition, duration]);

    // Handle playback completion
    useEffect(() => {
        const subscription = player.addListener('playToEnd', () => {
            onPlaybackComplete?.();
        });

        return () => subscription.remove();
    }, [player, onPlaybackComplete]);

    // Handle errors
    useEffect(() => {
        if (status === 'error' && error) {
            onError?.(error);
        }
    }, [status, error, onError]);

    return (
        <VideoView
            player={addPlayer}
            className="w-full h-full"
            nativeControls={true}
            contentFit="cover"

            style={{ width: '100%', aspectRatio: 16 / 9 }} // Ensure proper dimensions
        />
    );
};