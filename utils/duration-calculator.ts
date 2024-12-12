// src/utils/duration-calculator.ts
import { VideoSource } from 'expo-video';

interface VideoDurationCache {
    [videoId: string]: number;
}

class DurationCalculator {
    private durationCache: VideoDurationCache = {};

    async calculateDuration(videoId: string, videoUrl: string): Promise<number> {
        if (this.durationCache[videoId]) {
            return this.durationCache[videoId];
        }

        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = videoUrl;

            video.onloadedmetadata = () => {
                this.durationCache[videoId] = video.duration;
                resolve(video.duration);
                video.remove();
            };

            // Fallback if metadata fails to load
            video.onerror = () => {
                console.warn(`[Duration] Failed to get duration for ${videoId}`);
                resolve(0);
                video.remove();
            };
        });
    }

    getDurationFromCache(videoId: string): number | null {
        return this.durationCache[videoId] || null;
    }

    clearCache() {
        this.durationCache = {};
    }
}

export const durationCalculator = new DurationCalculator();