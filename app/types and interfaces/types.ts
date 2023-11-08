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
}

export type Exercise = {
    hidden: boolean;
    isometric: boolean;
    name: string;
    musclesWorked: string[];
    unilateral: boolean;
}


export type ExerciseSet = {
    exercise : string[],
    weights: number[],
    reps: number[],
    times: number[],
    restTimes: number[],
    sides: string[]
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
    start: Date;
    end: Date;
  }