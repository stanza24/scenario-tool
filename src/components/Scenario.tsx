import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';

import { ScenarioOperation } from './ScenarioOperation';
import { useStore } from 'store';
import { IOperation, IOperationWithResult, IScenario } from 'types';
import { calculateResultWithRate } from 'utils';

import { ArrowDownOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal } from 'antd';

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
      init: value || '0',
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

  return (
    <div className={styles.scenario}>
      <Button
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
      {operationsWithResult.map((operation) => (
        <ScenarioOperation
          key={operation.id}
          operation={operation}
          deleteOperation={handleDeleteOperation}
          updateOperation={handleUpdateOperation}
        />
      ))}
      <Button onClick={handleAddOperation} className={styles.scenarioButton}>
        Add operation
      </Button>
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
