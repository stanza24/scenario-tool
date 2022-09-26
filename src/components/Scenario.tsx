import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';

import { ScenarioOperation } from './ScenarioOperation';
import { useStore } from 'store';
import {
  EDroppableId,
  IOperation,
  IOperationWithResult,
  IScenario,
} from 'types';
import { calculateResultWithRate } from 'utils';

import {
  ArrowDownOutlined,
  DeleteOutlined,
  HolderOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, Modal, Typography } from 'antd';

import styles from './Scenario.module.css';
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

interface Props {
  scenario: IScenario;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const Scenario = ({ scenario, dragHandleProps }: Props) => {
  const [deleteScenarioModalVisible, setDeleteScenarioModalVisible] =
    useState<boolean>(false);

  const [
    deleteScenario,
    updateScenario,
    addOperation,
    updateOperation,
    deleteOperation,
    moveOperation,
  ] = useStore(
    (store) => [
      store.deleteScenario,
      store.updateScenario,
      store.addOperation,
      store.updateOperation,
      store.deleteOperation,
      store.moveOperation,
    ],
    shallow
  );

  const operationsWithResult: IOperationWithResult[] = useMemo(() => {
    const ops: IOperationWithResult[] = [];

    for (let op of scenario.operations) {
      ops.push({
        ...op,
        result: calculateResultWithRate(
          op.rateType,
          op.rate,
          ops.at(-1)?.result || Number(scenario.init) || 0
        ),
      });
    }

    return ops;
  }, [scenario.operations, scenario.init]);

  const handleChangeInit = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    updateScenario({
      ...scenario,
      init: value || '',
    });

  const handleAddOperation = (): void => addOperation(scenario.id);

  const handleDeleteOperation = useCallback(
    (operationId: string): void => {
      deleteOperation(scenario.id, operationId);
    },
    [scenario.id]
  );

  const handleUpdateOperation = useCallback(
    (operation: IOperation): void => {
      updateOperation(scenario.id, operation);
    },
    [scenario.id, updateOperation]
  );

  const handleFixDecimals = () => {
    updateScenario({
      ...scenario,
      init: String(Number(Number(scenario.init).toFixed(2))),
    });
  };

  const handleDragEnd = ({
    source: { index: dragOrder },
    destination,
  }: DropResult) => {
    if (!destination) return;

    const { droppableId, index: dropOrder } = destination;

    if (droppableId === EDroppableId.OPERATION_LIST && dragOrder !== dropOrder)
      moveOperation(scenario.id, dragOrder, dropOrder);
  };

  const renderSpread = () => {
    if (scenario.init && scenario.init !== '0') {
      const lastOperationResult =
        operationsWithResult.at(-1)?.result || +scenario.init;

      return `Spread: ${Math.round(lastOperationResult - +scenario.init)} / ${(
        ((lastOperationResult - +scenario.init || 0) * 100) /
        +scenario.init
      ).toFixed(2)}%`;
    }

    return null;
  };

  return (
    <div className={styles.scenario}>
      <div className={styles.dragRow} {...(dragHandleProps || {})}>
        <HolderOutlined />
      </div>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => setDeleteScenarioModalVisible(true)}
        className={styles.scenarioButton}
      >
        Delete scenario
      </Button>
      <Divider />
      <Input
        type="number"
        step="0.01"
        placeholder="Enter input value"
        value={scenario.init!}
        onChange={handleChangeInit}
        onBlur={handleFixDecimals}
      />
      <ArrowDownOutlined className={styles.operationIcon} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={EDroppableId.OPERATION_LIST}>
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              className={styles.scenariosList}
              {...droppableProvided.droppableProps}
            >
              {operationsWithResult.map((operation, index) => (
                <Draggable
                  key={operation.id}
                  draggableId={operation.id}
                  index={index}
                >
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      style={draggableProvided.draggableProps.style}
                    >
                      <ScenarioOperation
                        key={operation.id}
                        operation={operation}
                        deleteOperation={handleDeleteOperation}
                        updateOperation={handleUpdateOperation}
                        dragHandleProps={draggableProvided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        icon={<PlusOutlined />}
        onClick={handleAddOperation}
        className={styles.scenarioButton}
      >
        Add operation
      </Button>
      <div className={styles.spreadContainer}>
        <Typography.Text strong>{renderSpread()}</Typography.Text>
      </div>
      <Modal
        open={deleteScenarioModalVisible}
        onCancel={() => setDeleteScenarioModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            type="default"
            onClick={() => setDeleteScenarioModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={() => {
              setDeleteScenarioModalVisible(false);
              deleteScenario(scenario.id);
            }}
          >
            Delete
          </Button>,
        ]}
      >
        Are you sure you want to delete this <b>scenario</b>?
      </Modal>
    </div>
  );
};
