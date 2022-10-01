export enum ERateType {
  MUL = 'MUL',
  DIV = 'DIV',
  ADD_RAW = 'ADD_RAW',
  SUB_RAW = 'SUB_RAW',
  ADD_PERC = 'PLUS_PERC',
  SUB_PERC = 'SUB_PERC',
}

export interface IOperation {
  id: string;
  name: string;
  rate: string;
  rateType: ERateType;
}

export interface IOperationWithResult extends IOperation {
  result: number;
}

export interface IScenario {
  id: string;
  name?: string;
  init: string;
  operations: IOperation[];
}
