import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { IOperation, IScenario } from 'types';
import { isOperationValid, isScenarioValid } from 'utils/isScenarioValid';
import { OP_COLORS } from '../../components/const';

export interface ScenariosSlice {
  scenarios: Record<string, IScenario>;
  collapsedScenariosIds: string[];
  clearScenarios: () => void;
  createScenario: () => void;
  importScenarios: ({
    scenarios,
    operations,
  }: {
    scenarios: IScenario[];
    operations: IOperation[];
  }) => void;
  updateScenario: (scenario: IScenario) => void;
  deleteScenario: (scenarioId: string, clearAloneOps: boolean) => void;
  moveScenario: (fromIndex: number, toIndex: number) => void;
  toggleCollapseScenario: (id: string) => void;
}

export const createScenariosSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): ScenariosSlice => ({
  scenarios: {},
  collapsedScenariosIds: [],
  clearScenarios: () => {
    set((state) => {
      state.scenarios = {};
      state.operations = {};
      state.colors = OP_COLORS.reduce(
        (acc, color) => ({ ...acc, [color]: true }),
        {}
      );
    });
  },
  createScenario: () => {
    set((state) => {
      const newScenario = {
        id: uuidV4(),
        order: Object.keys(state.scenarios).length,
        name: 'Scenario',
        init: '0',
        operations: [],
      };

      state.scenarios[newScenario.id] = newScenario;
    });
  },
  importScenarios: ({
    scenarios,
    operations,
  }: {
    scenarios: IScenario[];
    operations: IOperation[];
  }) => {
    set((state) => {
      operations.forEach((operation) => {
        if (!state.operations[operation.id] && isOperationValid(operation)) {
          state.operations[operation.id] = operation;
        }
      });

      scenarios.forEach((scenario) => {
        if (!state.scenarios[scenario.id] && isScenarioValid(scenario)) {
          state.scenarios[scenario.id] = scenario;
        }
      });
    });
  },
  updateScenario: (scenario) => {
    set((state) => {
      state.scenarios[scenario.id] = scenario;
    });
  },
  deleteScenario: (scenarioId: string, clearAloneOps: boolean) => {
    set((state) => {
      if (clearAloneOps) {
        state.scenarios[scenarioId].operations.forEach((opId) => {
          if (state.operations[opId].usage === 1)
            state.removeOperationFromScenario(scenarioId, opId);
        });
      }

      delete state.scenarios[scenarioId];
    });
  },
  moveScenario: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const scenarios = Object.values(state.scenarios);
      const fromSc = scenarios.find((sc) => sc.order === fromIndex);

      if (fromSc)
        state.scenarios[fromSc.id] = {
          ...state.scenarios[fromSc.id],
          order: toIndex,
        };

      if (toIndex > fromIndex) {
        for (let i = fromIndex + 1; i <= toIndex; i++) {
          const sc = scenarios.find((sc) => sc.order === i);

          if (sc)
            state.scenarios[sc.id] = {
              ...state.scenarios[sc.id],
              order: sc.order - 1,
            };
        }
      } else {
        for (let i = toIndex; i < fromIndex; i++) {
          const sc = scenarios.find((sc) => sc.order === i);
          if (sc)
            state.scenarios[sc.id] = {
              ...state.scenarios[sc.id],
              order: sc.order + 1,
            };
        }
      }
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
