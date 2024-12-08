// src/hooks/use-firebase-auth.ts
import { useState, useCallback } from 'react';
import { authService, AuthCredentials, AuthResponse } from '~/services/auth';
import { useStore } from '~/store/root-store';
import { performanceMonitor } from '~/services/performance';

interface UseFirebaseAuth {
    signUp: (credentials: AuthCredentials) => Promise<AuthResponse>;
    signIn: (credentials: AuthCredentials) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
    signInWithGoogle: (idToken: string) => Promise<AuthResponse>;
    signInWithApple: (params: { identityToken: string; nonce?: string }) => Promise<AuthResponse>;
    isLoading: boolean;
    error: string | null;
}

export function useFirebaseAuth(): UseFirebaseAuth {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setAuthToken = useStore(state => state.setAuthToken);
    const logout = useStore(state => state.logout);

    const handleAuthResponse = useCallback(async (response: AuthResponse) => {
        if (response.error) {
            setError(response.error.message);
            return response;
        }

        if (response.user) {
            const token = await response.user.getIdToken();
            await setAuthToken(token);
        }

        setError(null);
        return response;
    }, [setAuthToken]);

    const signUp = useCallback(async (credentials: AuthCredentials) => {
        setIsLoading(true);
        try {
            const response = await authService.signUp(credentials);
            await handleAuthResponse(response);
            return response;
        } finally {
            setIsLoading(false);
        }
    }, [handleAuthResponse]);

    const signIn = useCallback(async (credentials: AuthCredentials) => {
        setIsLoading(true);
        try {
            const response = await authService.signIn(credentials);
            await handleAuthResponse(response);
            return response;
        } finally {
            setIsLoading(false);
        }
    }, [handleAuthResponse]);

    const signOut = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.signOut();
            await performanceMonitor.runAfterInteractions(async () => {
                await logout();
            }, 'Sign Out Store Update');
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const signInWithGoogle = useCallback(async (idToken: string) => {
        setIsLoading(true);
        try {
            const response = await authService.signInWithGoogle(idToken);
            await handleAuthResponse(response);
            return response;
        } finally {
            setIsLoading(false);
        }
    }, [handleAuthResponse]);

    const signInWithApple = useCallback(async (params: { identityToken: string; nonce?: string }) => {
        setIsLoading(true);
        try {
            const response = await authService.signInWithApple(params);
            await handleAuthResponse(response);
            return response;
        } finally {
            setIsLoading(false);
        }
    }, [handleAuthResponse]);

    return {
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        signInWithApple,
        isLoading,
        error
    };
}