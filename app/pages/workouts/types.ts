export type SelectOption = {
    label: string;
    value: string;
    unilateral: boolean,
    isometric: boolean
}

export type ExerciseLog = {
    exercise : SelectOption[],
    weights: number[],
    reps: number[],
    times: number[],
    restTimes: number[],
    sides: string[];
    [key: string]: any;
}

export type WorkoutTypes = {
    'Full body': string[],
    'Push': string[],
    'Pull': string[],
    'Leg': string[],
    'Back' : string[],
    'Chest' : string[],
    'Bicep' : string[],
    'Tricep' : string[],
    'Shoulder': string[],
    'Ab' : string[],
    'Arm' : string[],
    'Forearm': string[],
    'Upper body': string[],
    'Full body pull' : string[],
    'Full body push' : string[],
    [key: string]: any
}