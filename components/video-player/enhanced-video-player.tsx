// src/components/video-player/enhanced-video-player.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer, VideoSource, VideoPlayer } from 'expo-video';
import { firebaseVideoService } from '~/utils/firebase-video';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen, LoadingStatus } from './loading-screen';
import { EXERCISE_DATA } from '~/data/video-player';
import { DurationCalculator } from '../video-duration/duration-calculator';
import { enahncedVideoPlayerStyles as styles } from "../styles"

interface PlayerState {
    phase: 'initializing' | 'calculating' | 'preparing' | 'ready' | 'error';
    error?: string;
    currentVideoIndex: number;
}

interface DurationMap {
    [key: string]: number;
}

export const EnhancedVideoPlayer = () => {
    // State management
    const [playerState, setPlayerState] = useState<PlayerState>({
        phase: 'initializing',
        currentVideoIndex: 0
    });
    const [durations, setDurations] = useState<DurationMap>({});
    const [calculatedCount, setCalculatedCount] = useState(0);
    const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Refs for tracking video transitions
    const lastVideoEndTime = useRef<number>(0);
    const isTransitioning = useRef<boolean>(false);

    // Calculate total duration and progress
    const totalDuration = Object.values(durations).reduce((sum, duration) => sum + duration, 0);
    const durationProgress = (calculatedCount / EXERCISE_DATA.length) * 100;

    // Handle duration calculation completion
    const handleDurationCalculated = useCallback((videoId: string, duration: number) => {
        console.log(`[Duration] Calculated for ${videoId}: ${duration}s`);
        setDurations(prev => ({
            ...prev,
            [videoId]: duration
        }));
        setCalculatedCount(prev => prev + 1);
    }, []);

    // Load first video once all durations are calculated
    useEffect(() => {
        if (calculatedCount === EXERCISE_DATA.length && playerState.phase === 'initializing') {
            const loadFirstVideo = async () => {
                try {
                    console.log('[Player] Loading first video...');
                    setPlayerState(prev => ({ ...prev, phase: 'preparing' }));

                    const source = await firebaseVideoService.getVideoSource(
                        EXERCISE_DATA[0].videoId,
                        {
                            title: EXERCISE_DATA[0].title,
                            artist: 'Exercise Sequence'
                        }
                    );

                    setVideoSource(source);
                    setPlayerState(prev => ({ ...prev, phase: 'ready' }));
                    console.log('[Player] First video loaded successfully');
                } catch (error) {
                    console.error('[Player] Error loading first video:', error);
                    setPlayerState(prev => ({
                        ...prev,
                        phase: 'error',
                        error: 'Failed to load initial video'
                    }));
                }
            };

            loadFirstVideo();
        }
    }, [calculatedCount, playerState.phase]);

    // Initialize video player with enhanced error handling
    const player = useVideoPlayer(videoSource, useCallback((player: VideoPlayer) => {
        if (!player) {
            console.warn('[Player] Player initialization failed');
            return;
        }

        console.log('[Player] Setting up video player');
        player.timeUpdateEventInterval = 0.5;
        player.loop = false; // Ensure loop is off for proper sequence handling

        // Configure additional player settings
        player.preservesPitch = true;
        player.showNowPlayingNotification = true;

        // Play automatically when ready
        if (playerState.phase === 'ready') {
            try {
                player.play();
            } catch (error) {
                console.error('[Player] Autoplay failed:', error);
            }
        }
    }, [videoSource, playerState.phase]));

    // Handle playback progress and video transitions
    useEffect(() => {
        if (!player) return;

        const timeUpdateSubscription = player.addListener('timeUpdate', (event) => {
            if (!event) return;
            setCurrentTime(event.currentTime);

            // Check for video transition
            if (!isTransitioning.current &&
                event.currentTime >= (player.duration - 0.5) &&
                playerState.currentVideoIndex < EXERCISE_DATA.length - 1) {
                handleVideoTransition();
            }
        });

        const playingChangeSubscription = player.addListener('playingChange', (event) => {
            if (event) {
                setIsPlaying(event.isPlaying);
            }
        });

        const statusChangeSubscription = player.addListener('statusChange', (event) => {
            console.log('[Player] Status changed:', event.status);
        });

        return () => {
            timeUpdateSubscription.remove();
            playingChangeSubscription.remove();
            statusChangeSubscription.remove();
        };
    }, [player, playerState.currentVideoIndex]);

    // Handle video transitions
    const handleVideoTransition = async () => {
        if (!player || isTransitioning.current) return;

        try {
            isTransitioning.current = true;
            const nextIndex = playerState.currentVideoIndex + 1;
            console.log(`[Player] Transitioning to video ${nextIndex}`);

            const nextSource = await firebaseVideoService.getVideoSource(
                EXERCISE_DATA[nextIndex].videoId,
                {
                    title: EXERCISE_DATA[nextIndex].title,
                    artist: 'Exercise Sequence'
                }
            );

            lastVideoEndTime.current = currentTime;
            setVideoSource(nextSource);
            setPlayerState(prev => ({
                ...prev,
                currentVideoIndex: nextIndex
            }));

        } catch (error) {
            console.error('[Player] Transition error:', error);
            setPlayerState(prev => ({
                ...prev,
                phase: 'error',
                error: 'Failed to transition to next video'
            }));
        } finally {
            isTransitioning.current = false;
        }
    };

    // Handle play/pause with error handling
    const handlePlayPause = useCallback(async () => {
        if (!player) return;

        try {
            if (isPlaying) {
                await player.pause();
            } else {
                await player.play();
            }
        } catch (error) {
            console.error('[Player] Play/Pause error:', error);
        }
    }, [player, isPlaying]);

    // Time formatting utility
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Loading status management
    const getLoadingStatus = (): LoadingStatus => {
        switch (playerState.phase) {
            case 'calculating':
                return {
                    phase: 'calculating-duration',
                    progress: durationProgress
                };
            case 'preparing':
                return { phase: 'preparing-video' };
            default:
                return { phase: 'loading-resources' };
        }
    };

    // Render loading state
    if (playerState.phase !== 'ready') {
        if (playerState.phase === 'error') {
            return (
                <View style={styles.container}>
                    <Text style={styles.error}>{playerState.error}</Text>
                </View>
            );
        }
        return <LoadingScreen status={getLoadingStatus()} />;
    }

    // Render player
    return (
        <View style={styles.container}>
            {/* Hidden duration calculators */}
            <View style={{ height: 0, opacity: 0 }}>
                {EXERCISE_DATA.map(exercise => (
                    <DurationCalculator
                        key={exercise.videoId}
                        videoId={exercise.videoId}
                        onDurationCalculated={handleDurationCalculated}
                    />
                ))}
            </View>

            {videoSource && (
                <>
                    <VideoView
                        player={player}
                        style={styles.video}
                        contentFit="cover"
                    />

                    <View style={styles.controls}>
                        <View style={styles.progressContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: `${(currentTime / totalDuration) * 100}%`
                                    }
                                ]}
                            />
                        </View>

                        <View style={styles.controlsRow}>
                            <TouchableOpacity
                                onPress={handlePlayPause}
                                style={styles.playButton}
                            >
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>

                            <Text style={styles.timeText}>
                                {formatTime(currentTime)} / {formatTime(totalDuration)}
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};
