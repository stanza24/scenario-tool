import React, { useMemo, useState } from 'react';
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { ScenarioMenuItem } from './ScenarioMenuItem';
import { ScenarioOperation } from './ScenarioOperation';
import { translate } from 'translation/i18next';
import { RootStore, useStore } from 'store';
import { EDroppableId, EDroppableType } from 'types';

import {
  ApiOutlined,
  BranchesOutlined,
  HolderOutlined,
  InteractionOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Tree, Typography } from 'antd';

import styles from './Menu.module.css';

enum EDeletingType {
  SCENARIOS,
  OPERATIONS,
  BOTH,
}

const getDraggableStyle = (
  snapshot: DraggableStateSnapshot,
  nativeStyle?: DraggingStyle | NotDraggingStyle
) => {
  const styles = {
    ...(nativeStyle || {}),
    transitionDuration: `0.001s`,
  };
  if (!snapshot.isDragging) styles.transform = 'none';
  return styles;
};

const getMassDeleteModalText = (deletingType: EDeletingType | null) => {
  switch (deletingType) {
    case EDeletingType.SCENARIOS:
      return <span>{translate('Modals.MassDelete.scenariosContent')}</span>;
    case EDeletingType.OPERATIONS:
      return <span>{translate('Modals.MassDelete.operationsContent')}</span>;
    case EDeletingType.BOTH:
      return <span>{translate('Modals.MassDelete.bothContent')}</span>;
  }
};

export const Menu = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const [massDeleteModalVisible, setMassDeleteModalVisible] =
    useState<boolean>(false);
  const [deletingType, setDeletingType] = useState<EDeletingType | null>(null);

  const [
    scenarios,
    displayedScenariosIds,
    deleteScenario,
    operations,
    deleteOperation,
  ] = useStore(
    (store: RootStore) => [
      store.scenarios,
      store.displayedScenariosIds,
      store.deleteScenario,
      store.operations,
      store.deleteOperation,
    ],
    shallow
  );

  const toggleExpandTreeItem = (item: string) => {
    setExpandedKeys((keys) => {
      const selectedKeyIndex = keys.indexOf(item);

      if (selectedKeyIndex === -1) {
        return [...keys, item];
      } else {
        return [
          ...keys.slice(0, selectedKeyIndex),
          ...keys.slice(selectedKeyIndex + 1),
        ];
      }
    });
  };

  const treeData = useMemo(
    () => [
      {
        key: 'scenarios',
        title: (
          <Typography.Text
            strong
            onClick={() => toggleExpandTreeItem('scenarios')}
          >
            {translate('Components.Menu.scenariosSection')}
          </Typography.Text>
        ),
        icon: <BranchesOutlined />,
        children: Object.values(scenarios).map((scenario, index) => ({
          key: `${EDroppableType.SCENARIO}.${scenario.id}`,
          selectable: false,
          title: (
            <Droppable
              isDropDisabled
              droppableId={EDroppableId.SCENARIO_LIST}
              type={EDroppableType.SCENARIO}
            >
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef}>
                  <Draggable
                    isDragDisabled={displayedScenariosIds.includes(scenario.id)}
                    key={scenario.id}
                    draggableId={EDroppableId.SCENARIO_LIST + '.' + scenario.id}
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <>
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          style={getDraggableStyle(
                            draggableSnapshot,
                            draggableProvided.draggableProps.style
                          )}
                        >
                          {draggableSnapshot.isDragging ? (
                            <ScenarioMenuItem
                              name={scenario.name || '-'}
                              dragHandleProps={
                                draggableProvided.dragHandleProps
                              }
                            />
                          ) : (
                            <span>
                              {displayedScenariosIds.includes(scenario.id) ? (
                                <span className={styles.dragButtonStub} />
                              ) : (
                                <HolderOutlined
                                  {...draggableProvided.dragHandleProps}
                                  className={styles.dragButton}
                                />
                              )}
                              {scenario.name}
                            </span>
                          )}
                        </div>
                        {draggableSnapshot.isDragging && (
                          <span>
                            <HolderOutlined className={styles.dragButton} />
                            {scenario.name}
                          </span>
                        )}
                      </>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          ),
        })),
      },
      {
        key: 'operations',
        title: (
          <Typography.Text
            strong
            onClick={() => toggleExpandTreeItem('operations')}
          >
            {translate('Components.Menu.operationsSection')}
          </Typography.Text>
        ),
        icon: <InteractionOutlined />,
        children: Object.values(operations).map((operation, index) => ({
          key: `${EDroppableType.OPERATION}.${operation.id}`,
          title: (
            <Droppable
              isDropDisabled
              droppableId={EDroppableId.OPERATION_LIST}
              type={EDroppableType.OPERATION}
            >
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef}>
                  <Draggable
                    key={operation.id}
                    draggableId={
                      EDroppableId.OPERATION_LIST + '.' + operation.id
                    }
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <>
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          style={getDraggableStyle(
                            draggableSnapshot,
                            draggableProvided.draggableProps.style
                          )}
                        >
                          {draggableSnapshot.isDragging ? (
                            <ScenarioOperation
                              dragging
                              // @ts-ignore
                              operation={{
                                ...operation,
                                result: 0,
                              }}
                            />
                          ) : (
                            <Typography.Text>
                              <HolderOutlined
                                {...draggableProvided.dragHandleProps}
                                className={styles.dragButton}
                              />
                              <ApiOutlined
                                className={styles.operationColorIcon}
                                style={{ color: operation.color || '#000000' }}
                              />
                              {operation.name}
                            </Typography.Text>
                          )}
                        </div>
                        {draggableSnapshot.isDragging && (
                          <Typography.Text>
                            <HolderOutlined className={styles.dragButton} />
                            <ApiOutlined
                              className={styles.operationColorIcon}
                              style={{ color: operation.color || '#000000' }}
                            />
                            {operation.name}
                          </Typography.Text>
                        )}
                      </>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          ),
        })),
      },
    ],
    [scenarios, displayedScenariosIds, operations]
  );

  const handleMassDeleting = () => {
    let deletingScenarios = 0;
    let deletingOperations = 0;
    checkedKeys.forEach((key) => {
      const [type] = key.split('.');

      if (type === EDroppableType.SCENARIO) deletingScenarios++;
      else if (type === EDroppableType.OPERATION) deletingOperations++;
    });

    setMassDeleteModalVisible(true);
    switch (true) {
      case deletingScenarios > 0 && deletingOperations === 0: {
        return setDeletingType(EDeletingType.SCENARIOS);
      }
      case deletingScenarios === 0 && deletingOperations > 0: {
        return setDeletingType(EDeletingType.OPERATIONS);
      }
      case deletingScenarios > 0 && deletingOperations > 0: {
        return setDeletingType(EDeletingType.BOTH);
      }
    }
  };

  const handleDeleteSelected = () => {
    checkedKeys.forEach((key) => {
      const [type, id] = key.split('.');
      if (type === EDroppableType.SCENARIO) deleteScenario(id);
      else if (type === EDroppableType.OPERATION) deleteOperation(id);
    });

    setCheckedKeys([]);
    setTimeout(() => setSelecting(false));
  };

  return (
    <div className={styles.collapse}>
      <div className={styles.treeHeader}>
        {selecting ? (
          <Space>
            <Button
              type="default"
              size="small"
              onClick={() => {
                setCheckedKeys([]);
                // Без этого хака чек не успевает сброситься и ант рисует последний активный стейт
                setTimeout(() => setSelecting(false));
              }}
            >
              {translate('Actions.Cancel')}
            </Button>
            <Button
              danger
              disabled={checkedKeys.length === 0}
              type="primary"
              size="small"
              onClick={handleMassDeleting}
            >
              {translate('Actions.Delete')}
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setSelecting(true);
              setExpandedKeys(['scenarios', 'operations']);
            }}
          >
            {translate('Actions.Select')}
          </Button>
        )}
      </div>
      <Tree
        showIcon
        checkable={selecting}
        checkedKeys={checkedKeys}
        selectable={false}
        onExpand={(keys) => setExpandedKeys(keys as string[])}
        expandedKeys={expandedKeys}
        treeData={treeData}
        onCheck={(keys) =>
          setCheckedKeys(
            (keys as string[]).filter(
              (key) => key !== 'scenarios' && key !== 'operations'
            )
          )
        }
        rootClassName={styles.tree}
      />
      <Modal
        open={massDeleteModalVisible}
        onCancel={() => {
          setMassDeleteModalVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            type="default"
            onClick={() => setMassDeleteModalVisible(false)}
          >
            {translate('Actions.Cancel')}
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={() => {
              handleDeleteSelected();
              setMassDeleteModalVisible(false);
            }}
          >
            {translate('Actions.Delete')}
          </Button>,
        ]}
      >
        {getMassDeleteModalText(deletingType)}
      </Modal>
    </div>
  );
};
