import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { ScenarioOperation } from './ScenarioOperation';
import { RootStore, useStore } from 'store';
import {
  EDroppableId,
  IOperation,
  IOperationWithResult,
  IScenario,
} from 'types';
import { calculateResultWithRate } from 'utils';

import {
  ArrowRightOutlined,
  DeleteOutlined,
  HolderOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Typography } from 'antd';

import styles from './Scenario.module.css';
import operationStyles from './ScenarioOperation.module.css';
import classNames from 'classnames';

interface Props {
  scenario: IScenario;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const Scenario = ({ scenario, dragHandleProps }: Props) => {
  const [deleteScenarioModalVisible, setDeleteScenarioModalVisible] =
    useState<boolean>(false);

  const [
    collapsedScenariosIds,
    deleteScenario,
    updateScenario,
    toggleCollapseScenario,
    addOperation,
    updateOperation,
    deleteOperation,
    moveOperation,
  ] = useStore(
    (store: RootStore) => [
      store.collapsedScenariosIds,
      store.deleteScenario,
      store.updateScenario,
      store.toggleCollapseScenario,
      store.addOperation,
      store.updateOperation,
      store.deleteOperation,
      store.moveOperation,
    ],
    shallow
  );

  const isCollapsed = collapsedScenariosIds.some((id) => scenario.id === id);
  const CollapseIcon = isCollapsed
    ? VerticalAlignBottomOutlined
    : VerticalAlignTopOutlined;

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

  const handleToggleCollapseScenario = () =>
    toggleCollapseScenario(scenario.id);

  const handleChangeScenarioName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    updateScenario({
      ...scenario,
      name: value,
    });

  const handleFixScenarioName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value === '')
      updateScenario({
        ...scenario,
        name: 'Scenario',
      });
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
    <>
      <div
        className={classNames(styles.buttonsExtra, {
          [styles.buttonsExtraCollapsed]: isCollapsed,
        })}
      >
        <HolderOutlined
          {...(dragHandleProps || {})}
          className={styles.dragButton}
        />
        <DeleteOutlined
          onClick={() => setDeleteScenarioModalVisible(true)}
          className={styles.deleteButton}
        />
        <CollapseIcon
          onClick={handleToggleCollapseScenario}
          className={styles.collapseButton}
        />
        {isCollapsed ? (
          <Typography.Text strong className={styles.scenarioNameText}>
            {scenario.name}
          </Typography.Text>
        ) : (
          <Input
            value={scenario.name}
            size="small"
            onChange={handleChangeScenarioName}
            onBlur={handleFixScenarioName}
            className={styles.scenarioName}
          />
        )}
      </div>
      <div
        className={classNames(styles.scenario, {
          [styles.scenarioCollapsed]: isCollapsed,
        })}
      >
        <Input
          type="number"
          step="0.01"
          placeholder="Enter input value"
          value={scenario.init!}
          onChange={handleChangeInit}
          onBlur={handleFixDecimals}
          className={styles.initInput}
        />
        <ArrowRightOutlined className={styles.operationIcon} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId={EDroppableId.OPERATION_LIST}
            direction="horizontal"
          >
            {(droppableProvided, droppableSnapshot) => (
              <div
                ref={droppableProvided.innerRef}
                className={classNames(styles.operationsList, {
                  [styles.operationsListDragging]:
                    droppableSnapshot.isDraggingOver,
                })}
                {...droppableProvided.droppableProps}
              >
                {operationsWithResult.map((operation, index) => (
                  <Draggable
                    key={operation.id}
                    draggableId={operation.id}
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        style={draggableProvided.draggableProps.style}
                        className={classNames(
                          operationStyles.operationDraggableContainer,
                          {
                            [operationStyles.operationDraggingContainer]:
                              draggableSnapshot.isDragging,
                          }
                        )}
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
          Add
        </Button>
        <Typography.Text strong className={styles.spreadContainer}>
          {renderSpread()}
        </Typography.Text>
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
    </>
  );
};
