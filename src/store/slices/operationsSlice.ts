import { v4 as uuidV4 } from 'uuid';
import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { IOperation } from 'types';

export interface OperationsSlice {
  operations: Record<string, IOperation>;
  createOperation: (
    scenarioId: string,
    toIndex?: number,
    cloningId?: string
  ) => void;
  updateOperation: (operation: IOperation) => void;
  removeNodeFromScenario: (scenarioId: string, operationId: string) => void;
  reorderNode: (
    scenarioId: string,
    startIndex: number,
    toIndex: number
  ) => void;
  applyOperationAsNode: (
    scenarioId: string,
    operationId: string,
    toIndex: number
  ) => void;
  deleteOperation: (operationId: string) => void;
}

export const createOperationsSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): OperationsSlice => ({
  operations: {},
  createOperation: (scenarioId: string, toIndex?: number) => {
    const operation: IOperation = {
      id: uuidV4(),
      usage: 1,
      color: null,
      name: '-',
      rate: '1',
    };

    set((state) => {
      state.operations[operation.id] = operation;
    });

    get().attachNode(scenarioId, operation.id, toIndex);
  },
  updateOperation: (operation: IOperation) => {
    set((state) => {
      state.operations[operation.id] = operation;
    });
  },
  removeNodeFromScenario: (scenarioId: string, operationId: string) => {
    const opIndex = get().scenarios[scenarioId].nodes.findIndex(
      (node) => node.opId === operationId
    );

    if (opIndex === -1) return;

    set((state) => {
      state.scenarios[scenarioId].nodes.splice(opIndex, 1);

      const op = state.operations[operationId];

      if (op.usage === 2 && op.color) {
        state.releaseColor(op.color, state);

        state.operations[operationId].color = null;
      }

      op.usage = op.usage - 1;
    });
  },
  reorderNode: (scenarioId: string, fromIndex: number, toIndex: number) => {
    set((state) => {
      const scenario = state.scenarios[scenarioId];
      if (!scenario) return;

      const [removed] = scenario.nodes.splice(fromIndex, 1);
      scenario.nodes.splice(toIndex, 0, removed);
    });
  },
  applyOperationAsNode: (
    scenarioId: string,
    operationId: string,
    toIndex: number
  ) => {
    const scenario = get().scenarios[scenarioId];
    if (!scenario) return;

    get().attachNode(scenarioId, operationId, toIndex);

    set((state) => {
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
  deleteOperation: (operationId: string) => {
    Object.values(get().scenarios).forEach((scenario) => {
      const nodeIndex = scenario.nodes.findIndex(
        (node) => node.opId === operationId
      );

      if (nodeIndex !== -1) {
        set((state) => {
          state.scenarios[scenario.id].nodes.splice(nodeIndex, 1);
        });
      }
    });

    set((state) => {
      delete state.operations[operationId];
    });
  },
});
