// src/components/seamless-sequence-video-player.tsx
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { VideoView, VideoSource, useVideoPlayer } from 'expo-video';
import { firebaseVideoService } from '~/utils/firebase-video';
import { Ionicons } from '@expo/vector-icons';
import { InitialLoading } from './initial-video-loading';

interface ExerciseData {
    readonly id: number;
    readonly title: string;
    readonly videoId: string;
    readonly image?: any;
}

interface SequenceProgress {
    currentVideoIndex: number;
    currentVideoTime: number;
    totalProgress: number;
    isTransitioning: boolean;
}

interface SeamlessSequencePlayerProps {
    exerciseData: readonly ExerciseData[];
    currentIndex: number;
    onVideoComplete?: () => void;
    onIndexChange?: (index: number) => void;
}

export const SeamlessSequenceVideoPlayer: React.FC<SeamlessSequencePlayerProps> = ({
    exerciseData,
    currentIndex,
    onVideoComplete,
    onIndexChange,
}) => {
    // State for player setup and loading
    const [isInitializing, setIsInitializing] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [totalDuration, setTotalDuration] = useState(0);
    
    // Video sources and playback state
    const [currentSource, setCurrentSource] = useState<VideoSource | null>(null);
    const [nextSource, setNextSource] = useState<VideoSource | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Progress tracking
    const [sequenceProgress, setSequenceProgress] = useState<SequenceProgress>({
        currentVideoIndex: currentIndex,
        currentVideoTime: 0,
        totalProgress: 0,
        isTransitioning: false
    });

    // Refs for cleanup and tracking
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentVideoStartTimeRef = useRef(0);

    // Initialize players
    const currentPlayer = useVideoPlayer(currentSource, useCallback((player:any) => {
        if (player) {
            console.log('[Player] Setting up current player');
            player.timeUpdateEventInterval = 0.5;
            player.loop = false;
        }
    }, [currentSource]));

    const nextPlayer = useVideoPlayer(nextSource, useCallback((player:any) => {
        if (player) {
            console.log('[Player] Setting up next player');
            player.timeUpdateEventInterval = 0.5;
            player.loop = false;
            player.muted = true; // Prevent audio overlap during transition
        }
    }, [nextSource]));

    // Initialize sequence and calculate total duration
    useEffect(() => {
        const initializeSequence = async () => {
            try {
                setIsInitializing(true);
                console.log('[Sequence] Calculating total duration...');
                
                // Calculate total duration first
                const videoIds = exerciseData.map(ex => ex.videoId);
                const totalDuration = await firebaseVideoService.calculateSequenceDuration(videoIds);
                setTotalDuration(totalDuration);
                
                // Load first video
                const firstSource = await firebaseVideoService.getVideoSource(
                    exerciseData[0].videoId,
                    { title: exerciseData[0].title }
                );
                setCurrentSource(firstSource);
                
                // Start preloading second video if available
                if (exerciseData.length > 1) {
                    const secondSource = await firebaseVideoService.getVideoSource(
                        exerciseData[1].videoId,
                        { title: exerciseData[1].title }
                    );
                    setNextSource(secondSource);
                }
                
            } catch (error) {
                console.error('[Sequence] Initialization error:', error);
            } finally {
                setIsInitializing(false);
                setIsLoading(false);
            }
        };

        initializeSequence();
    }, [exerciseData]);

    // Handle video transitions
    const handleVideoTransition = useCallback(() => {
        if (sequenceProgress.currentVideoIndex >= exerciseData.length - 1) {
            onVideoComplete?.();
            return;
        }

        setSequenceProgress(prev => ({
            ...prev,
            isTransitioning: true
        }));

        // Start playing next video
        if (nextPlayer) {
            nextPlayer.play();
        }

        // Update current video start time for progress calculation
        currentVideoStartTimeRef.current += currentPlayer?.duration || 0;

        // Smooth transition
        transitionTimeoutRef.current = setTimeout(async () => {
            const nextIndex = sequenceProgress.currentVideoIndex + 1;
            onIndexChange?.(nextIndex);
            
            // Update state for next video
            setSequenceProgress(prev => ({
                ...prev,
                currentVideoIndex: nextIndex,
                currentVideoTime: 0,
                isTransitioning: false
            }));

            // Move next video to current
            setCurrentSource(nextSource);

            // Start preloading next video if available
            if (nextIndex < exerciseData.length - 1) {
                const nextVideoSource = await firebaseVideoService.getVideoSource(
                    exerciseData[nextIndex + 1].videoId,
                    { title: exerciseData[nextIndex + 1].title }
                );
                setNextSource(nextVideoSource);
            } else {
                setNextSource(null);
            }
        }, 500);
    }, [sequenceProgress.currentVideoIndex, exerciseData.length, currentPlayer, nextPlayer, nextSource, onVideoComplete, onIndexChange]);

    // Monitor playback progress
    useEffect(() => {
        if (!currentPlayer) return;

        const timeUpdateSubscription = currentPlayer.addListener('timeUpdate', (event) => {
            if (!event) return;

            const currentTime = event.currentTime;
            const overallProgress = totalDuration > 0 
                ? ((currentVideoStartTimeRef.current + currentTime) / totalDuration) * 100 
                : 0;

            setSequenceProgress(prev => ({
                ...prev,
                currentVideoTime: currentTime,
                totalProgress: Math.min(overallProgress, 100)
            }));

            // Check for video completion
            if (currentPlayer.duration > 0 && currentTime >= currentPlayer.duration - 0.5) {
                handleVideoTransition();
            }
        });

        const playingChangeSubscription = currentPlayer.addListener('playingChange', (event) => {
            if (event) {
                setIsPlaying(event.isPlaying);
            }
        });

        return () => {
            timeUpdateSubscription.remove();
            playingChangeSubscription.remove();
        };
    }, [currentPlayer, totalDuration, handleVideoTransition]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = useCallback(() => {
        if (!currentPlayer) return;

        if (isPlaying) {
            currentPlayer.pause();
        } else {
            currentPlayer.play();
        }
    }, [currentPlayer, isPlaying]);

    if (isInitializing) {
        return <InitialLoading message="Preparing your sequence..." />;
    }

    if (isLoading || !currentSource) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4630ec" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Current Video */}
            <VideoView
                player={currentPlayer}
                style={[styles.video, sequenceProgress.isTransitioning && styles.fadeOut]}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls={false}
                contentFit="cover"
            />

            {/* Next Video (for transition) */}
            {nextSource && (
                <VideoView
                    player={nextPlayer}
                    style={[
                        styles.video, 
                        styles.nextVideo,
                        { opacity: sequenceProgress.isTransitioning ? 1 : 0 }
                    ]}
                    nativeControls={false}
                    contentFit="cover"
                />
            )}

            {/* Custom Controls */}
            <View style={styles.controls}>
                <View style={styles.progressContainer}>
                    <View 
                        style={[
                            styles.progressBar, 
                            { width: `${sequenceProgress.totalProgress}%` }
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
                        {formatTime(currentVideoStartTimeRef.current + sequenceProgress.currentVideoTime)} / {formatTime(totalDuration)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 350,
        height: 275,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    nextVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fadeOut: {
        opacity: 0,
    },
    controls: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    progressContainer: {
        marginBottom: 8,
        width: '100%',
        height: 4,
        backgroundColor: '#4b5563',
        borderRadius: 2,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playButton: {
        padding: 8,
    },
    timeText: {
        fontSize: 14,
        color: '#ffffff',
    },
});