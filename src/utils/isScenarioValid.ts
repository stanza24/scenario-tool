import { IOperation, IScenario } from 'types';

export const isOperationValid = (operation: Partial<IOperation>): boolean =>
  typeof operation.rate === 'string' &&
  typeof operation.name === 'string' &&
  typeof operation.id === 'string';

export const isScenarioValid = (scenario: Partial<IScenario>): boolean =>
  typeof scenario.init === 'string' && scenario.nodes !== undefined;
