// src/utils/firebase-video-streaming.ts
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import type { VideoSource } from 'expo-video';

export interface StreamingOptions {
    quality?: 'auto' | '720p' | '1080p';
    preferredCDN?: string;
}

export class FirebaseVideoStreamingService {
    private storage = getStorage();
    private manifestCache: Map<string, string> = new Map();

    /**
     * Creates a streaming source for the video
     */
    async createStreamingSource(
        videoId: string,
        metadata?: { title?: string; artist?: string },
        options: StreamingOptions = { quality: 'auto' }
    ): Promise<VideoSource> {
        try {
            // First check if we have an HLS manifest for this video
            const manifestPath = `videos/${videoId}/manifest.m3u8`;
            const manifestRef = ref(this.storage, manifestPath);

            try {
                // Try to get HLS manifest first
                const manifestUrl = await getDownloadURL(manifestRef);
                return {
                    uri: manifestUrl,
                    // streamingContentType: 'hls', // expo-video knows to use HLS streaming
                    metadata: {
                        title: metadata?.title ?? `Video ${videoId}`,
                        artist: metadata?.artist ?? 'SKY Yoga',
                    },
                    headers: {
                        // Add headers for range requests and streaming optimization
                        'Range': 'bytes=0-', // Initial range request
                        'X-Preferred-CDN': options.preferredCDN || 'default',
                    },
                    // overrideFileExtension: 'm3u8' // Ensure proper streaming mime type
                };
            } catch (manifestError) {
                // Fallback to progressive download if HLS is not available
                console.warn(`HLS manifest not found for ${videoId}, falling back to progressive download`);
                const videoRef = ref(this.storage, `videos/${videoId}.mp4`);
                const url = await getDownloadURL(videoRef);

                return {
                    uri: url,
                    metadata: {
                        title: metadata?.title ?? `Video ${videoId}`,
                        artist: metadata?.artist ?? 'SKY Yoga',
                    },
                    headers: {
                        // Still add range request support for progressive enhancement
                        'Range': 'bytes=0-',
                    }
                };
            }
        } catch (error) {
            console.error(`Error creating streaming source for ${videoId}:`, error);
            throw new Error(`Failed to create streaming source for video ${videoId}`);
        }
    }

    /**
     * Preloads video manifests for faster initial playback
     */
    async preloadStreamingManifests(videoIds: string[]): Promise<void> {
        const preloadPromises = videoIds.map(async id => {
            if (!this.manifestCache.has(id)) {
                try {
                    const manifestRef = ref(this.storage, `videos/${id}/manifest.m3u8`);
                    const manifestUrl = await getDownloadURL(manifestRef);
                    this.manifestCache.set(id, manifestUrl);
                } catch (error) {
                    console.warn(`Failed to preload manifest for ${id}:`, error);
                }
            }
        });

        await Promise.all(preloadPromises);
    }

    /**
     * Gets the optimal quality variant based on network conditions
     */
    private async getOptimalQuality(videoId: string): Promise<string> {
        // Implementation would check network conditions and device capabilities
        // to determine the best quality variant to start with
        return '720p';
    }

    /**
     * Clears the manifest cache
     */
    clearCache(): void {
        this.manifestCache.clear();
    }
}

// Export singleton instance
export const firebaseVideoStreaming = new FirebaseVideoStreamingService();