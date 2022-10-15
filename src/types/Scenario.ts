/**
 * Возможные операции в ноде
 */
export enum ERateType {
  MUL = 'MUL',
  DIV = 'DIV',
  ADD = 'ADD',
  SUB = 'SUB',
  ADD_PERC = 'PLUS_PERC',
  SUB_PERC = 'SUB_PERC',
}

/**
 * Модель операции
 */
export interface IOperation {
  id: string;
  name: string;
  rate: string;
  usage: number;
  color: string | null;
}

export interface IOperationWithResult extends IOperation {
  rateType: ERateType;
  result: number;
}

/**
 * Звено связки
 */
export interface IScenarioNode {
  opId: string;
  rateType: ERateType;
}

export interface IScenario {
  id: string;
  order: number;
  name?: string;
  init: string;
  nodes: IScenarioNode[];
}
