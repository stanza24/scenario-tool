import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { ScenarioOperation } from './ScenarioOperation';
import { RootStore, useStore } from 'store';
import {
  EDroppableType,
  IOperation,
  IOperationWithResult,
  IScenario,
  IScenarioNode,
} from 'types';
import { calculateResultWithRate } from 'utils';

import {
  ArrowRightOutlined,
  CloseOutlined,
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
  collapsed: boolean;
}

export const Scenario = ({ scenario, dragHandleProps, collapsed }: Props) => {
  const [deleteScenarioModalVisible, setDeleteScenarioModalVisible] =
    useState<boolean>(false);

  const [
    deleteScenario,
    updateScenario,
    toggleCollapseScenario,
    toggleDisplayScenario,
    updateNode,
    operations,
    createOperation,
    updateOperation,
    removeNodeFromScenario,
  ] = useStore(
    (store: RootStore) => [
      store.deleteScenario,
      store.updateScenario,
      store.toggleCollapseScenario,
      store.toggleDisplayScenario,
      store.updateNode,
      store.operations,
      store.createOperation,
      store.updateOperation,
      store.removeNodeFromScenario,
    ],
    shallow
  );

  const CollapseIcon = collapsed
    ? VerticalAlignBottomOutlined
    : VerticalAlignTopOutlined;

  const operationsWithResult: IOperationWithResult[] = useMemo(() => {
    const ops: IOperationWithResult[] = [];

    for (let node of scenario.nodes) {
      const operation = operations[node.opId];

      if (operation) {
        ops.push({
          ...operation,
          rateType: node.rateType,
          result: calculateResultWithRate(
            node.rateType,
            operation.rate,
            ops.at(-1)?.result || Number(scenario.init) || 0
          ),
        });
      }
    }

    return ops;
  }, [operations, scenario.nodes, scenario.init]);

  const handleChangeInit = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    updateScenario({
      ...scenario,
      init: value || '',
    });

  const handleDeleteOperation = useCallback(
    (operationId: string): void => {
      removeNodeFromScenario(scenario.id, operationId);
    },
    [scenario.id, removeNodeFromScenario]
  );

  const handleUpdateOperation = useCallback(
    (operation: IOperation): void => {
      updateOperation(operation);
    },
    [updateOperation]
  );

  const handleUpdateNode = useCallback(
    (node: IScenarioNode): void => {
      updateNode(scenario.id, node);
    },
    [scenario.id, updateNode]
  );

  const handleFixDecimals = () => {
    updateScenario({
      ...scenario,
      init: String(Number(Number(scenario.init).toFixed(2))),
    });
  };

  const handleToggleDisplayScenario = () => toggleDisplayScenario(scenario.id);

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
          [styles.buttonsExtraCollapsed]: collapsed,
        })}
      >
        <HolderOutlined
          {...(dragHandleProps || {})}
          className={styles.dragButton}
        />
        <CloseOutlined
          onClick={handleToggleDisplayScenario}
          className={styles.closeButton}
        />
        <DeleteOutlined
          onClick={() => setDeleteScenarioModalVisible(true)}
          className={styles.deleteButton}
        />
        <CollapseIcon
          onClick={handleToggleCollapseScenario}
          className={styles.collapseButton}
        />
        {collapsed ? (
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
          [styles.scenarioCollapsed]: collapsed,
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
        <Droppable
          droppableId={scenario.id}
          type={EDroppableType.OPERATION}
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
                  draggableId={`${scenario.id}.${operation.id}`}
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
                        dragging={
                          droppableSnapshot.isDraggingOver ||
                          draggableSnapshot.isDragging
                        }
                        operation={operation}
                        deleteOperation={handleDeleteOperation}
                        updateOperation={handleUpdateOperation}
                        updateNode={handleUpdateNode}
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
        <Button
          icon={<PlusOutlined />}
          onClick={() => createOperation(scenario.id)}
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
