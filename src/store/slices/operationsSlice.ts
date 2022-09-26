import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { ERateType, IOperation } from 'types';

export interface OperationsSlice {
  addOperation: (scenarioId: string) => void;
  updateOperation: (scenarioId: string, operation: IOperation) => void;
  deleteOperation: (scenarioId: string, operationId: string) => void;
  moveOperation: (
    scenarioId: string,
    startIndex: number,
    toIndex: number
  ) => void;
}

export const createOperationsSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): OperationsSlice => ({
  addOperation: (scenarioId: string) => {
    set((state) => {
      const scIndex = state.scenarios.findIndex((sc) => sc.id === scenarioId);

      state.scenarios[scIndex].operations.push({
        id: uuidV4(),
        name: '',
        rate: '1',
        rateType: ERateType.MUL,
      });
    });
  },
  updateOperation: (scenarioId, operation) => {
    set((state) => {
      const scIndex = state.scenarios.findIndex((sc) => sc.id === scenarioId);
      const opIndex = state.scenarios[scIndex].operations.findIndex(
        (tr: IOperation) => tr.id === operation.id
      );
      state.scenarios[scIndex].operations[opIndex] = operation;
    });
  },
  deleteOperation: (scenarioId: string, operationId: string) => {
    set((state) => {
      const scIndex = state.scenarios.findIndex((sc) => sc.id === scenarioId);
      const opIndex = state.scenarios[scIndex].operations.findIndex(
        (tr: IOperation) => tr.id === operationId
      );
      state.scenarios[scIndex].operations = [
        ...state.scenarios[scIndex].operations.slice(0, opIndex),
        ...state.scenarios[scIndex].operations.slice(opIndex + 1),
      ];
    });
  },
  moveOperation: (scenarioId: string, fromIndex: number, toIndex: number) => {
    set((state) => {
      const scenario = state.scenarios.find(
        (scenario) => scenario.id === scenarioId
      );
      if (!scenario) return;

      const [removed] = scenario.operations.splice(fromIndex, 1);
      scenario.operations.splice(toIndex, 0, removed);
    });
  },
});
