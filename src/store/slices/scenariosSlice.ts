import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { ERateType, IOperation, IScenario } from 'types';

export interface ScenariosSlice {
  scenarios: IScenario[];
  clearScenarios: () => void;
  addScenario: () => void;
  updateScenario: (scenario: IScenario) => void;
  deleteScenario: (scenarioId: string) => void;
  addOperation: (scenarioId: string) => void;
  updateOperation: (scenarioId: string, operation: IOperation) => void;
  deleteOperation: (scenarioId: string, operationId: string) => void;
}

export const createScenariosSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): ScenariosSlice => ({
  scenarios: [],
  clearScenarios: () => {
    set((state) => {
      state.scenarios = [];
    });
  },
  addScenario: () => {
    set((state) => {
      state.scenarios.push({
        id: uuidV4(),
        init: '0',
        operations: [],
      });
    });
  },
  updateScenario: (scenario) => {
    set((state) => {
      const index = state.scenarios.findIndex((sc) => sc.id === scenario.id);
      state.scenarios[index] = scenario;
    });
  },
  deleteScenario: (scenarioId: string) => {
    set((state) => {
      const index = state.scenarios.findIndex((sc) => sc.id === scenarioId);
      state.scenarios = [
        ...state.scenarios.slice(0, index),
        ...state.scenarios.slice(index + 1),
      ];
    });
  },
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
});
