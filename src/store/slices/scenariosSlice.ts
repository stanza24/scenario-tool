import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { IScenario } from 'types';

export interface ScenariosSlice {
  scenarios: IScenario[];
  clearScenarios: () => void;
  addScenario: () => void;
  updateScenario: (scenario: IScenario) => void;
  deleteScenario: (scenarioId: string) => void;
  moveScenario: (fromIndex: number, toIndex: number) => void;
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
  moveScenario: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const [removed] = state.scenarios.splice(fromIndex, 1);
      state.scenarios.splice(toIndex, 0, removed);
    });
  },
});
