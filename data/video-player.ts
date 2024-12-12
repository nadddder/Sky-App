// src/constants/exercises.ts
export const EXERCISE_SEQUENCE = [
    "W059", "FSp001", "CSp001", "TransitionSptoSd004", "W025",
    "TransitionSdtoAf002", "W049", "W064", "W062", "FSg003",
    "TransitionSgtoSd003", "FSd001", "BSd000", "CSd008", "BSp008",
    "TSp003", "In022", "W072"
] as const;

export const EXERCISE_DATA = [
    {
        id: 0,
        title: 'Beginner Hip Opening',
        image: require('~/assets/images/poses/flexibility/beginner-1.png'),
        videoId: EXERCISE_SEQUENCE[0]
    },
    {
        id: 1,
        title: 'Intermediate Flow',
        image: require('~/assets/images/poses/flexibility/intermediate-1.png'),
        videoId: EXERCISE_SEQUENCE[1]
    },
    {
        id: 2,
        title: 'Advanced Sequence',
        image: require('~/assets/images/poses/flexibility/advanced-1.png'),
        videoId: EXERCISE_SEQUENCE[2]
    },
    {
        id: 3,
        title: 'Expert Challenge',
        image: require('~/assets/images/poses/flexibility/expert-1.png'),
        videoId: EXERCISE_SEQUENCE[3]
    },
] as const;

// Type for individual exercise data
export type ExerciseData = typeof EXERCISE_DATA[number];
// Type for exercise sequence
export type ExerciseSequence = typeof EXERCISE_SEQUENCE[number];