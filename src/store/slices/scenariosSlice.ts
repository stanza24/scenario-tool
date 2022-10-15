import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { OP_COLORS } from 'const';
import { ERateType, IOperation, IScenario, IScenarioNode } from 'types';
import { isOperationValid, isScenarioValid } from 'utils';

export interface ScenariosSlice {
  scenarios: Record<string, IScenario>;
  collapsedScenariosIds: string[];
  displayedScenariosIds: string[];
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
  deleteScenario: (scenarioId: string) => void;
  moveScenario: (fromIndex: number, toIndex: number) => void;
  toggleCollapseScenario: (id: string) => void;
  toggleDisplayScenario: (id: string, order?: number) => void;
  attachNode: (scenarioId: string, opId: string, toIndex?: number) => void;
  updateNode: (scenarioId: string, node: IScenarioNode) => void;
}

export const createScenariosSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): ScenariosSlice => ({
  scenarios: {},
  collapsedScenariosIds: [],
  displayedScenariosIds: [],
  clearScenarios: () => {
    set((state) => {
      state.scenarios = {};
      state.collapsedScenariosIds = [];
      state.displayedScenariosIds = [];
      state.operations = {};
      state.colors = OP_COLORS.reduce(
        (acc, color) => ({ ...acc, [color]: true }),
        {}
      );
    });
  },
  createScenario: () => {
    set((state) => {
      const newScenario: IScenario = {
        id: uuidV4(),
        order: Object.keys(state.scenarios).length,
        name: 'Default name',
        init: '0',
        nodes: [],
      };

      state.scenarios[newScenario.id] = newScenario;
      state.displayedScenariosIds.push(newScenario.id);
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
  deleteScenario: (scenarioId: string) => {
    get().scenarios[scenarioId].nodes.forEach((node) => {
      const op = get().operations[node.opId];

      if (op.usage === 2 && op.color) {
        get().releaseColor(op.color);

        set((state) => {
          state.operations[node.opId].color = null;
        });
      }

      set((state) => {
        state.operations[node.opId].usage = op.usage - 1;
      });
    });

    set((state) => {
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
  toggleDisplayScenario: (id: string, order?: number) => {
    set((state) => {
      const index = state.displayedScenariosIds.findIndex(
        (scId) => scId === id
      );

      if (index === -1) {
        if (order === undefined) {
          state.displayedScenariosIds.push(id);
        } else {
          state.displayedScenariosIds.splice(order, 0, id);
        }
      } else {
        state.displayedScenariosIds.splice(index, 1);
      }
    });
  },
  attachNode: (scenarioId: string, opId: string, toIndex?: number) => {
    set((state) => {
      const node = {
        opId,
        rateType: ERateType.MUL,
      };

      if (toIndex) {
        state.scenarios[scenarioId].nodes.splice(toIndex, 0, node);
      } else {
        state.scenarios[scenarioId].nodes.push(node);
      }
    });
  },
  updateNode: (scenarioId: string, node: IScenarioNode) => {
    set((state) => {
      const nodeIndex = state.scenarios[scenarioId]?.nodes.findIndex(
        (nd) => nd.opId === node.opId
      );

      if (nodeIndex !== -1) {
        state.scenarios[scenarioId].nodes[nodeIndex] = node;
      }
    });
  },
});
