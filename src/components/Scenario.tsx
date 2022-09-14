import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';

import { ScenarioOperation } from './ScenarioOperation';
import { useStore } from '../store';
import { IScenario, IOperation, IOperationWithResult } from '../types';

import { ArrowDownOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';

import styles from './Scenario.module.css';

interface Props {
  scenario: IScenario;
}

export const Scenario = ({ scenario }: Props) => {
  const [deleteScenarioModalVisible, setDeleteScenarioModalVisible] =
    useState<boolean>(false);

  const [
    deleteScenario,
    updateScenario,
    addOperation,
    updateOperation,
    deleteOperation,
  ] = useStore(
    (store) => [
      store.deleteScenario,
      store.updateScenario,
      store.addOperation,
      store.updateOperation,
      store.deleteOperation,
    ],
    shallow
  );

  const operationsWithResult: IOperationWithResult[] = useMemo(() => {
    const ops: IOperationWithResult[] = [];

    for (let op of scenario.operations) {
      ops.push({
        ...op,
        result: (ops.at(-1)?.result || scenario.init || 0) * (op.rate || 1),
      });
    }

    return ops;
  }, [scenario.operations]);

  const handleChangeInit = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    updateScenario({
      ...scenario,
      init: value ? Number(value) : null,
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

  return (
    <div className={styles.scenario}>
      <Button type="text" onClick={() => setDeleteScenarioModalVisible(true)}>
        x
      </Button>
      <Input
        placeholder="Enter input value"
        value={scenario.init!}
        onChange={handleChangeInit}
      />
      <ArrowDownOutlined className={styles.operationIcon} />
      {operationsWithResult.map((operation) => (
        <ScenarioOperation
          operation={operation}
          deleteOperation={handleDeleteOperation}
          updateOperation={handleUpdateOperation}
        />
      ))}
      <Button onClick={handleAddOperation}>+</Button>
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
