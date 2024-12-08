// src/services/auth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithCredential,
    AuthError,
    UserCredential,
    OAuthProvider,
    User
} from 'firebase/auth';
import { auth } from '~/lib/firebase/config';
import { performanceMonitor } from './performance';

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User | null;
    error?: {
        code: string;
        message: string;
    };
}

class AuthService {
    private googleProvider: GoogleAuthProvider;
    private appleProvider: OAuthProvider;

    constructor() {
        this.googleProvider = new GoogleAuthProvider();
        this.appleProvider = new OAuthProvider('apple.com');
    }

    private handleAuthError(error: AuthError): AuthResponse {
        console.error('Auth error:', error);

        // Map Firebase error codes to user-friendly messages
        const errorMessages: Record<string, string> = {
            'auth/email-already-in-use': 'This email is already registered',
            'auth/invalid-email': 'Please enter a valid email address',
            'auth/operation-not-allowed': 'Email/password accounts are not enabled',
            'auth/weak-password': 'Please choose a stronger password',
            'auth/user-disabled': 'This account has been disabled',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-credential': 'Invalid credentials',
            'auth/too-many-requests': 'Too many attempts. Please try again later',
        };

        return {
            user: null,
            error: {
                code: error.code,
                message: errorMessages[error.code] || 'An error occurred during authentication'
            }
        };
    }

    private handleAuthSuccess(userCredential: UserCredential): AuthResponse {
        return {
            user: userCredential.user
        };
    }

    async signUp(credentials: AuthCredentials): Promise<AuthResponse> {
        return performanceMonitor.runAfterInteractions(async () => {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password
                );
                return this.handleAuthSuccess(userCredential);
            } catch (error) {
                return this.handleAuthError(error as AuthError);
            }
        }, 'Sign Up');
    }

    async signIn(credentials: AuthCredentials): Promise<AuthResponse> {
        return performanceMonitor.runAfterInteractions(async () => {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password
                );
                return this.handleAuthSuccess(userCredential);
            } catch (error) {
                return this.handleAuthError(error as AuthError);
            }
        }, 'Sign In');
    }

    async signOut(): Promise<void> {
        return performanceMonitor.runAfterInteractions(async () => {
            try {
                await firebaseSignOut(auth);
            } catch (error) {
                console.error('Error signing out:', error);
                throw error;
            }
        }, 'Sign Out');
    }

    async signInWithGoogle(idToken: string): Promise<AuthResponse> {
        return performanceMonitor.runAfterInteractions(async () => {
            try {
                const credential = GoogleAuthProvider.credential(idToken);
                const userCredential = await signInWithCredential(auth, credential);
                return this.handleAuthSuccess(userCredential);
            } catch (error) {
                return this.handleAuthError(error as AuthError);
            }
        }, 'Google Sign In');
    }

    async signInWithApple(params: { identityToken: string; nonce?: string }): Promise<AuthResponse> {
        return performanceMonitor.runAfterInteractions(async () => {
            try {
                const credential = this.appleProvider.credential({
                    idToken: params.identityToken,
                    rawNonce: params.nonce
                });
                const userCredential = await signInWithCredential(auth, credential);
                return this.handleAuthSuccess(userCredential);
            } catch (error) {
                return this.handleAuthError(error as AuthError);
            }
        }, 'Apple Sign In');
    }
}

export const authService = new AuthService();