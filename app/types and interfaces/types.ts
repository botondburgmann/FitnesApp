import { NavigationProp } from "@react-navigation/native";

export type RouterProps = {
    navigation: NavigationProp<any, any>;
}

export type SelectItem = {
    label: string
    value: string
}

export type MaxValueAndIndex = {
    value: number;
    index: number;
}

export type BestExercise = {
    name: string;
    weights: number;
    reps: number;
    [key: string]: any;

}

export type SetChange = {
    side : string;
    weight : number;
    rep? :  number;
    time :  number;
    restTime : number;
    [key: string]: any;

}

export type Exercise = {
    hidden: boolean;
    isometric: boolean;
    name: string;
    musclesWorked: string[];
    unilateral: boolean;
    [key: string]: any;
}


export type ExerciseSet = {
    exercise : string[],
    weights: number[],
    reps: number[],
    times: number[],
    restTimes: number[],
    sides: string[];
    [key: string]: any;
}

export type MyUser = {
    activityLevel: string;
    age: number;
    experience: number;
    gender: string;
    height: number;
    level: number;
    name: string;
    weeklyExperience:number;
    weight: number;
    userID: string;
}

export type ExerciseRecords = {
    weights: number[],
    reps: number[],
    times: number[],
    dates: string[],
}

export type ExerciseSelectOption = {
    label: string;
    value: string;
    unilateral: boolean,
    isometric: boolean
}
export type TableRow = (string | number)[]; // Define a type for a single row

export type TableState = {
  tableHead: string[];
  tableData: TableRow[]; // Use the TableRow type for tableData
}

export type WeekRange = {
    start: string;
    end: string;
  }

export type Achievement = {
    color: string;
    description: string;
    icon: string;
    level: number;
    name: string;
    status: string;
    visibility: number;
}

export type Outputs = {
    setNumbers: string[];
    reps : string[];
    seconds: string[];
    weights:string[];
    names: string[];
    sides: string[];
}

export type MuscleGroups = {
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