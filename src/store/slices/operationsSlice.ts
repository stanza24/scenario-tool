import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { OP_COLORS } from 'const';
import { ERateType, IOperation } from 'types';

export interface OperationsSlice {
  operations: Record<string, IOperation>;
  createOperation: (scenarioId: string) => void;
  updateOperation: (operation: IOperation) => void;
  removeOperationFromScenario: (
    scenarioId: string,
    operationId: string
  ) => void;
  moveOperation: (
    scenarioId: string,
    startIndex: number,
    toIndex: number
  ) => void;
  copyOperation: (
    scenarioId: string,
    operationId: string,
    toIndex: number
  ) => void;
  colors: Record<string, boolean>;
  getFreeColor: () => string | undefined;
  releaseColor: (color: string) => void;
}

export const createOperationsSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): OperationsSlice => ({
  operations: {},
  createOperation: (scenarioId: string) => {
    set((state) => {
      const operation = {
        id: uuidV4(),
        name: '',
        rate: '1',
        rateType: ERateType.MUL,
        usage: 1,
        color: null,
      };

      state.operations[operation.id] = operation;

      state.scenarios[scenarioId].operations.push(operation.id);
    });
  },
  updateOperation: (operation) => {
    set((state) => {
      state.operations[operation.id] = operation;
    });
  },
  removeOperationFromScenario: (scenarioId: string, operationId: string) => {
    set((state) => {
      const opIndex =
        state.scenarios[scenarioId].operations.indexOf(operationId);

      if (opIndex === -1) return;

      state.scenarios[scenarioId].operations.splice(opIndex, 1);

      const op = state.operations[operationId];

      switch (op.usage) {
        case 1: {
          delete state.operations[operationId];
          return;
        }
        case 2: {
          op.color && state.releaseColor(op.color);
          op.color = null;
          op.usage = 1;
          return;
        }
        default: {
          op.usage = op.usage - 1;
        }
      }
    });
  },
  moveOperation: (scenarioId: string, fromIndex: number, toIndex: number) => {
    set((state) => {
      const scenario = state.scenarios[scenarioId];
      if (!scenario) return;

      const [removed] = scenario.operations.splice(fromIndex, 1);
      scenario.operations.splice(toIndex, 0, removed);
    });
  },
  copyOperation: (scenarioId: string, operationId: string, toIndex: number) => {
    set((state) => {
      const scenario = state.scenarios[scenarioId];
      if (!scenario) return;

      scenario.operations.splice(toIndex, 0, operationId);

      const op = state.operations[operationId];
      op.usage = op.usage + 1;

      if (!op.color && op.usage > 1) {
        const color = state.getFreeColor();

        if (color) {
          op.color = color;
          state.colors[color] = false;
        }
      }
    });
  },
  colors: OP_COLORS.reduce((acc, color) => ({ ...acc, [color]: true }), {}),
  getFreeColor: () => {
    for (let color of Object.keys(get().colors)) {
      if (get().colors[color]) {
        return color;
      }
    }
  },
  releaseColor: (color: string) => {
    set((state) => {
      state.colors[color] = true;
    });
  },
});
