export interface IOperation {
  id: string;
  name: string;
  rate: number | null;
}

export interface IOperationWithResult extends IOperation {
  result: number;
}

export interface IScenario {
  id: string;
  init: number | null;
  operations: IOperation[];
}
