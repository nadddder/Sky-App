// src/services/performance.ts
import { InteractionManager, Platform } from 'react-native';

class PerformanceMonitor {
    private measurements: Map<string, {
        start: number;
        end?: number;
    }> = new Map();

    startMeasure(id: string) {
        if (__DEV__) {
            this.measurements.set(id, {
                start: performance.now()
            });
        }
    }

    endMeasure(id: string) {
        if (__DEV__) {
            const measurement = this.measurements.get(id);
            if (measurement) {
                measurement.end = performance.now();
                const duration = measurement.end - measurement.start;
                console.log(`[Performance] ${id}: ${duration.toFixed(2)}ms`);
                this.measurements.delete(id);
            }
        }
    }

    async runAfterInteractions<T>(
        task: () => Promise<T> | T,
        taskName = 'Unknown Task'
    ): Promise<T> {
        if (Platform.OS === 'web') {
            return task();
        }

        return new Promise((resolve, reject) => {
            InteractionManager.runAfterInteractions(() => {
                this.startMeasure(taskName);
                Promise.resolve(task())
                    .then((result) => {
                        this.endMeasure(taskName);
                        resolve(result);
                    })
                    .catch(reject);
            });
        });
    }
}

export const performanceMonitor = new PerformanceMonitor();