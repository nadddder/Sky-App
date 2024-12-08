// components/monitoring/app-monitor.tsx
import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const logToService = async (logData: any) => {
  try {
    // You can replace this with any logging service URL
    const loggingEndpoint = 'YOUR_LOGGING_SERVICE_URL';
    
    const deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version,
      releaseChannel: Updates.channel,
      updateId: Updates.updateId,
      isEmbedded: Updates.isEmbeddedLaunch,
      runtimeVersion: Updates.runtimeVersion,
      appVersion: Constants.expoConfig?.version,
      buildVersion: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode,
    };

    const payload = {
      ...logData,
      deviceInfo,
      timestamp: new Date().toISOString(),
    };

    // For now, just console.log in production
    if (__DEV__) {
      console.log('Development log:', payload);
    } else {
      console.log('Production log:', payload);
      // Uncomment when you have a logging service
      // await fetch(loggingEndpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
    }
  } catch (error) {
    console.error('Logging failed:', error);
  }
};

export const useAppMonitor = () => {
  return {
    logEvent: async (eventName: string, data?: any) => {
      await logToService({
        eventName,
        data,
      });
    },
  };
};

export const AppMonitor: React.FC = () => {
  const { logEvent } = useAppMonitor();

  useEffect(() => {
    const initMonitoring = async () => {
      await logEvent('APP_LAUNCHED', {
        launchTime: new Date().toISOString(),
      });
    };

    initMonitoring();
  }, []);

  return null; // This is a headless component
};