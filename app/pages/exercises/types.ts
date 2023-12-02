export type TableRow = (string | number)[];

export type TableState = {
  tableHead: string[];
  tableData: TableRow[];
};

export type SingleSet = {
	exercise: string,
	reps: number;
	restTime: number;
	side: "both" | "left" | "right";
	time: number;
	weight: number;
    [key: string]: any,
}

export type Outputs = {
    setNumbers: string[];
    reps : string[];
    seconds: string[];
    weights:string[];
    names: string[];
    sides: string[];
}