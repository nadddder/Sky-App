// src/utils/sequence-duration.ts
import { VideoSource, useVideoPlayer } from 'expo-video';
import { firebaseVideoService } from './firebase-video';

interface DurationResult {
    videoId: string;
    duration: number;
}

export class SequenceDurationCalculator {
    private durationCache: Record<string, number> = {};

    async calculateDuration(videoId: string, player: any): Promise<number> {
        if (this.durationCache[videoId]) {
            console.log(`[Duration] Using cached duration for ${videoId}: ${this.durationCache[videoId]}s`);
            return this.durationCache[videoId];
        }

        return new Promise((resolve, reject) => {
            const subscription = player.addListener('statusChange', (event: any) => {
                if (event.status === 'readyToPlay' && player.duration > 0) {
                    console.log(`[Duration] Got duration for ${videoId}: ${player.duration}s`);
                    this.durationCache[videoId] = player.duration;
                    subscription.remove();
                    resolve(player.duration);
                } else if (event.status === 'error') {
                    console.error(`[Duration] Error getting duration for ${videoId}:`, event.error);
                    subscription.remove();
                    reject(event.error);
                }
            });
        });
    }

    getDurationFromCache(videoId: string): number | null {
        return this.durationCache[videoId] || null;
    }

    clearCache() {
        this.durationCache = {};
    }
}

export const sequenceDurationCalculator = new SequenceDurationCalculator();