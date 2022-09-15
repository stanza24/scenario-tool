export enum ERateType {
  MUL = 'MUL',
  DIV = 'DIV',
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
  init: string;
  operations: IOperation[];
}
