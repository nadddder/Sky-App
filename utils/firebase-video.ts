// src/utils/firebase-video.ts
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { durationCalculator } from './duration-calculator';

export type VideoSource = {
  uri: string;
  metadata?: {
    title?: string;
    artist?: string;
  };
};

export class FirebaseVideoService {
  private storage = getStorage();
  private urlCache: Map<string, string> = new Map();
  
  async calculateSequenceDuration(videoIds: string[]): Promise<number> {
    try {
      let totalDuration = 0;
      const durations = await Promise.all(
        videoIds.map(async (videoId) => {
          // First check cache
          const cachedDuration = durationCalculator.getDurationFromCache(videoId);
          if (cachedDuration !== null) {
            return cachedDuration;
          }
          
          // Get URL and calculate duration
          let url = this.urlCache.get(videoId);
          if (!url) {
            const videoRef = ref(this.storage, `Videos/${videoId}.mp4`);
            url = await getDownloadURL(videoRef);
            this.urlCache.set(videoId, url);
          }
          
          return durationCalculator.calculateDuration(videoId, url);
        })
      );
      
      totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
      console.log('[Duration] Total sequence duration:', totalDuration);
      return totalDuration;
      
    } catch (error) {
      console.error('[Duration] Error calculating sequence duration:', error);
      return 0;
    }
  }

  /**
   * Gets video source with basic configuration
   */
  async getVideoSource(videoId: string, metadata?: { title?: string; artist?: string }): Promise<VideoSource> {
    try {
      let url = this.urlCache.get(videoId);
      if (!url) {
        const videoRef = ref(this.storage, `Videos/${videoId}.mp4`);
        url = await getDownloadURL(videoRef);
        this.urlCache.set(videoId, url);
      }

      return {
        uri: url,
        metadata: metadata ? {
          title: metadata.title,
          artist: metadata.artist
        } : undefined
      };
    } catch (error) {
      console.error(`[Firebase] Error getting video ${videoId}:`, error);
      throw error;
    }
  }

  /**
   * Preload next video URL
   */
  async preloadVideo(videoId: string): Promise<string> {
    if (!this.urlCache.has(videoId)) {
      try {
        const videoRef = ref(this.storage, `Videos/${videoId}.mp4`);
        const url = await getDownloadURL(videoRef);
        this.urlCache.set(videoId, url);
        return url;
      } catch (error) {
        console.warn(`[Firebase] Failed to preload video ${videoId}:`, error);
        throw error;
      }
    }
    return this.urlCache.get(videoId)!;
  }

  clearCache(): void {
    this.urlCache.clear();
    durationCalculator.clearCache();
  }
}

export const firebaseVideoService = new FirebaseVideoService();