import { ERateType, IOperation, IScenario } from 'types';

export const isOperationValid = (operation: Partial<IOperation>): boolean =>
  Object.values(ERateType).includes(operation.rateType as ERateType) &&
  typeof operation.rate === 'string' &&
  typeof operation.name === 'string' &&
  typeof operation.id === 'string';

export const isScenarioValid = (scenario: Partial<IScenario>): boolean =>
  typeof scenario.init === 'string' &&
  scenario.operations !== undefined &&
  scenario.operations.every((op) => isOperationValid(op));
