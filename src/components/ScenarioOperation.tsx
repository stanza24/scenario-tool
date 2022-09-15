import { ChangeEvent, useState } from 'react';

import { ERateType, IOperation, IOperationWithResult } from 'types';

import { ArrowDownOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Typography } from 'antd';

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

  const handleChangeRateType = (rateType: ERateType) => {
    updateOperation({
      ...operation,
      rateType,
    });
  };

  const handleChangeRate = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    updateOperation({
      ...operation,
      rate: value ?? 1,
    });
  };

  const handleFixDecimals = () => {
    let rate = '1';
    switch (operation.rateType) {
      case ERateType.MUL:
      case ERateType.DIV:
        rate = parseFloat((+operation.rate).toFixed(3)).toString();
        break;
      case ERateType.ADD_PERC:
      case ERateType.SUB_PERC:
        rate = parseFloat((+operation.rate).toFixed(3)).toString();
    }

    updateOperation({
      ...operation,
      rate,
    });
  };

  const getRatePlaceholder = () => {
    switch (operation.rateType) {
      case ERateType.MUL:
      case ERateType.DIV:
        return 'Enter value';
      case ERateType.ADD_PERC:
      case ERateType.SUB_PERC:
        return 'Enter percent';
    }
    return '';
  };

  const getRateStep = () => {
    switch (operation.rateType) {
      case ERateType.MUL:
      case ERateType.DIV:
        return '0.001';
      case ERateType.ADD_PERC:
      case ERateType.SUB_PERC:
        return '0.01';
    }
    return '1';
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
          tooltip: operation.name || 'Operation',
        }}
        level={5}
        className={styles.operationName}
      >
        {operation.name || 'Operation'}
      </Typography.Title>
      <div className={styles.inputRow}>
        <Input.Group compact className={styles.rateInputGroup}>
          <Select value={operation.rateType} onChange={handleChangeRateType}>
            <Select.Option value={ERateType.MUL}>x</Select.Option>
            <Select.Option value={ERateType.DIV}>/</Select.Option>
            <Select.Option value={ERateType.ADD_PERC}>+%</Select.Option>
            <Select.Option value={ERateType.SUB_PERC}>-%</Select.Option>
          </Select>
          <Input
            step={getRateStep()}
            type="number"
            placeholder={getRatePlaceholder()}
            value={operation.rate!}
            onChange={handleChangeRate}
            onBlur={handleFixDecimals}
          />
        </Input.Group>
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
