// types/onboarding.ts
import { FontAwesome6 } from '@expo/vector-icons';
import { Slug } from 'react-native-body-highlighter';
import { PainType } from './pain';

export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export interface YogaFocus {
    id: string;
    title: string;
}

export type ImagePosition = 'center' | 'left' | 'right';

export const YOGA_FOCUSES: YogaFocus[] = [
    {
        id: 'safety',
        title: 'Enjoy yoga and avoid injury'
    },
    {
        id: 'strength',
        title: 'Build strength and support my posture'
    },
    {
        id: 'mastery',
        title: 'Challenge myself and master new poses'
    },
    {
        id: 'relaxation',
        title: 'Find calm and relaxation'
    }
];

export type InjuryStatus = 'has_injuries' | 'no_injuries' | null;

export interface OnboardingState {
    name: string;
    gender: Gender | null;
    focuses: Set<string>;
    currentStep: number;
    experience: YogaExperience | null;
    motivations: Set<string>;
    injuryStatus: InjuryStatus;
    injuries: Map<Slug, Set<PainType>>;
    comfortablePoses: Set<string>;
    goalPoses: Set<string>;
    isOnboardingComplete: boolean;
}

export type OnboardingAction =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_GENDER'; payload: Gender }
    | { type: 'SET_FOCUSES'; payload: Set<string> }
    | { type: 'SET_INJURY_STATUS'; payload: InjuryStatus }
    | { type: 'SET_STEP'; payload: number }
    | { type: 'SET_EXPERIENCE'; payload: YogaExperience }
    | { type: 'REMOVE_INJURY'; payload: Slug }
    | { type: 'SET_MOTIVATIONS'; payload: Set<string> }
    | { type: 'SET_INJURIES'; payload: Set<string> }
    | { type: 'SET_COMFORTABLE_POSES'; payload: Set<string> }
    | { type: 'SET_GOAL_POSES'; payload: Set<string> }
    | { type: 'COMPLETE_ONBOARDING' }
    | { type: 'LOAD_STATE'; payload: OnboardingState }
    | { type: 'ADD_INJURY_PAIN'; payload: { bodyPart: Slug; pains: Set<PainType> } }
    | { type: 'RESET_STATE' }

    export interface YogaExperience {
        id: string;
        level: string;
        title: string;
        description: string;
        flexibility: number;
        strength: number;
    }

export interface YogaMotivation {
    id: string;
    title: string;
    subtitle: string;
    iconName: keyof typeof FontAwesome6.glyphMap;
}

export interface YogaPose {
    id: string;
    name: string;
    sanskritName: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    imageUrl: string;
}

export interface BodyPart {
    id: string;
    name: string;
    area: {
        x: number;
        y: number;
        radius: number;
    };
}

export interface BodyPoint {
    x: number;
    y: number;
}

export interface BodyArea {
    id: string;
    name: string;
    center: BodyPoint;
    radius: number;
}