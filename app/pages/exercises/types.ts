export type TableRow = (string | number)[];

export type TableState = {
  tableHead: string[];
  tableData: TableRow[];
};

export type ExerciseRecords = {
    weights: number[],
    reps: number[],
    times: number[],
    dates: string[],
};

export type ExerciseSet = {
    exercise? : string,
    weight: number,
    rep: number,
    time: number,
    restTime: number,
    side?: "both" | "left" | "right";
};

export type Outputs = {
    setNumbers: string[];
    reps : string[];
    seconds: string[];
    weights:string[];
    names: string[];
    sides: string[];
}