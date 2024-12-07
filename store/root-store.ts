// stores/root-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OnboardingState, OnboardingAction } from '~/types/onboarding'
import { performanceMonitor } from '~/services/performance'
import { Slug } from 'react-native-body-highlighter'
import { PainType } from '~/types/pain'

interface RootState extends OnboardingState {
    // Authentication state
    isAuthenticated: boolean;
    authToken?: string;

    // User preferences
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;

    // Hydration status
    _hasHydrated: boolean;

    // Actions
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setNotifications: (enabled: boolean) => void;
    setAuthToken: (token: string | undefined) => void;
    logout: () => void;

    // Onboarding actions (migrated from context)
    dispatch: (action: OnboardingAction) => void;
}

const initialState: Omit<RootState, 'dispatch' | 'setTheme' | 'setNotifications' | 'setAuthToken' | 'logout'> = {
    // Onboarding state
    name: '',
    gender: null,
    focuses: new Set<string>(),
    experience: null,
    injuryStatus: null,
    motivations: new Set<string>(),
    injuries: new Map(),
    comfortablePoses: new Set<string>(),
    goalPoses: new Set<string>(),
    isOnboardingComplete: false,
    currentStep: 1,

    // Auth & Preferences
    isAuthenticated: false,
    theme: 'system',
    notifications: true,
    _hasHydrated: false,
};

// Helper function to handle onboarding state updates
const handleOnboardingAction = (state: RootState, action: OnboardingAction): Partial<RootState> => {
    switch (action.type) {
        case 'SET_NAME':
            return { name: action.payload };
        case 'SET_GENDER':
            return { gender: action.payload };
        case 'SET_FOCUSES':
            return {
                focuses: action.payload instanceof Set
                    ? action.payload
                    : new Set(action.payload)
            };
        case 'SET_INJURY_STATUS':
            return {
                injuryStatus: action.payload,
                injuries: action.payload === 'no_injuries' ? new Map() : state.injuries
            };
        case 'SET_STEP':
            return { currentStep: action.payload };
        case 'SET_EXPERIENCE':
            return { experience: action.payload };
        case 'SET_MOTIVATIONS':
            return { motivations: action.payload };
        case 'ADD_INJURY_PAIN': {
            const newInjuries = new Map(state.injuries);
            newInjuries.set(action.payload.bodyPart, action.payload.pains);
            return { injuries: newInjuries };
        }
        case 'REMOVE_INJURY': {
            const newInjuries = new Map(state.injuries);
            newInjuries.delete(action.payload);
            return { injuries: newInjuries };
        }
        case 'SET_COMFORTABLE_POSES':
            return { comfortablePoses: action.payload };
        case 'SET_GOAL_POSES':
            return { goalPoses: action.payload };
        case 'COMPLETE_ONBOARDING':
            return { isOnboardingComplete: true };
        case 'RESET_STATE':
            return { ...initialState, currentStep: 1 };
        default:
            return state;
    }
};

export const useStore = create<RootState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setTheme: (theme) => set({ theme }),
            setNotifications: (enabled) => set({ notifications: enabled }),

            setAuthToken: (token) => {
                performanceMonitor.runAfterInteractions(async () => {
                    set({
                        authToken: token,
                        isAuthenticated: !!token
                    });
                }, 'Set Auth Token');
            },

            logout: () => {
                performanceMonitor.runAfterInteractions(async () => {
                    set({
                        authToken: undefined,
                        isAuthenticated: false
                    });
                }, 'Logout');
            },

            dispatch: (action: OnboardingAction) => {
                performanceMonitor.runAfterInteractions(async () => {
                    const currentState = get();
                    switch (action.type) {
                        case 'RESET_STATE':
                            set({ ...initialState, currentStep: 1, _hasHydrated: true });
                            break;
                        default:
                            const updates = handleOnboardingAction(currentState, action);
                            set((state) => ({
                                ...state,
                                ...updates
                            }));
                    }
                }, `Onboarding Action: ${action.type}`);
            }
        }),
        {
            name: 'yoga-app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                // Ensure we're including name in persistence
                name: state.name,
                authToken: state.authToken,
                isAuthenticated: state.isAuthenticated,
                theme: state.theme,
                notifications: state.notifications,
                gender: state.gender,
                focuses: Array.from(state.focuses),
                experience: state.experience,
                injuryStatus: state.injuryStatus,
                motivations: Array.from(state.motivations),
                injuries: Array.from(state.injuries.entries()).map(([key, value]) => ({
                    bodyPart: key,
                    pains: Array.from(value)
                })),
                comfortablePoses: Array.from(state.comfortablePoses),
                goalPoses: Array.from(state.goalPoses),
                isOnboardingComplete: state.isOnboardingComplete,
                currentStep: state.currentStep,
            }),
            version: 1,
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Convert arrays back to Sets after rehydration
                    state.focuses = new Set(state.focuses);

                    // Handle injuries Map conversion
                    // The rehydrated data comes in the format we defined in partialize
                    type RehydratedInjury = {
                        bodyPart: Slug;
                        pains: PainType[];
                    };

                    const rehydratedInjuries = state.injuries as unknown as RehydratedInjury[];
                    state.injuries = new Map(
                        rehydratedInjuries.map(({ bodyPart, pains }) => [
                            bodyPart,
                            new Set(pains)
                        ])
                    );

                    state._hasHydrated = true;
                    // Log rehydration for debugging
                    console.log('Store rehydrated:', state.name);
                }
            },
        })
)


// Custom hook for hydration status
export const useHydration = () => {
    const hasHydrated = useStore((state) => state._hasHydrated);
    return hasHydrated;
};

// Selector hooks for better performance
export const useOnboardingState = () => useStore((state) => ({
    name: state.name,
    gender: state.gender,
    focuses: state.focuses,
    experience: state.experience,
    injuryStatus: state.injuryStatus,
    motivations: state.motivations,
    injuries: state.injuries,
    comfortablePoses: state.comfortablePoses,
    goalPoses: state.goalPoses,
    isOnboardingComplete: state.isOnboardingComplete,
    currentStep: state.currentStep,
    dispatch: state.dispatch,
}));

export const useAuthState = () => useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    authToken: state.authToken,
    setAuthToken: state.setAuthToken,
    logout: state.logout,
}));

export const usePreferences = () => useStore((state) => ({
    theme: state.theme,
    notifications: state.notifications,
    setTheme: state.setTheme,
    setNotifications: state.setNotifications,
}));