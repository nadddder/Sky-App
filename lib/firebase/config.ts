// src/lib/firebase/config.ts
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
};

export function initializeFirebase() {
    try {
        return getApp();
    } catch {
        const app = initializeApp(firebaseConfig);
        
        // Initialize auth with persistence
        if (Platform.OS !== 'web') {
            initializeAuth(app, {
                persistence: getReactNativePersistence(AsyncStorage)
            });
        }
        
        return app;
    }
}

// Initialize Firebase
const app = initializeFirebase();
export const auth = getAuth(app);