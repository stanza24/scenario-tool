import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { IScenario } from 'types';
import { isScenarioValid } from 'utils/isScenarioValid';

export interface ScenariosSlice {
  scenarios: IScenario[];
  collapsedScenariosIds: string[];
  clearScenarios: () => void;
  createScenario: () => void;
  addScenarios: (scenarios: IScenario[]) => void;
  updateScenario: (scenario: IScenario) => void;
  deleteScenario: (scenarioId: string) => void;
  moveScenario: (fromIndex: number, toIndex: number) => void;
  toggleCollapseScenario: (id: string) => void;
}

export const createScenariosSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): ScenariosSlice => ({
  scenarios: [],
  collapsedScenariosIds: [],
  clearScenarios: () => {
    set((state) => {
      state.scenarios = [];
    });
  },
  createScenario: () => {
    set((state) => {
      state.scenarios.push({
        id: uuidV4(),
        name: 'Scenario',
        init: '0',
        operations: [],
      });
    });
  },
  addScenarios: (scenarios: IScenario[]) => {
    set((state) => {
      scenarios.forEach((scenario) => {
        if (
          !state.scenarios.find((sc) => sc.id === scenario.id) &&
          isScenarioValid(scenario)
        ) {
          state.scenarios.push(scenario);
        }
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
  toggleCollapseScenario: (id: string) => {
    set((state) => {
      const index = state.collapsedScenariosIds.findIndex(
        (scId) => scId === id
      );

      if (index === -1) {
        state.collapsedScenariosIds.push(id);
      } else {
        state.collapsedScenariosIds.splice(index, 1);
      }
    });
  },
});
