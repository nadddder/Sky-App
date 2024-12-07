import { Slug } from "react-native-body-highlighter";

export type PainType =
    | 'spasm'
    | 'soreness'
    | 'numbness'
    | 'tightness'
    | 'stiffness'
    | 'sharp_pain'
    | 'swelling'
    | 'burning'
    | 'radiating_pain'
    | 'clicking';

export interface InjuryPain {
    bodyPart: Slug;
    pains: Set<PainType>;
}

export interface BodyPartPain {
    id: Slug;
    name: string;
    pains: Set<PainType>;
}