import { ChangeEvent, useState } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

import { ERateType, IOperation, IOperationWithResult } from 'types';

import {
  ArrowRightOutlined,
  DeleteOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Select, Typography } from 'antd';

import styles from './ScenarioOperation.module.css';

interface Props {
  operation: IOperationWithResult;
  deleteOperation: (operationId: string) => void;
  updateOperation: (operation: IOperation) => void;
  init?: string;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const ScenarioOperation = ({
  operation: { result, ...rawOperation },
  deleteOperation,
  updateOperation,
  dragHandleProps,
}: Props) => {
  const [deleteOperationModalVisible, setDeleteOperationModalVisible] =
    useState<boolean>(false);

  const handleChangeName = (value: string): void =>
    updateOperation({
      ...rawOperation,
      name: value || '',
    });

  const handleChangeRateType = (rateType: ERateType) => {
    updateOperation({
      ...rawOperation,
      rateType,
    });
  };

  const handleChangeRate = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    updateOperation({
      ...rawOperation,
      rate: value ?? 1,
    });
  };

  const handleFixDecimals = () => {
    updateOperation({
      ...rawOperation,
      rate: parseFloat((+rawOperation.rate).toFixed(3)).toString(),
    });
  };

  const getRatePlaceholder = () => {
    switch (rawOperation.rateType) {
      case ERateType.MUL:
      case ERateType.DIV:
      case ERateType.ADD_RAW:
      case ERateType.SUB_RAW:
        return 'Enter value';
      case ERateType.ADD_PERC:
      case ERateType.SUB_PERC:
        return 'Enter percent';
    }
    return '';
  };

  const getRateStep = () => {
    switch (rawOperation.rateType) {
      case ERateType.MUL:
      case ERateType.DIV:
        return '0.001';
      case ERateType.ADD_RAW:
      case ERateType.SUB_RAW:
      case ERateType.ADD_PERC:
      case ERateType.SUB_PERC:
        return '0.01';
    }
    return '1';
  };

  return (
    <div className={styles.scenarioOperation}>
      <div
        className={styles.operationContainer}
        style={{ border: `2px solid ${rawOperation.color || 'transparent'}` }}
      >
        <div className={styles.inputsContainer}>
          <DeleteOutlined
            className={styles.deleteButton}
            onClick={() => setDeleteOperationModalVisible(true)}
          />
          <HolderOutlined className={styles.dragButton} {...dragHandleProps} />

          <Typography.Title
            editable={{
              autoSize: { maxRows: 1 },
              onChange: handleChangeName,
            }}
            ellipsis={{
              rows: 1,
              expandable: false,
              tooltip: rawOperation.name || 'Operation',
            }}
            level={5}
            className={styles.operationName}
          >
            {rawOperation.name || 'Operation'}
          </Typography.Title>
          <Input.Group compact className={styles.rateInputGroup}>
            <Select
              value={rawOperation.rateType}
              onChange={handleChangeRateType}
            >
              <Select.Option value={ERateType.MUL}>x</Select.Option>
              <Select.Option value={ERateType.DIV}>/</Select.Option>
              <Select.Option value={ERateType.ADD_RAW}>+N</Select.Option>
              <Select.Option value={ERateType.SUB_RAW}>-N</Select.Option>
              <Select.Option value={ERateType.ADD_PERC}>+%</Select.Option>
              <Select.Option value={ERateType.SUB_PERC}>-%</Select.Option>
            </Select>
            <Input
              step={getRateStep()}
              type="number"
              placeholder={getRatePlaceholder()}
              value={rawOperation.rate!}
              onChange={handleChangeRate}
              onBlur={handleFixDecimals}
            />
          </Input.Group>
          <Typography.Text className={styles.result}>
            {`= ${result.toFixed(2)}`}
          </Typography.Text>
        </div>
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
                deleteOperation(rawOperation.id);
              }}
            >
              Delete
            </Button>,
          ]}
        >
          Are you sure you want to delete operation <b>{rawOperation.name}</b>{' '}
          from scenario?
        </Modal>
      </div>
      <ArrowRightOutlined className={styles.operationIcon} />
    </div>
  );
};
