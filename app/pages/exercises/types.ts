export type TableRow = (string | number)[];

export type TableState = {
  tableHead: string[];
  tableData: TableRow[];
};

export type Outputs = {
    setNumbers: string[];
    reps : string[];
    seconds: string[];
    weights:string[];
    names: string[];
    sides: string[];
}