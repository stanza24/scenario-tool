import { ChangeEvent, useState } from 'react';

import { IOperation, IOperationWithResult } from '../types';

import { ArrowDownOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Typography } from 'antd';

import styles from './ScenarioOperation.module.css';

interface Props {
  operation: IOperationWithResult;
  deleteOperation: (operationId: string) => void;
  updateOperation: (operation: IOperation) => void;
}

export const ScenarioOperation = ({
  operation,
  deleteOperation,
  updateOperation,
}: Props) => {
  const [deleteOperationModalVisible, setDeleteOperationModalVisible] =
    useState<boolean>(false);

  const handleChangeName = (value: string): void =>
    updateOperation({
      ...operation,
      name: value || '',
    });

  const handleChangeRate = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    updateOperation({
      ...operation,
      rate: value ?? 1,
    });
  };

  const handleFixDecimals = () => {
    updateOperation({
      ...operation,
      rate: String(Number(operation.rate)),
    });
  };

  return (
    <div className={styles.scenarioOperation}>
      <CloseCircleOutlined
        className={styles.deleteButton}
        onClick={() => setDeleteOperationModalVisible(true)}
      />
      <Typography.Title
        editable={{
          autoSize: { maxRows: 1 },
          onChange: handleChangeName,
        }}
        ellipsis={{
          rows: 1,
          expandable: false,
          tooltip: operation.name || 'Action',
        }}
        level={5}
        className={styles.operationName}
      >
        {operation.name || 'Action'}
      </Typography.Title>
      <div className={styles.inputRow}>
        <Input
          step="0.0001"
          type="number"
          placeholder="Enter rate"
          prefix="x"
          value={operation.rate!}
          onChange={handleChangeRate}
          onBlur={handleFixDecimals}
          className={styles.rateInput}
        />
        <Typography.Text className={styles.result}>
          = {operation.result.toFixed(0)}
        </Typography.Text>
      </div>
      <ArrowDownOutlined className={styles.operationIcon} />
      <Modal
        open={deleteOperationModalVisible}
        onCancel={() => setDeleteOperationModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            type="default"
            onClick={() => setDeleteOperationModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={() => {
              setDeleteOperationModalVisible(false);
              deleteOperation(operation.id);
            }}
          >
            Delete
          </Button>,
        ]}
      >
        Are you sure you want to delete operation <b>{operation.name}</b> from
        scenario?
      </Modal>
    </div>
  );
};
